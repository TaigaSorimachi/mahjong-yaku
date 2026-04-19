import { useState, useMemo } from 'react'
import { PlayerScore, SettlementConfig } from '../types/score'
import { calculateSettlement, defaultConfig } from '../utils/settlement'

const umaPresets: { label: string; uma: [number, number, number, number] }[] = [
  { label: '10-20', uma: [20, 10, -10, -20] },
  { label: '10-30', uma: [30, 10, -10, -30] },
  { label: '20-30', uma: [30, 20, -20, -30] },
  { label: 'ウマなし', uma: [0, 0, 0, 0] },
]

const ratePresets = [
  { label: '点1', rate: 10 },
  { label: '点3', rate: 30 },
  { label: '点5', rate: 50 },
  { label: '点ピン', rate: 100 },
]

const defaultPlayerNames = ['東家', '南家', '西家', '北家']

export function SettlementPage() {
  const [players, setPlayers] = useState<PlayerScore[]>(
    defaultPlayerNames.map((name) => ({ name, score: 25000 }))
  )
  const [config, setConfig] = useState<SettlementConfig>(defaultConfig)

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

  const totalScore = players.reduce((sum, p) => sum + p.score, 0)
  const isValidTotal = totalScore === 100000

  const results = useMemo(() => {
    if (!isValidTotal) return null
    return calculateSettlement(players, config)
  }, [players, config, isValidTotal])

  const getRankStyle = (rank: number) => {
    const styles = [
      'bg-gradient-to-r from-yellow-400 to-yellow-300 text-yellow-900',
      'bg-gradient-to-r from-gray-300 to-gray-200 text-gray-800',
      'bg-gradient-to-r from-orange-400 to-orange-300 text-orange-900',
      'bg-gradient-to-r from-gray-500 to-gray-400 text-white',
    ]
    return styles[rank - 1] || styles[3]
  }

  return (
    <div className="p-4 pb-24 space-y-6">
      {/* 設定 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
          精算設定
        </h2>

        {/* ウマ */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            ウマ
          </label>
          <div className="flex flex-wrap gap-2">
            {umaPresets.map((preset) => (
              <button
                key={preset.label}
                onClick={() => setConfig((c) => ({ ...c, uma: preset.uma }))}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  JSON.stringify(config.uma) === JSON.stringify(preset.uma)
                    ? 'bg-mahjong-green-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* レート */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            レート
          </label>
          <div className="flex flex-wrap gap-2">
            {ratePresets.map((preset) => (
              <button
                key={preset.label}
                onClick={() => setConfig((c) => ({ ...c, rate: preset.rate }))}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  config.rate === preset.rate
                    ? 'bg-mahjong-green-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* 返し点 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            返し点
          </label>
          <div className="flex gap-2">
            {[25000, 30000].map((point) => (
              <button
                key={point}
                onClick={() => setConfig((c) => ({ ...c, returnPoint: point }))}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  config.returnPoint === point
                    ? 'bg-mahjong-green-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                {point.toLocaleString()}点
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 点数入力 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
          最終点数
        </h2>
        <div className="space-y-3">
          {players.map((player, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={player.name}
                onChange={(e) => handleNameChange(index, e.target.value)}
                placeholder="名前"
                className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-mahjong-green-500 focus:border-transparent"
              />
              <input
                type="number"
                value={player.score}
                onChange={(e) => handleScoreChange(index, e.target.value)}
                className="w-28 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-right focus:ring-2 focus:ring-mahjong-green-500 focus:border-transparent"
              />
            </div>
          ))}
        </div>
        <p
          className={`mt-2 text-sm ${
            isValidTotal
              ? 'text-gray-500 dark:text-gray-400'
              : 'text-red-500 dark:text-red-400'
          }`}
        >
          合計: {totalScore.toLocaleString()}点
          {!isValidTotal && ' (100,000点にしてください)'}
        </p>
      </div>

      {/* 精算結果 */}
      {results && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
            精算結果
          </h2>
          <div className="space-y-3">
            {results.map((result) => (
              <div
                key={result.name}
                className={`rounded-xl p-4 ${getRankStyle(result.rank)}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">{result.rank}位</span>
                    <span className="text-lg font-medium">{result.name}</span>
                  </div>
                  <span className="text-sm opacity-80">
                    {result.rawScore.toLocaleString()}点
                  </span>
                </div>
                <div className="flex items-end justify-between">
                  <div className="text-sm opacity-80">
                    <p>素点: {result.finalPoint - result.umaBonus - result.okaBonus}</p>
                    <p>
                      ウマ: {result.umaBonus > 0 ? '+' : ''}
                      {result.umaBonus}
                    </p>
                    {result.okaBonus > 0 && <p>オカ: +{result.okaBonus}</p>}
                  </div>
                  <div className="text-right">
                    <p className="text-xs opacity-70">最終ポイント</p>
                    <p className="text-2xl font-bold">
                      {result.finalPoint > 0 ? '+' : ''}
                      {result.finalPoint}
                    </p>
                    <p
                      className={`text-lg font-bold ${
                        result.payment >= 0 ? 'text-green-800' : 'text-red-800'
                      }`}
                    >
                      {result.payment >= 0 ? '+' : ''}
                      {result.payment.toLocaleString()}円
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
