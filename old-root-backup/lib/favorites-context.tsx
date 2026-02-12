'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface FavoritesContextType {
  favorites: string[]
  addFavorite: (productId: string) => void
  removeFavorite: (productId: string) => void
  isFavorite: (productId: string) => boolean
  toggleFavorite: (productId: string) => void
  getFavoritesCount: () => number
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

const FAVORITES_STORAGE_KEY = 'tsuya-favorites'

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([])
  const [isHydrated, setIsHydrated] = useState(false)

  // Load favorites from localStorage on mount
  useEffect(() => {
    try {
      const savedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY)
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites))
      }
    } catch (error) {
      console.error('Error loading favorites from localStorage:', error)
    }
    setIsHydrated(true)
  }, [])

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites))
      } catch (error) {
        console.error('Error saving favorites to localStorage:', error)
      }
    }
  }, [favorites, isHydrated])

  const addFavorite = (productId: string) => {
    setFavorites(prevFavorites => {
      if (!prevFavorites.includes(productId)) {
        return [...prevFavorites, productId]
      }
      return prevFavorites
    })
  }

  const removeFavorite = (productId: string) => {
    setFavorites(prevFavorites => prevFavorites.filter(id => id !== productId))
  }

  const isFavorite = (productId: string) => {
    return favorites.includes(productId)
  }

  const toggleFavorite = (productId: string) => {
    if (isFavorite(productId)) {
      removeFavorite(productId)
    } else {
      addFavorite(productId)
    }
  }

  const getFavoritesCount = () => {
    return favorites.length
  }

  const value = {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    toggleFavorite,
    getFavoritesCount,
  }

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
}

export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider')
  }
  return context
}
