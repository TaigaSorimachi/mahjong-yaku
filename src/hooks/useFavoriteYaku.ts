import { useState, useEffect } from 'react'

const STORAGE_KEY = 'mahjong-favorite-yaku'

export function useFavoriteYaku() {
  const [favorites, setFavorites] = useState<string[]>(() => {
    if (typeof window === 'undefined') return []
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        return JSON.parse(stored)
      } catch {
        return []
      }
    }
    return []
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
  }, [favorites])

  const toggleFavorite = (yakuId: string) => {
    setFavorites((prev) =>
      prev.includes(yakuId)
        ? prev.filter((id) => id !== yakuId)
        : [...prev, yakuId]
    )
  }

  const isFavorite = (yakuId: string) => favorites.includes(yakuId)

  return {
    favorites,
    toggleFavorite,
    isFavorite,
  }
}
