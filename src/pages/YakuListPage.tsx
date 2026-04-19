import { useMemo, useState } from 'react'
import { yakuData } from '../data/yaku'
import { YAKU_CATEGORIES, YakuCategory } from '../types/yaku'
import { useYakuFilter } from '../hooks/useYakuFilter'
import { useFavoriteYaku } from '../hooks/useFavoriteYaku'
import { SearchBar } from '../components/SearchBar'
import { FilterChips } from '../components/FilterChips'
import { YakuSection } from '../components/YakuSection'
import { YakuCard } from '../components/YakuCard'

export function YakuListPage() {
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  const { favorites, toggleFavorite, isFavorite } = useFavoriteYaku()

  const {
    searchQuery,
    setSearchQuery,
    selectedCategories,
    toggleCategory,
    menzenOnly,
    setMenzenOnly,
    filteredYaku,
  } = useYakuFilter({ yakuList: yakuData })

  const displayYaku = useMemo(() => {
    if (showFavoritesOnly) {
      return filteredYaku.filter((yaku) => favorites.includes(yaku.id))
    }
    return filteredYaku
  }, [filteredYaku, showFavoritesOnly, favorites])

  const groupedYaku = useMemo(() => {
    const groups: Record<YakuCategory, typeof yakuData> = {
      '1han': [],
      '2han': [],
      '3han': [],
      '6han': [],
      mangan: [],
      yakuman: [],
      'double-yakuman': [],
    }

    displayYaku.forEach((yaku) => {
      groups[yaku.category].push(yaku)
    })

    return groups
  }, [displayYaku])

  const hasFilters = searchQuery || selectedCategories.length > 0 || menzenOnly

  return (
    <div className="pb-20">
      <div className="sticky top-0 z-10 bg-white/95 dark:bg-gray-800/95 backdrop-blur border-b border-gray-200 dark:border-gray-700 px-4 py-3 space-y-3">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
        <FilterChips
          selectedCategories={selectedCategories}
          onToggleCategory={toggleCategory}
          menzenOnly={menzenOnly}
          onToggleMenzen={setMenzenOnly}
        />
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center gap-1 ${
              showFavoritesOnly
                ? 'bg-yellow-400 text-yellow-900'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            <span>★</span>
            <span>お気に入り</span>
            {favorites.length > 0 && (
              <span className="ml-1 bg-white/30 px-1.5 rounded-full text-xs">
                {favorites.length}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="px-4 py-4">
        {displayYaku.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              {showFavoritesOnly
                ? 'お気に入りの役がありません'
                : '該当する役が見つかりませんでした'}
            </p>
            {(hasFilters || showFavoritesOnly) && (
              <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
                {showFavoritesOnly
                  ? '役カードの★をタップしてお気に入りに追加'
                  : '検索条件を変更してください'}
              </p>
            )}
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              {displayYaku.length}種の役を表示中
            </p>
            {showFavoritesOnly ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {displayYaku.map((yaku) => (
                  <YakuCard
                    key={yaku.id}
                    yaku={yaku}
                    isFavorite={isFavorite(yaku.id)}
                    onToggleFavorite={() => toggleFavorite(yaku.id)}
                  />
                ))}
              </div>
            ) : (
              YAKU_CATEGORIES.map((category) => (
                <YakuSection
                  key={category.id}
                  category={category.id}
                  yakuList={groupedYaku[category.id]}
                  favorites={favorites}
                  onToggleFavorite={toggleFavorite}
                />
              ))
            )}
          </>
        )}
      </div>
    </div>
  )
}
