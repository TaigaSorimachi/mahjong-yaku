import { useState, useMemo } from 'react'
import { WinType } from '../types/score'
import { useGameSession } from '../hooks/useGameSession'
import {
  koRonTable,
  koTsumoTable,
  oyaRonTable,
  oyaTsumoTable,
  manganScores,
} from '../data/scoreTable'

const defaultPlayers = ['自分', 'プレイヤー2', 'プレイヤー3', 'プレイヤー4']

// 点数を計算する関数
function calculateScore(
  han: number,
  fu: number,
  isOya: boolean,
  winType: WinType
): number {
  if (han >= 13) {
    return isOya
      ? winType === 'ron'
        ? manganScores.oya.ron.yakuman
        : manganScores.oya.tsumo.yakuman * 3
      : winType === 'ron'
        ? manganScores.ko.ron.yakuman
        : manganScores.ko.tsumo.yakuman[0] * 2 + manganScores.ko.tsumo.yakuman[1]
  }
  if (han >= 11) {
    return isOya
      ? winType === 'ron'
        ? manganScores.oya.ron.sanbaiman
        : manganScores.oya.tsumo.sanbaiman * 3
      : winType === 'ron'
        ? manganScores.ko.ron.sanbaiman
        : manganScores.ko.tsumo.sanbaiman[0] * 2 + manganScores.ko.tsumo.sanbaiman[1]
  }
  if (han >= 8) {
    return isOya
      ? winType === 'ron'
        ? manganScores.oya.ron.baiman
        : manganScores.oya.tsumo.baiman * 3
      : winType === 'ron'
        ? manganScores.ko.ron.baiman
        : manganScores.ko.tsumo.baiman[0] * 2 + manganScores.ko.tsumo.baiman[1]
  }
  if (han >= 6) {
    return isOya
      ? winType === 'ron'
        ? manganScores.oya.ron.haneman
        : manganScores.oya.tsumo.haneman * 3
      : winType === 'ron'
        ? manganScores.ko.ron.haneman
        : manganScores.ko.tsumo.haneman[0] * 2 + manganScores.ko.tsumo.haneman[1]
  }
  if (han >= 5) {
    return isOya
      ? winType === 'ron'
        ? manganScores.oya.ron.mangan
        : manganScores.oya.tsumo.mangan * 3
      : winType === 'ron'
        ? manganScores.ko.ron.mangan
        : manganScores.ko.tsumo.mangan[0] * 2 + manganScores.ko.tsumo.mangan[1]
  }

  const hanIndex = han - 1
  if (isOya) {
    if (winType === 'ron') {
      return oyaRonTable[fu]?.[hanIndex] || 0
    } else {
      const each = oyaTsumoTable[fu]?.[hanIndex]
      return each ? each * 3 : 0
    }
  } else {
    if (winType === 'ron') {
      return koRonTable[fu]?.[hanIndex] || 0
    } else {
      const tsumo = koTsumoTable[fu]?.[hanIndex]
      return tsumo ? tsumo[0] * 2 + tsumo[1] : 0
    }
  }
}

