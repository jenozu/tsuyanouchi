'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface CartItem {
  productId: string
  quantity: number
  selectedSize?: string
  price: number
  productName: string
  imageUrl: string
}

interface CartContextType {
  cart: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (productId: string, selectedSize?: string) => void
  updateQuantity: (productId: string, quantity: number, selectedSize?: string) => void
  clearCart: () => void
  getCartTotal: () => number
  getCartCount: () => number
  isInCart: (productId: string, selectedSize?: string) => boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const CART_STORAGE_KEY = 'tsuya-cart'

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [isHydrated, setIsHydrated] = useState(false)

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY)
      if (savedCart) {
        setCart(JSON.parse(savedCart))
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error)
    }
    setIsHydrated(true)
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
      } catch (error) {
        console.error('Error saving cart to localStorage:', error)
      }
    }
  }, [cart, isHydrated])

  const addToCart = (item: CartItem) => {
    setCart(prevCart => {
      // Check if item already exists (same product + size)
      const existingIndex = prevCart.findIndex(
        i => i.productId === item.productId && i.selectedSize === item.selectedSize
      )

      if (existingIndex >= 0) {
        // Update quantity of existing item
        const newCart = [...prevCart]
        newCart[existingIndex].quantity += item.quantity
        return newCart
      } else {
        // Add new item
        return [...prevCart, item]
      }
    })
  }

  const removeFromCart = (productId: string, selectedSize?: string) => {
    setCart(prevCart =>
      prevCart.filter(
        item => !(item.productId === productId && item.selectedSize === selectedSize)
      )
    )
  }

  const updateQuantity = (productId: string, quantity: number, selectedSize?: string) => {
    if (quantity === 0) {
      removeFromCart(productId, selectedSize)
      return
    }

    setCart(prevCart =>
      prevCart.map(item =>
        item.productId === productId && item.selectedSize === selectedSize
          ? { ...item, quantity }
          : item
      )
    )
  }

  const clearCart = () => {
    setCart([])
  }

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0)
  }

  const isInCart = (productId: string, selectedSize?: string) => {
    return cart.some(
      item => item.productId === productId && item.selectedSize === selectedSize
    )
  }

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
    isInCart,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
