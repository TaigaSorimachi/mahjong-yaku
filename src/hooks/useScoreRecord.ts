import { useState, useEffect } from 'react'
import { GameRecord, PlayerScore } from '../types/score'

const STORAGE_KEY = 'mahjong-score-records'

export function useScoreRecord() {
  const [records, setRecords] = useState<GameRecord[]>(() => {
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
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records))
  }, [records])

  const addRecord = (players: PlayerScore[]) => {
    const newRecord: GameRecord = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      players,
    }
    setRecords((prev) => [newRecord, ...prev])
  }

  const deleteRecord = (id: string) => {
    setRecords((prev) => prev.filter((record) => record.id !== id))
  }

  const clearAllRecords = () => {
    setRecords([])
  }

  return {
    records,
    addRecord,
    deleteRecord,
    clearAllRecords,
  }
}
