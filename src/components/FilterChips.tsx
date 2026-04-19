import { YakuCategory, YAKU_CATEGORIES } from '../types/yaku'

interface FilterChipsProps {
  selectedCategories: YakuCategory[]
  onToggleCategory: (category: YakuCategory) => void
  menzenOnly: boolean
  onToggleMenzen: (value: boolean) => void
}

export function FilterChips({
  selectedCategories,
  onToggleCategory,
  menzenOnly,
  onToggleMenzen,
}: FilterChipsProps) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {YAKU_CATEGORIES.map((category) => {
          const isSelected = selectedCategories.includes(category.id)
          return (
            <button
              key={category.id}
              onClick={() => onToggleCategory(category.id)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                isSelected
                  ? 'bg-mahjong-green-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {category.label}
            </button>
          )
        })}
      </div>
      <label className="inline-flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={menzenOnly}
          onChange={(e) => onToggleMenzen(e.target.checked)}
          className="w-4 h-4 rounded border-gray-300 text-mahjong-green-500 focus:ring-mahjong-green-500"
        />
        <span className="text-sm text-gray-700 dark:text-gray-300">門前限定のみ表示</span>
      </label>
    </div>
  )
}