export function ScoreRecordPage() {
  const {
    activeSession,
    sessions,
    startSession,
    addRound,
    deleteRound,
    endSession,
    deleteSession,
    calculateScores,
  } = useGameSession()

  // 新規セッション用
  const [playerNames, setPlayerNames] = useState<string[]>(defaultPlayers)
  const [showNewSession, setShowNewSession] = useState(false)

  // 和了入力用
  const [winner, setWinner] = useState<string>('')
  const [loser, setLoser] = useState<string | null>(null)
  const [winType, setWinType] = useState<WinType>('ron')
  const [isOya, setIsOya] = useState(false)
  const [han, setHan] = useState(1)
  const [fu, setFu] = useState(30)
  const [useManualScore, setUseManualScore] = useState(false)
  const [manualScore, setManualScore] = useState('')

  // 自動計算点数
  const calculatedScore = useMemo(() => {
    return calculateScore(han, fu, isOya, winType)
  }, [han, fu, isOya, winType])

  const finalScore = useManualScore
    ? parseInt(manualScore, 10) || 0
    : calculatedScore

  // 現在のスコア
  const currentScores = activeSession ? calculateScores(activeSession) : {}

  const handleStartSession = () => {
    startSession(playerNames)
    setShowNewSession(false)
    // 最初のプレイヤーを和了者に設定
    setWinner(playerNames[0])
  }

  const handleAddRound = () => {
    if (!activeSession || !winner) return

    addRound(activeSession.id, {
      winner,
      loser: winType === 'ron' ? loser : null,
      winType,
      isOya,
      han,
      fu,
      score: finalScore,
    })

    // 入力をリセット（プレイヤーは維持）
    setHan(1)
    setFu(30)
    setManualScore('')
    setUseManualScore(false)
  }

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleTimeString('ja-JP', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('ja-JP', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // アクティブセッションがない場合
  if (!activeSession && !showNewSession) {
    return (
      <div className="p-4 pb-24 space-y-6">
        <div className="text-center py-8">
          <button
            onClick={() => setShowNewSession(true)}
            className="px-6 py-3 bg-mahjong-green-500 text-white rounded-xl font-bold text-lg hover:bg-mahjong-green-600 transition-colors"
          >
            新しい半荘を開始
          </button>
        </div>

        {/* 過去のセッション */}
        {sessions.filter((s) => !s.isActive).length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3">
              過去の記録
            </h2>
            <div className="space-y-3">
              {sessions
                .filter((s) => !s.isActive)
                .slice(0, 10)
                .map((session) => {
                  const scores = calculateScores(session)
                  const sortedPlayers = [...session.players].sort(
                    (a, b) => scores[b] - scores[a]
                  )
                  return (
                    <div
                      key={session.id}
                      className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700"
                    >
                      <div className="flex justify-between items-center mb-3">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(session.startTime)} ({session.rounds.length}局)
                        </p>
                        <button
                          onClick={() => deleteSession(session.id)}
                          className="text-red-500 hover:text-red-600 text-sm"
                        >
                          削除
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {sortedPlayers.map((player, idx) => (
                          <div
                            key={player}
                            className="flex justify-between items-center px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg"
                          >
                            <div className="flex items-center gap-2">
                              <span
                                className={`w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold ${
                                  idx === 0
                                    ? 'bg-yellow-400 text-yellow-900'
                                    : idx === 1
                                      ? 'bg-gray-300 text-gray-800'
                                      : idx === 2
                                        ? 'bg-orange-400 text-orange-900'
                                        : 'bg-gray-500 text-white'
                                }`}
                              >
                                {idx + 1}
                              </span>
                              <span className="text-sm truncate">{player}</span>
                            </div>
                            <span
                              className={`font-medium ${
                                scores[player] >= 25000
                                  ? 'text-mahjong-green-500'
                                  : 'text-red-500'
                              }`}
                            >
                              {scores[player].toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
            </div>
          </div>
        )}
      </div>
    )
  }

  // 新規セッション作成画面
  if (showNewSession) {
    return (
      <div className="p-4 pb-24 space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
            プレイヤー名を入力
          </h2>
          <div className="space-y-3">
            {playerNames.map((name, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="w-8 text-center text-gray-500 dark:text-gray-400">
                  {['東', '南', '西', '北'][idx]}
                </span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    const newNames = [...playerNames]
                    newNames[idx] = e.target.value
                    setPlayerNames(newNames)
                  }}
                  className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-mahjong-green-500"
                />
              </div>
            ))}
          </div>
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => setShowNewSession(false)}
              className="flex-1 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium"
            >
              キャンセル
            </button>
            <button
              onClick={handleStartSession}
              className="flex-1 py-2 bg-mahjong-green-500 text-white rounded-lg font-medium hover:bg-mahjong-green-600"
            >
              開始
            </button>
          </div>
        </div>
      </div>
    )
  }

  // アクティブセッション画面
  // TypeScript null safety
  if (!activeSession) return null

  return (
    <div className="p-4 pb-24 space-y-4">
      {/* 現在のスコア */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-bold text-gray-900 dark:text-gray-100">現在の点数</h2>
          <button
            onClick={() => endSession(activeSession.id)}
            className="text-sm text-red-500 hover:text-red-600"
          >
            半荘終了
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {activeSession.players.map((player) => (
            <div
              key={player}
              className="flex justify-between items-center px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
                {player}
              </span>
              <span
                className={`font-bold ${
                  currentScores[player] >= 25000
                    ? 'text-mahjong-green-500'
                    : 'text-red-500'
                }`}
              >
                {currentScores[player]?.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 和了入力 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 space-y-4">
        <h2 className="font-bold text-gray-900 dark:text-gray-100">和了を記録</h2>

        {/* 和了者 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            和了者
          </label>
          <div className="grid grid-cols-2 gap-2">
            {activeSession.players.map((player) => (
              <button
                key={player}
                onClick={() => setWinner(player)}
                className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors truncate ${
                  winner === player
                    ? 'bg-mahjong-green-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                {player}
              </button>
            ))}
          </div>
        </div>

        {/* ツモ/ロン */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            和了方法
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => setWinType('tsumo')}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                winType === 'tsumo'
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              ツモ
            </button>
            <button
              onClick={() => setWinType('ron')}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                winType === 'ron'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              ロン
            </button>
          </div>
        </div>

        {/* 放銃者（ロンの場合のみ） */}
        {winType === 'ron' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              放銃者
            </label>
            <div className="grid grid-cols-2 gap-2">
              {activeSession.players
                .filter((p) => p !== winner)
                .map((player) => (
                  <button
                    key={player}
                    onClick={() => setLoser(player)}
                    className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors truncate ${
                      loser === player
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {player}
                  </button>
                ))}
            </div>
          </div>
        )}

        {/* 親/子 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            和了者
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => setIsOya(false)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                !isOya
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              子
            </button>
            <button
              onClick={() => setIsOya(true)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                isOya
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              親
            </button>
          </div>
        </div>

        {/* 翻数 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            翻数
          </label>
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 11, 13].map((h) => (
              <button
                key={h}
                onClick={() => setHan(h)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  han === h
                    ? 'bg-mahjong-green-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                {h === 5
                  ? '満貫'
                  : h === 6
                    ? '跳満'
                    : h === 8
                      ? '倍満'
                      : h === 11
                        ? '三倍満'
                        : h === 13
                          ? '役満'
                          : `${h}翻`}
              </button>
            ))}
          </div>
        </div>

        {/* 符（5翻未満のみ） */}
        {han < 5 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              符
            </label>
            <div className="flex flex-wrap gap-2">
              {[20, 25, 30, 40, 50, 60, 70].map((f) => (
                <button
                  key={f}
                  onClick={() => setFu(f)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    fu === f
                      ? 'bg-mahjong-green-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {f}符
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 点数表示 */}
        <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-4 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">和了点数</p>
          {useManualScore ? (
            <input
              type="number"
              value={manualScore}
              onChange={(e) => setManualScore(e.target.value)}
              placeholder="点数を入力"
              className="w-full text-center text-2xl font-bold bg-white dark:bg-gray-800 rounded-lg py-2 border border-gray-300 dark:border-gray-600"
            />
          ) : (
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {calculatedScore > 0 ? (
                <>
                  {calculatedScore.toLocaleString()}
                  <span className="text-lg ml-1">点</span>
                </>
              ) : (
                <span className="text-red-500">計算不可</span>
              )}
            </p>
          )}
          <button
            onClick={() => setUseManualScore(!useManualScore)}
            className="mt-2 text-sm text-mahjong-green-500 hover:text-mahjong-green-600"
          >
            {useManualScore ? '自動計算に戻す' : '手動で入力'}
          </button>
        </div>

        {/* 記録ボタン */}
        <button
          onClick={handleAddRound}
          disabled={!winner || (winType === 'ron' && !loser) || finalScore === 0}
          className="w-full py-3 bg-mahjong-green-500 text-white rounded-xl font-bold text-lg hover:bg-mahjong-green-600 disabled:bg-gray-300 disabled:text-gray-500 transition-colors"
        >
          和了を記録
        </button>
      </div>

      {/* 履歴 */}
      {activeSession.rounds.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="font-bold text-gray-900 dark:text-gray-100 mb-3">
            今半荘の和了 ({activeSession.rounds.length}局)
          </h2>
          <div className="space-y-2">
            {[...activeSession.rounds].reverse().map((round) => (
              <div
                key={round.id}
                className="flex items-center justify-between px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-xs text-gray-400">{formatTime(round.timestamp)}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                      round.winType === 'tsumo'
                        ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300'
                        : 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300'
                    }`}
                  >
                    {round.winType === 'tsumo' ? 'ツモ' : 'ロン'}
                  </span>
                  <span className="text-sm truncate">
                    <span className="font-medium text-mahjong-green-500">{round.winner}</span>
                    {round.loser && (
                      <>
                        <span className="text-gray-400 mx-1">←</span>
                        <span className="text-red-500">{round.loser}</span>
                      </>
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {round.han}翻
                    {round.han < 5 && `${round.fu}符`}
                  </span>
                  <span className="font-bold text-sm">
                    {round.score.toLocaleString()}
                  </span>
                  <button
                    onClick={() => deleteRound(activeSession.id, round.id)}
                    className="text-red-400 hover:text-red-500 text-xs"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
