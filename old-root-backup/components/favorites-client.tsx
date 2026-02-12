'use client'

import { Button } from '@/components/ui/button'
import { Heart } from 'lucide-react'
import { useFavorites } from '@/lib/favorites-context'

interface FavoritesClientProps {
  productId: string
  initialFavorite?: boolean
}

export function FavoritesClient({ productId, initialFavorite }: FavoritesClientProps) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const favorite = isFavorite(productId)

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleFavorite(productId)
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      className={`h-8 w-8 ${favorite ? 'text-red-600 hover:text-red-700' : 'text-gray-600 hover:text-gray-900'}`}
      aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Heart className={`h-5 w-5 ${favorite ? 'fill-current' : ''}`} />
    </Button>
  )
}
