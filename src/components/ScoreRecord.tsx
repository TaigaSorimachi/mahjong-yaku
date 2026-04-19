import { useState } from 'react'
import { PlayerScore } from '../types/score'
import { useScoreRecord } from '../hooks/useScoreRecord'

const defaultPlayerNames = ['東家', '南家', '西家', '北家']

export function ScoreRecord() {
  const { records, addRecord, deleteRecord } = useScoreRecord()
  const [players, setPlayers] = useState<PlayerScore[]>(
    defaultPlayerNames.map((name) => ({ name, score: 25000 }))
  )

  const handleNameChange = (index: number, name: string) => {
    setPlayers((prev) => {
      const next = [...prev]
      next[index] = { ...next[index], name }
      return next
    })
  }

  const handleScoreChange = (index: number, scoreStr: string) => {
    const score = parseInt(scoreStr, 10) || 0
    setPlayers((prev) => {
      const next = [...prev]
      next[index] = { ...next[index], score }
      return next
    })
  }

  const handleSave = () => {
    addRecord(players)
    // 入力をリセット
    setPlayers(defaultPlayerNames.map((name) => ({ name, score: 25000 })))
  }

  const totalScore = players.reduce((sum, p) => sum + p.score, 0)
  const isValidTotal = totalScore === 100000

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('ja-JP', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="p-4 space-y-6">
      {/* 入力フォーム */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
          半荘結果を記録
        </h2>
        <div className="space-y-3">
          {players.map((player, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={player.name}
                onChange={(e) => handleNameChange(index, e.target.value)}
                placeholder="プレイヤー名"
                className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-mahjong-green-500 focus:border-transparent"
              />
              <input
                type="number"
                value={player.score}
                onChange={(e) => handleScoreChange(index, e.target.value)}
                placeholder="点数"
                className="w-28 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-right focus:ring-2 focus:ring-mahjong-green-500 focus:border-transparent"
              />
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <p
            className={`text-sm ${
              isValidTotal
                ? 'text-gray-500 dark:text-gray-400'
                : 'text-red-500 dark:text-red-400'
            }`}
          >
            合計: {totalScore.toLocaleString()}点
            {!isValidTotal && ' (100,000点にしてください)'}
          </p>
          <button
            onClick={handleSave}
            disabled={!isValidTotal}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              isValidTotal
                ? 'bg-mahjong-green-500 text-white hover:bg-mahjong-green-600'
                : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
            }`}
          >
            保存
          </button>
        </div>
      </div>

      {/* 履歴一覧 */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3">
          履歴
        </h2>
        {records.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">
            記録がありません
          </p>
        ) : (
          <div className="space-y-3">
            {records.map((record) => (
              <div
                key={record.id}
                className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(record.date)}
                  </p>
                  <button
                    onClick={() => deleteRecord(record.id)}
                    className="text-red-500 hover:text-red-600 text-sm"
                  >
                    削除
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {record.players.map((player, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {player.name}
                      </span>
                      <span
                        className={`font-medium ${
                          player.score >= 25000
                            ? 'text-mahjong-green-500'
                            : 'text-red-500'
                        }`}
                      >
                        {player.score.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
