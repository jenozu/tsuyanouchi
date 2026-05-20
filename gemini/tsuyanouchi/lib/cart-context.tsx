'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { ShopifyCart, ShopifyCartLine } from './shopify-types';
import { createCart, addCartLines, updateCartLines, removeCartLines, getCart } from './shopify-cart';

export interface ProductSize {
  label: string;
  price: number;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  selectedSize?: ProductSize;
  _variantId: string;
  _cartLineId: string;
}

interface CartContextType {
  cartItems: CartItem[];
  checkoutUrl: string | null;
  isLoading: boolean;
  addToCart: (item: Omit<CartItem, 'quantity' | '_cartLineId'>) => Promise<void>;
  removeFromCart: (id: string, sizeLabel?: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number, sizeLabel?: string) => Promise<void>;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_ID_KEY = 'shopify_cart_id';

function shopifyCartLineToCartItem(line: ShopifyCartLine): CartItem {
  const { merchandise } = line;
  const { product } = merchandise;
  const imageUrl = product.images.edges[0]?.node.url ?? '';
  const isDefault = merchandise.title === 'Default Title';
  const variantPrice = parseFloat(merchandise.price.amount);

  return {
    id: product.handle,
    name: product.title,
    price: variantPrice,
    quantity: line.quantity,
    imageUrl,
    selectedSize: isDefault ? undefined : { label: merchandise.title, price: variantPrice },
    _variantId: merchandise.id,
    _cartLineId: line.id,
  };
}

function applyCart(cart: ShopifyCart): { cartItems: CartItem[]; checkoutUrl: string } {
  return {
    cartItems: cart.lines.edges.map((e) => shopifyCartLineToCartItem(e.node)),
    checkoutUrl: cart.checkoutUrl,
  };
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [cartId, setCartId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Load existing Shopify cart on mount
  useEffect(() => {
    async function loadCart() {
      const storedId = localStorage.getItem(CART_ID_KEY);
      if (!storedId) {
        setInitialized(true);
        return;
      }
      try {
        const cart = await getCart(storedId);
        if (cart) {
          const { cartItems: items, checkoutUrl: url } = applyCart(cart);
          setCartId(storedId);
          setCartItems(items);
          setCheckoutUrl(url);
        } else {
          localStorage.removeItem(CART_ID_KEY);
        }
      } catch {
        localStorage.removeItem(CART_ID_KEY);
      } finally {
        setInitialized(true);
      }
    }
    loadCart();
  }, []);

  const addToCart = useCallback(
    async (item: Omit<CartItem, 'quantity' | '_cartLineId'>) => {
      if (!initialized) return;
      setIsLoading(true);
      try {
        const lines = [{ merchandiseId: item._variantId, quantity: 1 }];

        let cart: ShopifyCart;
        if (!cartId) {
          cart = await createCart(lines);
          setCartId(cart.id);
          localStorage.setItem(CART_ID_KEY, cart.id);
        } else {
          // If same variant already in cart, increment via update
          const existing = cartItems.find(
            (ci) => ci._variantId === item._variantId
          );
          if (existing) {
            cart = await updateCartLines(cartId, [
              { id: existing._cartLineId, quantity: existing.quantity + 1 },
            ]);
          } else {
            cart = await addCartLines(cartId, lines);
          }
        }

        const { cartItems: items, checkoutUrl: url } = applyCart(cart);
        setCartItems(items);
        setCheckoutUrl(url);
      } catch (err) {
        console.error('addToCart error:', err);
      } finally {
        setIsLoading(false);
      }
    },
    [cartId, cartItems, initialized]
  );

  const updateQuantity = useCallback(
    async (id: string, quantity: number, sizeLabel?: string) => {
      if (!cartId) return;
      const item = cartItems.find(
        (ci) => ci.id === id && ci.selectedSize?.label === sizeLabel
      );
      if (!item) return;

      setIsLoading(true);
      try {
        let cart: ShopifyCart;
        if (quantity <= 0) {
          cart = await removeCartLines(cartId, [item._cartLineId]);
        } else {
          cart = await updateCartLines(cartId, [{ id: item._cartLineId, quantity }]);
        }
        const { cartItems: items, checkoutUrl: url } = applyCart(cart);
        setCartItems(items);
        setCheckoutUrl(url);
      } catch (err) {
        console.error('updateQuantity error:', err);
      } finally {
        setIsLoading(false);
      }
    },
    [cartId, cartItems]
  );

  const removeFromCart = useCallback(
    async (id: string, sizeLabel?: string) => {
      if (!cartId) return;
      const item = cartItems.find(
        (ci) => ci.id === id && ci.selectedSize?.label === sizeLabel
      );
      if (!item) return;

      setIsLoading(true);
      try {
        const cart = await removeCartLines(cartId, [item._cartLineId]);
        const { cartItems: items, checkoutUrl: url } = applyCart(cart);
        setCartItems(items);
        setCheckoutUrl(url);
      } catch (err) {
        console.error('removeFromCart error:', err);
      } finally {
        setIsLoading(false);
      }
    },
    [cartId, cartItems]
  );

  const clearCart = useCallback(() => {
    localStorage.removeItem(CART_ID_KEY);
    setCartId(null);
    setCartItems([]);
    setCheckoutUrl(null);
  }, []);

  const getCartTotal = useCallback(() => {
    return cartItems.reduce((total, item) => {
      const price = item.selectedSize?.price ?? item.price;
      return total + price * item.quantity;
    }, 0);
  }, [cartItems]);

  const getCartCount = useCallback(() => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  }, [cartItems]);

  const value: CartContextType = {
    cartItems,
    checkoutUrl,
    isLoading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
