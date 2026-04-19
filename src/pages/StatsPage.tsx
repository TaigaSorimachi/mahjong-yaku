import { useMemo } from 'react'
import { useScoreRecord } from '../hooks/useScoreRecord'
import { calculatePlayerStats, defaultConfig } from '../utils/settlement'

export function StatsPage() {
  const { records } = useScoreRecord()

  const stats = useMemo(() => {
    return calculatePlayerStats(records, defaultConfig)
  }, [records])

  const getRankColor = (rank: number) => {
    if (rank <= 1.5) return 'text-yellow-500'
    if (rank <= 2.0) return 'text-mahjong-green-500'
    if (rank <= 2.5) return 'text-blue-500'
    if (rank <= 3.0) return 'text-orange-500'
    return 'text-red-500'
  }

  if (records.length === 0) {
    return (
      <div className="p-4 pb-24">
        <div className="text-center py-16">
          <p className="text-4xl mb-4">📊</p>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-2">
            統計データがありません
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            「記録」タブで半荘結果を記録すると
            <br />
            ここに統計が表示されます
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 pb-24 space-y-6">
      {/* サマリー */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3">
          全体サマリー
        </h2>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-3xl font-bold text-mahjong-green-500">
              {records.length}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">半荘数</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-blue-500">{stats.length}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              プレイヤー数
            </p>
          </div>
          <div>
            <p className="text-3xl font-bold text-purple-500">
              {(records.length * 4).toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              総プレイ回数
            </p>
          </div>
        </div>
      </div>

      {/* プレイヤー別統計 */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3">
          プレイヤー別成績
        </h2>
        <div className="space-y-3">
          {stats.map((player, index) => (
            <div
              key={player.name}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                      index === 0
                        ? 'bg-yellow-400 text-yellow-900'
                        : index === 1
                          ? 'bg-gray-300 text-gray-800'
                          : index === 2
                            ? 'bg-orange-400 text-orange-900'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    {index + 1}
                  </span>
                  <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    {player.name}
                  </span>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {player.totalGames}半荘
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2 mb-3">
                <div className="text-center p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p
                    className={`text-xl font-bold ${getRankColor(player.averageRank)}`}
                  >
                    {player.averageRank.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    平均順位
                  </p>
                </div>
                <div className="text-center p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-xl font-bold text-yellow-500">
                    {player.topRate}%
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    トップ率
                  </p>
                </div>
                <div className="text-center p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-xl font-bold text-blue-500">
                    {player.rentaiRate}%
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    連帯率
                  </p>
                </div>
                <div className="text-center p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-xl font-bold text-red-500">
                    {player.lastRate}%
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    ラス率
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex justify-between px-2">
                  <span className="text-gray-500 dark:text-gray-400">
                    平均点数
                  </span>
                  <span
                    className={`font-medium ${
                      player.averageScore >= 25000
                        ? 'text-mahjong-green-500'
                        : 'text-red-500'
                    }`}
                  >
                    {player.averageScore.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between px-2">
                  <span className="text-gray-500 dark:text-gray-400">
                    収支合計
                  </span>
                  <span
                    className={`font-medium ${
                      player.totalPayment >= 0
                        ? 'text-mahjong-green-500'
                        : 'text-red-500'
                    }`}
                  >
                    {player.totalPayment >= 0 ? '+' : ''}
                    {player.totalPayment.toLocaleString()}円
                  </span>
                </div>
                <div className="flex justify-between px-2">
                  <span className="text-gray-500 dark:text-gray-400">
                    最高点数
                  </span>
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    {player.maxScore.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between px-2">
                  <span className="text-gray-500 dark:text-gray-400">
                    最低点数
                  </span>
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    {player.minScore.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
