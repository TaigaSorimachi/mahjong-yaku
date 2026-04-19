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

export function ScoreCalculator() {
  const [han, setHan] = useState(1)
  const [fu, setFu] = useState(30)
  const [playerType, setPlayerType] = useState<PlayerType>('ko')
  const [winType, setWinType] = useState<WinType>('ron')

  const result = useMemo(() => {
    // 5翻以上は満貫以上
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
          }
        } else {
          const each = manganScores.oya.tsumo[level]
          return {
            total: each * 3,
            breakdown: `${each}点オール`,
            level,
          }
        }
      } else {
        if (winType === 'ron') {
          return {
            total: manganScores.ko.ron[level],
            breakdown: null,
            level,
          }
        } else {
          const [ko, oya] = manganScores.ko.tsumo[level]
          return {
            total: ko * 2 + oya,
            breakdown: `${ko}/${oya}点`,
            level,
          }
        }
      }
    }

    // 4翻以下は符計算
    const hanIndex = han - 1

    if (playerType === 'oya') {
      if (winType === 'ron') {
        const score = oyaRonTable[fu]?.[hanIndex]
        if (!score) return null
        return { total: score, breakdown: null, level: null }
      } else {
        const each = oyaTsumoTable[fu]?.[hanIndex]
        if (!each) return null
        return {
          total: each * 3,
          breakdown: `${each}点オール`,
          level: null,
        }
      }
    } else {
      if (winType === 'ron') {
        const score = koRonTable[fu]?.[hanIndex]
        if (!score) return null
        return { total: score, breakdown: null, level: null }
      } else {
        const tsumoData = koTsumoTable[fu]?.[hanIndex]
        if (!tsumoData) return null
        const [ko, oya] = tsumoData
        return {
          total: ko * 2 + oya,
          breakdown: `${ko}/${oya}点`,
          level: null,
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
    doubleYakuman: 'ダブル役満',
  }

  return (
    <div className="p-4 space-y-6">
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
            5翻以上は符に関係なく満貫以上になります
          </p>
        )}
      </div>

      {/* 親/子 */}
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
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            子
          </button>
          <button
            onClick={() => setPlayerType('oya')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
              playerType === 'oya'
                ? 'bg-mahjong-green-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            親
          </button>
        </div>
      </div>

      {/* ツモ/ロン */}
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
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            ロン
          </button>
          <button
            onClick={() => setWinType('tsumo')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
              winType === 'tsumo'
                ? 'bg-mahjong-green-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            ツモ
          </button>
        </div>
      </div>

      {/* 結果 */}
      <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-6 text-center">
        {result ? (
          <>
            {result.level && (
              <p className="text-lg font-bold text-mahjong-green-500 mb-2">
                {levelLabels[result.level]}
              </p>
            )}
            <p className="text-4xl font-bold text-gray-900 dark:text-gray-100">
              {result.total.toLocaleString()}点
            </p>
            {result.breakdown && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                {winType === 'tsumo' && playerType === 'ko' && '子/親: '}
                {result.breakdown}
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
