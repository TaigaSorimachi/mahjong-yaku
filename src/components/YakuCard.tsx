import { Yaku } from '../types/yaku'

interface YakuCardProps {
  yaku: Yaku
}

function getHanDisplay(yaku: Yaku): string {
  if (yaku.category === 'mangan') return '満貫'
  if (yaku.category === 'yakuman') return '役満'
  if (yaku.category === 'double-yakuman') return 'W役満'

  if (yaku.hanOpen === null) {
    return `${yaku.hanClosed}翻`
  }

  if (yaku.hanClosed === yaku.hanOpen) {
    return `${yaku.hanClosed}翻`
  }

  return `${yaku.hanClosed}翻 / 副露${yaku.hanOpen}翻`
}

function getBadgeColor(yaku: Yaku): string {
  if (yaku.category === 'yakuman' || yaku.category === 'double-yakuman') {
    return 'bg-mahjong-red-500 text-white'
  }
  return 'bg-mahjong-green-500 text-white'
}

function getCardBackground(yaku: Yaku): string {
  if (yaku.category === 'yakuman' || yaku.category === 'double-yakuman') {
    return 'bg-yakuman-gold-50 dark:bg-yellow-900/20 border-yakuman-gold-200 dark:border-yellow-700/50'
  }
  return 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
}

export function YakuCard({ yaku }: YakuCardProps) {
  const isYakuman = yaku.category === 'yakuman' || yaku.category === 'double-yakuman'

  return (
    <div
      className={`relative p-4 rounded-lg border shadow-sm hover:shadow-md transition-shadow ${getCardBackground(yaku)}`}
    >
      {/* Han badge */}
      <div
        className={`absolute top-3 right-3 px-2 py-0.5 rounded text-xs font-bold ${getBadgeColor(yaku)}`}
      >
        {getHanDisplay(yaku)}
      </div>

      {/* Header */}
      <div className="pr-16 mb-3">
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">{yaku.name}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">{yaku.kana}</p>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {yaku.menzenOnly && (
          <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-xs rounded">
            門前限定
          </span>
        )}
        {yaku.hanOpen !== null && yaku.hanOpen < yaku.hanClosed && (
          <span className="px-2 py-0.5 bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300 text-xs rounded">
            食い下がり
          </span>
        )}
        {isYakuman && (
          <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 text-xs rounded">
            {yaku.category === 'double-yakuman' ? 'ダブル役満' : '役満'}
          </span>
        )}
      </div>

      {/* Condition */}
      <p className="text-sm text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">
        {yaku.condition}
      </p>

      {/* Tile example */}
      <div className="mb-3">
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">牌姿例</p>
        <div className="tile text-2xl sm:text-3xl tracking-wider overflow-x-auto whitespace-nowrap pb-1">
          {yaku.example.map((tiles, idx) => (
            <span key={idx}>{tiles}</span>
          ))}
        </div>
      </div>

      {/* Note */}
      {yaku.note && (
        <p className="text-xs text-gray-500 dark:text-gray-400 italic border-t border-gray-200 dark:border-gray-600 pt-2 mt-2">
          {yaku.note}
        </p>
      )}
    </div>
  )
}
