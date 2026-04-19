import { useState, useMemo } from 'react'
import { WinType, PlayerType } from '../types/score'
import {
  koRonTable,
  koTsumoTable,
  oyaRonTable,
  oyaTsumoTable,
  manganScores,
  fuOptions,
  hanOptions,
} from '../data/scoreTable'

const quickButtons = [
  { label: '30符1翻', han: 1, fu: 30 },
  { label: '30符2翻', han: 2, fu: 30 },
  { label: '30符3翻', han: 3, fu: 30 },
  { label: '40符2翻', han: 2, fu: 40 },
  { label: '満貫', han: 5, fu: 30 },
  { label: '跳満', han: 6, fu: 30 },
]

export function ScoreCalculatorPage() {
  const [han, setHan] = useState(1)
  const [fu, setFu] = useState(30)
  const [playerType, setPlayerType] = useState<PlayerType>('ko')
  const [winType, setWinType] = useState<WinType>('ron')

  const result = useMemo(() => {
    if (han >= 5) {
      const level =
        han >= 13
          ? 'yakuman'
          : han >= 11
            ? 'sanbaiman'
            : han >= 8
              ? 'baiman'
              : han >= 6
                ? 'haneman'
                : 'mangan'

      if (playerType === 'oya') {
        if (winType === 'ron') {
          return {
            total: manganScores.oya.ron[level],
            breakdown: null,
            level,
            formula: null,
          }
        } else {
          const each = manganScores.oya.tsumo[level]
          return {
            total: each * 3,
            breakdown: `${each}点オール`,
            level,
            formula: null,
          }
        }
      } else {
        if (winType === 'ron') {
          return {
            total: manganScores.ko.ron[level],
            breakdown: null,
            level,
            formula: null,
          }
        } else {
          const [ko, oya] = manganScores.ko.tsumo[level]
          return {
            total: ko * 2 + oya,
            breakdown: `${ko}/${oya}点`,
            level,
            formula: null,
          }
        }
      }
    }

    const hanIndex = han - 1
    const basePoint = fu * Math.pow(2, han + 2)

    if (playerType === 'oya') {
      if (winType === 'ron') {
        const score = oyaRonTable[fu]?.[hanIndex]
        if (!score) return null
        return {
          total: score,
          breakdown: null,
          level: null,
          formula: `基本点 ${basePoint} × 6 = ${score}`,
        }
      } else {
        const each = oyaTsumoTable[fu]?.[hanIndex]
        if (!each) return null
        return {
          total: each * 3,
          breakdown: `${each}点オール`,
          level: null,
          formula: `基本点 ${basePoint} × 2 × 3人`,
        }
      }
    } else {
      if (winType === 'ron') {
        const score = koRonTable[fu]?.[hanIndex]
        if (!score) return null
        return {
          total: score,
          breakdown: null,
          level: null,
          formula: `基本点 ${basePoint} × 4 = ${score}`,
        }
      } else {
        const tsumoData = koTsumoTable[fu]?.[hanIndex]
        if (!tsumoData) return null
        const [ko, oya] = tsumoData
        return {
          total: ko * 2 + oya,
          breakdown: `${ko}/${oya}点`,
          level: null,
          formula: `子${ko} × 2 + 親${oya}`,
        }
      }
    }
  }, [han, fu, playerType, winType])

  const levelLabels: Record<string, string> = {
    mangan: '満貫',
    haneman: '跳満',
    baiman: '倍満',
    sanbaiman: '三倍満',
    yakuman: '役満',
  }

  return (
    <div className="p-4 pb-24 space-y-6">
      {/* クイックボタン */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          よく使う組み合わせ
        </label>
        <div className="flex flex-wrap gap-2">
          {quickButtons.map((btn) => (
            <button
              key={btn.label}
              onClick={() => {
                setHan(btn.han)
                setFu(btn.fu)
              }}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                han === btn.han && fu === btn.fu
                  ? 'bg-mahjong-green-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* 翻数 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          翻数
        </label>
        <div className="flex flex-wrap gap-2">
          {hanOptions.map((h) => (
            <button
              key={h}
              onClick={() => setHan(h)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                han === h
                  ? 'bg-mahjong-green-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {h === 13 ? '13+' : h}翻
            </button>
          ))}
        </div>
      </div>

      {/* 符 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          符
        </label>
        <div className="flex flex-wrap gap-2">
          {fuOptions.map((f) => (
            <button
              key={f}
              onClick={() => setFu(f)}
              disabled={han >= 5}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                han >= 5
                  ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                  : fu === f
                    ? 'bg-mahjong-green-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {f}符
            </button>
          ))}
        </div>
        {han >= 5 && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            5翻以上は符に関係なく満貫以上
          </p>
        )}
      </div>

      {/* 親/子 & ツモ/ロン */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            親/子
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => setPlayerType('ko')}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                playerType === 'ko'
                  ? 'bg-mahjong-green-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              子
            </button>
            <button
              onClick={() => setPlayerType('oya')}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                playerType === 'oya'
                  ? 'bg-mahjong-green-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              親
            </button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            和了方法
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => setWinType('ron')}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                winType === 'ron'
                  ? 'bg-mahjong-green-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              ロン
            </button>
            <button
              onClick={() => setWinType('tsumo')}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                winType === 'tsumo'
                  ? 'bg-mahjong-green-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              ツモ
            </button>
          </div>
        </div>
      </div>

      {/* 結果 */}
      <div className="bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 text-center shadow-inner">
        {result ? (
          <>
            {result.level && (
              <p className="text-lg font-bold text-mahjong-green-500 mb-2">
                {levelLabels[result.level]}
              </p>
            )}
            <p className="text-5xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {result.total.toLocaleString()}
              <span className="text-2xl ml-1">点</span>
            </p>
            {result.breakdown && (
              <p className="text-lg text-gray-600 dark:text-gray-400">
                {winType === 'tsumo' && playerType === 'ko' && '子/親: '}
                {result.breakdown}
              </p>
            )}
            {result.formula && (
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-3 font-mono">
                {result.formula}
              </p>
            )}
          </>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">
            この組み合わせは存在しません
          </p>
        )}
      </div>
    </div>
  )
}
