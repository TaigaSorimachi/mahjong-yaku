import { useState, useMemo } from 'react'
import { Yaku, YakuCategory } from '../types/yaku'

interface UseYakuFilterOptions {
  yakuList: Yaku[]
}

export function useYakuFilter({ yakuList }: UseYakuFilterOptions) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<YakuCategory[]>([])
  const [menzenOnly, setMenzenOnly] = useState(false)

  const filteredYaku = useMemo(() => {
    return yakuList.filter((yaku) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesName = yaku.name.toLowerCase().includes(query)
        const matchesKana = yaku.kana.toLowerCase().includes(query)
        if (!matchesName && !matchesKana) return false
      }

      // Category filter
      if (selectedCategories.length > 0) {
        if (!selectedCategories.includes(yaku.category)) return false
      }

      // Menzen only filter
      if (menzenOnly && !yaku.menzenOnly) return false

      return true
    })
  }, [yakuList, searchQuery, selectedCategories, menzenOnly])

  const toggleCategory = (category: YakuCategory) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    )
  }

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedCategories([])
    setMenzenOnly(false)
  }

  return {
    searchQuery,
    setSearchQuery,
    selectedCategories,
    toggleCategory,
    menzenOnly,
    setMenzenOnly,
    filteredYaku,
    clearFilters,
  }
}
