import { Yaku, YakuCategory, YAKU_CATEGORIES } from '../types/yaku'
import { YakuCard } from './YakuCard'

interface YakuSectionProps {
  category: YakuCategory
  yakuList: Yaku[]
}

export function YakuSection({ category, yakuList }: YakuSectionProps) {
  const categoryInfo = YAKU_CATEGORIES.find((c) => c.id === category)

  if (!categoryInfo || yakuList.length === 0) {
    return null
  }

  const isYakuman = category === 'yakuman' || category === 'double-yakuman'

  return (
    <section className="mb-8">
      <h2
        className={`text-xl font-bold mb-4 pb-2 border-b-2 ${
          isYakuman
            ? 'border-mahjong-red-500 text-mahjong-red-500'
            : 'border-mahjong-green-500 text-mahjong-green-500'
        }`}
      >
        {categoryInfo.label}
        <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">
          ({yakuList.length}種)
        </span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {yakuList.map((yaku) => (
          <YakuCard key={yaku.id} yaku={yaku} />
        ))}
      </div>
    </section>
  )
}
