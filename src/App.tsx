import { useMemo, useState } from 'react'
import { yakuData } from './data/yaku'
import { YAKU_CATEGORIES, YakuCategory } from './types/yaku'
import { useDarkMode } from './hooks/useDarkMode'
import { useYakuFilter } from './hooks/useYakuFilter'
import { DarkModeToggle } from './components/DarkModeToggle'
import { SearchBar } from './components/SearchBar'
import { FilterChips } from './components/FilterChips'
import { YakuSection } from './components/YakuSection'
import { TabNavigation, TabId } from './components/TabNavigation'
import { ScoreCalculator } from './components/ScoreCalculator'
import { ScoreRecord } from './components/ScoreRecord'

function App() {
  const [activeTab, setActiveTab] = useState<TabId>('yaku')
  const { isDark, toggleDarkMode } = useDarkMode()
  const {
    searchQuery,
    setSearchQuery,
    selectedCategories,
    toggleCategory,
    menzenOnly,
    setMenzenOnly,
    filteredYaku,
  } = useYakuFilter({ yakuList: yakuData })

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

    filteredYaku.forEach((yaku) => {
      groups[yaku.category].push(yaku)
    })

    return groups
  }, [filteredYaku])

  const hasFilters = searchQuery || selectedCategories.length > 0 || menzenOnly

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/95 dark:bg-gray-800/95 backdrop-blur border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              <span className="text-mahjong-green-500">麻雀</span>
              {activeTab === 'yaku' && '役一覧'}
              {activeTab === 'calculator' && '点数計算'}
              {activeTab === 'record' && '点数記録'}
            </h1>
            <DarkModeToggle isDark={isDark} onToggle={toggleDarkMode} />
          </div>
          <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
          {activeTab === 'yaku' && (
            <div className="space-y-3 mt-4">
              <SearchBar value={searchQuery} onChange={setSearchQuery} />
              <FilterChips
                selectedCategories={selectedCategories}
                onToggleCategory={toggleCategory}
                menzenOnly={menzenOnly}
                onToggleMenzen={setMenzenOnly}
              />
            </div>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-6xl mx-auto">
        {activeTab === 'yaku' && (
          <div className="px-4 py-6">
            {filteredYaku.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  該当する役が見つかりませんでした
                </p>
                {hasFilters && (
                  <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
                    検索条件を変更してください
                  </p>
                )}
              </div>
            ) : (
              <>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                  {filteredYaku.length}種の役を表示中
                </p>
                {YAKU_CATEGORIES.map((category) => (
                  <YakuSection
                    key={category.id}
                    category={category.id}
                    yakuList={groupedYaku[category.id]}
                  />
                ))}
              </>
            )}
          </div>
        )}
        {activeTab === 'calculator' && <ScoreCalculator />}
        {activeTab === 'record' && <ScoreRecord />}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-700 py-6 mt-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>麻雀役一覧 - 翻数順で引ける役リファレンス</p>
        </div>
      </footer>
    </div>
  )
}

export default App
