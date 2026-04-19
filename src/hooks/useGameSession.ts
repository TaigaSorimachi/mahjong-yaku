import { useState, useEffect } from 'react'
import { GameSession, RoundRecord } from '../types/score'

const STORAGE_KEY = 'mahjong-game-sessions'

export function useGameSession() {
  const [sessions, setSessions] = useState<GameSession[]>(() => {
    if (typeof window === 'undefined') return []
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        return JSON.parse(stored)
      } catch {
        return []
      }
    }
    return []
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions))
  }, [sessions])

  // アクティブなセッションを取得
  const activeSession = sessions.find((s) => s.isActive) || null

  // 新しいセッション（半荘）を開始
  const startSession = (players: string[]) => {
    const newSession: GameSession = {
      id: crypto.randomUUID(),
      startTime: new Date().toISOString(),
      players,
      rounds: [],
      isActive: true,
    }
    setSessions((prev) => {
      // 既存のアクティブセッションを終了
      const updated = prev.map((s) =>
        s.isActive ? { ...s, isActive: false, endTime: new Date().toISOString() } : s
      )
      return [newSession, ...updated]
    })
    return newSession
  }

  // 和了を記録
  const addRound = (
    sessionId: string,
    round: Omit<RoundRecord, 'id' | 'timestamp'>
  ) => {
    const newRound: RoundRecord = {
      ...round,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
    }
    setSessions((prev) =>
      prev.map((s) =>
        s.id === sessionId ? { ...s, rounds: [...s.rounds, newRound] } : s
      )
    )
    return newRound
  }

  // 局を削除
  const deleteRound = (sessionId: string, roundId: string) => {
    setSessions((prev) =>
      prev.map((s) =>
        s.id === sessionId
          ? { ...s, rounds: s.rounds.filter((r) => r.id !== roundId) }
          : s
      )
    )
  }

  // セッションを終了
  const endSession = (sessionId: string) => {
    setSessions((prev) =>
      prev.map((s) =>
        s.id === sessionId
          ? { ...s, isActive: false, endTime: new Date().toISOString() }
          : s
      )
    )
  }

  // セッションを削除
  const deleteSession = (sessionId: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== sessionId))
  }

  // 各プレイヤーの現在点数を計算
  const calculateScores = (session: GameSession) => {
    const scores: Record<string, number> = {}
    session.players.forEach((p) => {
      scores[p] = 25000 // 初期点数
    })

    session.rounds.forEach((round) => {
      if (round.winType === 'tsumo') {
        // ツモ: 全員から点数を受け取る
        const perPlayer = Math.ceil(round.score / 3)
        session.players.forEach((p) => {
          if (p === round.winner) {
            scores[p] += round.score
          } else {
            // 親は1.5倍払う（簡易計算）
            scores[p] -= perPlayer
          }
        })
      } else {
        // ロン: 放銃者から点数を受け取る
        scores[round.winner] += round.score
        if (round.loser) {
          scores[round.loser] -= round.score
        }
      }
    })

    return scores
  }

  return {
    sessions,
    activeSession,
    startSession,
    addRound,
    deleteRound,
    endSession,
    deleteSession,
    calculateScores,
  }
}
