'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ShoppingBag, Check } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useCart } from '@/lib/cart-context'

interface AddToCartButtonProps {
  productId: string
  productName: string
  price: number
  quantity: number
  selectedSize?: string
  imageUrl?: string
}

export function AddToCartButton({
  productId,
  productName,
  price,
  quantity,
  selectedSize,
  imageUrl,
}: AddToCartButtonProps) {
  const [added, setAdded] = useState(false)
  const { toast } = useToast()
  const { addToCart } = useCart()

  const handleAddToCart = () => {
    try {
      addToCart({
        productId,
        productName,
        price,
        quantity,
        selectedSize,
        imageUrl: imageUrl || '/placeholder.svg',
      })
      
      setAdded(true)
      toast({
        title: "Added to cart",
        description: `${quantity} × ${productName}${selectedSize ? ` (${selectedSize})` : ''}`,
      })
      
      // Reset after 2 seconds
      setTimeout(() => setAdded(false), 2000)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <Button
      className="w-full bg-emerald-900 hover:bg-emerald-800 text-white"
      onClick={handleAddToCart}
      disabled={added}
    >
      {added ? (
        <>
          <Check className="mr-2 h-4 w-4" />
          Added!
        </>
      ) : (
        <>
          <ShoppingBag className="mr-2 h-4 w-4" />
          Add to cart
        </>
      )}
    </Button>
  )
}
