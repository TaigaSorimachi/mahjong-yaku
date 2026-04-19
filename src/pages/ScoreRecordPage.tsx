import { useState, useMemo } from 'react'
import { WinType } from '../types/score'
import { useGameSession } from '../hooks/useGameSession'

const defaultPlayers = ['自分', 'プレイヤー2', 'プレイヤー3', 'プレイヤー4']

// よく使う点数パターン（子ロン基準）
const commonScores = {
  ko: {
    ron: [
      { label: '1翻30符', score: 1000, han: 1, fu: 30 },
      { label: '2翻30符', score: 2000, han: 2, fu: 30 },
      { label: '3翻30符', score: 3900, han: 3, fu: 30 },
      { label: '4翻30符', score: 7700, han: 4, fu: 30 },
      { label: '1翻40符', score: 1300, han: 1, fu: 40 },
      { label: '2翻40符', score: 2600, han: 2, fu: 40 },
      { label: '3翻40符', score: 5200, han: 3, fu: 40 },
      { label: '満貫', score: 8000, han: 5, fu: 0 },
      { label: '跳満', score: 12000, han: 6, fu: 0 },
      { label: '倍満', score: 16000, han: 8, fu: 0 },
      { label: '三倍満', score: 24000, han: 11, fu: 0 },
      { label: '役満', score: 32000, han: 13, fu: 0 },
    ],
    tsumo: [
      { label: '1翻30符', score: 1100, display: '300/500', han: 1, fu: 30 },
      { label: '2翻30符', score: 2000, display: '500/1000', han: 2, fu: 30 },
      { label: '3翻30符', score: 4000, display: '1000/2000', han: 3, fu: 30 },
      { label: '4翻30符', score: 7900, display: '2000/3900', han: 4, fu: 30 },
      { label: '満貫', score: 8000, display: '2000/4000', han: 5, fu: 0 },
      { label: '跳満', score: 12000, display: '3000/6000', han: 6, fu: 0 },
      { label: '倍満', score: 16000, display: '4000/8000', han: 8, fu: 0 },
      { label: '三倍満', score: 24000, display: '6000/12000', han: 11, fu: 0 },
      { label: '役満', score: 32000, display: '8000/16000', han: 13, fu: 0 },
    ],
  },
  oya: {
    ron: [
      { label: '1翻30符', score: 1500, han: 1, fu: 30 },
      { label: '2翻30符', score: 2900, han: 2, fu: 30 },
      { label: '3翻30符', score: 5800, han: 3, fu: 30 },
      { label: '4翻30符', score: 11600, han: 4, fu: 30 },
      { label: '1翻40符', score: 2000, han: 1, fu: 40 },
      { label: '2翻40符', score: 3900, han: 2, fu: 40 },
      { label: '3翻40符', score: 7700, han: 3, fu: 40 },
      { label: '満貫', score: 12000, han: 5, fu: 0 },
      { label: '跳満', score: 18000, han: 6, fu: 0 },
      { label: '倍満', score: 24000, han: 8, fu: 0 },
      { label: '三倍満', score: 36000, han: 11, fu: 0 },
      { label: '役満', score: 48000, han: 13, fu: 0 },
    ],
    tsumo: [
      { label: '1翻30符', score: 1500, display: '500all', han: 1, fu: 30 },
      { label: '2翻30符', score: 3000, display: '1000all', han: 2, fu: 30 },
      { label: '3翻30符', score: 6000, display: '2000all', han: 3, fu: 30 },
      { label: '4翻30符', score: 11700, display: '3900all', han: 4, fu: 30 },
      { label: '満貫', score: 12000, display: '4000all', han: 5, fu: 0 },
      { label: '跳満', score: 18000, display: '6000all', han: 6, fu: 0 },
      { label: '倍満', score: 24000, display: '8000all', han: 8, fu: 0 },
      { label: '三倍満', score: 36000, display: '12000all', han: 11, fu: 0 },
      { label: '役満', score: 48000, display: '16000all', han: 13, fu: 0 },
    ],
  },
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

  // 現在のスコア
  const currentScores = activeSession ? calculateScores(activeSession) : {}

  // 選択可能な点数パターン
  const scoreOptions = useMemo(() => {
    const playerType = isOya ? 'oya' : 'ko'
    return commonScores[playerType][winType]
  }, [isOya, winType])

  const handleStartSession = () => {
    startSession(playerNames)
    setShowNewSession(false)
    setWinner(playerNames[0])
  }

  const handleQuickAdd = (option: (typeof scoreOptions)[0]) => {
    if (!activeSession || !winner) return
    if (winType === 'ron' && !loser) return

    addRound(activeSession.id, {
      winner,
      loser: winType === 'ron' ? loser : null,
      winType,
      isOya,
      han: option.han,
      fu: option.fu,
      score: option.score,
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

  // TypeScript null safety
  if (!activeSession) return null

  const canAddRound = winner && (winType === 'tsumo' || loser)

  return (
    <div className="p-4 pb-24 space-y-4">
      {/* 現在のスコア */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-3 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
            現在の点数
          </span>
          <button
            onClick={() => endSession(activeSession.id)}
            className="text-xs text-red-500 hover:text-red-600 px-2 py-1"
          >
            半荘終了
          </button>
        </div>
        <div className="grid grid-cols-4 gap-1">
          {activeSession.players.map((player) => (
            <div
              key={player}
              className="text-center px-1 py-2 bg-gray-50 dark:bg-gray-700 rounded"
            >
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {player}
              </p>
              <p
                className={`text-sm font-bold ${
                  currentScores[player] >= 25000
                    ? 'text-mahjong-green-500'
                    : 'text-red-500'
                }`}
              >
                {Math.round(currentScores[player] / 100) / 10}k
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ステップ1: 和了者 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          ① 誰が上がった？
        </p>
        <div className="grid grid-cols-4 gap-2">
          {activeSession.players.map((player) => (
            <button
              key={player}
              onClick={() => {
                setWinner(player)
                // 放銃者リセット
                if (loser === player) setLoser(null)
              }}
              className={`py-3 rounded-xl text-sm font-bold transition-all ${
                winner === player
                  ? 'bg-mahjong-green-500 text-white scale-105 shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              {player}
            </button>
          ))}
        </div>
      </div>

      {/* ステップ2: ツモ/ロン */}
      {winner && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            ② ツモ？ロン？
          </p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => {
                setWinType('tsumo')
                setLoser(null)
              }}
              className={`py-4 rounded-xl font-bold text-lg transition-all ${
                winType === 'tsumo'
                  ? 'bg-purple-500 text-white scale-105 shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              ツモ
            </button>
            <button
              onClick={() => setWinType('ron')}
              className={`py-4 rounded-xl font-bold text-lg transition-all ${
                winType === 'ron'
                  ? 'bg-orange-500 text-white scale-105 shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              ロン
            </button>
          </div>
        </div>
      )}

      {/* ステップ3: 放銃者（ロンの場合） */}
      {winner && winType === 'ron' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            ③ 誰から？
          </p>
          <div className="grid grid-cols-3 gap-2">
            {activeSession.players
              .filter((p) => p !== winner)
              .map((player) => (
                <button
                  key={player}
                  onClick={() => setLoser(player)}
                  className={`py-3 rounded-xl text-sm font-bold transition-all ${
                    loser === player
                      ? 'bg-red-500 text-white scale-105 shadow-lg'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {player}
                </button>
              ))}
          </div>
        </div>
      )}

      {/* ステップ4: 親/子 */}
      {canAddRound && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            ④ 和了者は親？子？
          </p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setIsOya(false)}
              className={`py-3 rounded-xl font-bold transition-all ${
                !isOya
                  ? 'bg-blue-500 text-white scale-105 shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              子
            </button>
            <button
              onClick={() => setIsOya(true)}
              className={`py-3 rounded-xl font-bold transition-all ${
                isOya
                  ? 'bg-red-500 text-white scale-105 shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              親
            </button>
          </div>
        </div>
      )}

      {/* ステップ5: 点数選択（ワンタップ） */}
      {canAddRound && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            ⑤ 点数をタップで記録
          </p>
          <div className="grid grid-cols-3 gap-2">
            {scoreOptions.map((option) => (
              <button
                key={option.label}
                onClick={() => handleQuickAdd(option)}
                className="py-3 px-2 bg-gradient-to-br from-mahjong-green-400 to-mahjong-green-600 text-white rounded-xl font-medium transition-all hover:scale-105 hover:shadow-lg active:scale-95"
              >
                <p className="text-xs opacity-80">{option.label}</p>
                <p className="text-lg font-bold">
                  {option.score >= 10000
                    ? `${option.score / 1000}k`
                    : option.score.toLocaleString()}
                </p>
                {'display' in option && (
                  <p className="text-xs opacity-70">{option.display}</p>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 履歴 */}
      {activeSession.rounds.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
            今半荘の記録 ({activeSession.rounds.length}局)
          </h3>
          <div className="space-y-1">
            {[...activeSession.rounds].reverse().slice(0, 5).map((round) => (
              <div
                key={round.id}
                className="flex items-center justify-between px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg text-sm"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                      round.winType === 'tsumo'
                        ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300'
                        : 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300'
                    }`}
                  >
                    {round.winType === 'tsumo' ? 'ツモ' : 'ロン'}
                  </span>
                  <span className="font-medium text-mahjong-green-600 dark:text-mahjong-green-400">
                    {round.winner}
                  </span>
                  {round.loser && (
                    <>
                      <span className="text-gray-400">←</span>
                      <span className="text-red-500">{round.loser}</span>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold">{round.score.toLocaleString()}</span>
                  <button
                    onClick={() => deleteRound(activeSession.id, round.id)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
            {activeSession.rounds.length > 5 && (
              <p className="text-center text-xs text-gray-400 py-1">
                他 {activeSession.rounds.length - 5} 件...
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
