import { ShopifyCart } from './shopify-types'
import { storefrontFetch } from './shopify'

// Shared fragment for all cart operations
const CART_FIELDS = `
  id
  checkoutUrl
  totalQuantity
  cost {
    subtotalAmount { amount currencyCode }
    totalAmount { amount currencyCode }
  }
  lines(first: 100) {
    edges {
      node {
        id
        quantity
        merchandise {
          ... on ProductVariant {
            id
            title
            price { amount currencyCode }
            product {
              title
              handle
              images(first: 1) {
                edges { node { url altText width height } }
              }
            }
          }
        }
      }
    }
  }
`

export interface CartLineInput {
  merchandiseId: string
  quantity: number
}

export interface CartLineUpdateInput {
  id: string
  quantity: number
}

export async function createCart(lines: CartLineInput[]): Promise<ShopifyCart> {
  const data = await storefrontFetch<{
    cartCreate: { cart: ShopifyCart; userErrors: Array<{ field: string; message: string }> }
  }>(
    `
    mutation CartCreate($lines: [CartLineInput!]) {
      cartCreate(input: { lines: $lines }) {
        cart { ${CART_FIELDS} }
        userErrors { field message }
      }
    }
  `,
    { lines },
    { revalidate: false }
  )
  if (data.cartCreate.userErrors.length > 0) {
    throw new Error(data.cartCreate.userErrors.map((e) => e.message).join(', '))
  }
  return data.cartCreate.cart
}

export async function addCartLines(
  cartId: string,
  lines: CartLineInput[]
): Promise<ShopifyCart> {
  const data = await storefrontFetch<{
    cartLinesAdd: { cart: ShopifyCart; userErrors: Array<{ field: string; message: string }> }
  }>(
    `
    mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart { ${CART_FIELDS} }
        userErrors { field message }
      }
    }
  `,
    { cartId, lines },
    { revalidate: false }
  )
  if (data.cartLinesAdd.userErrors.length > 0) {
    throw new Error(data.cartLinesAdd.userErrors.map((e) => e.message).join(', '))
  }
  return data.cartLinesAdd.cart
}

export async function updateCartLines(
  cartId: string,
  lines: CartLineUpdateInput[]
): Promise<ShopifyCart> {
  const data = await storefrontFetch<{
    cartLinesUpdate: { cart: ShopifyCart; userErrors: Array<{ field: string; message: string }> }
  }>(
    `
    mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart { ${CART_FIELDS} }
        userErrors { field message }
      }
    }
  `,
    { cartId, lines },
    { revalidate: false }
  )
  if (data.cartLinesUpdate.userErrors.length > 0) {
    throw new Error(data.cartLinesUpdate.userErrors.map((e) => e.message).join(', '))
  }
  return data.cartLinesUpdate.cart
}

export async function removeCartLines(
  cartId: string,
  lineIds: string[]
): Promise<ShopifyCart> {
  const data = await storefrontFetch<{
    cartLinesRemove: { cart: ShopifyCart; userErrors: Array<{ field: string; message: string }> }
  }>(
    `
    mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart { ${CART_FIELDS} }
        userErrors { field message }
      }
    }
  `,
    { cartId, lineIds },
    { revalidate: false }
  )
  if (data.cartLinesRemove.userErrors.length > 0) {
    throw new Error(data.cartLinesRemove.userErrors.map((e) => e.message).join(', '))
  }
  return data.cartLinesRemove.cart
}

export async function getCart(cartId: string): Promise<ShopifyCart | null> {
  const data = await storefrontFetch<{ cart: ShopifyCart | null }>(
    `
    query GetCart($cartId: ID!) {
      cart(id: $cartId) { ${CART_FIELDS} }
    }
  `,
    { cartId },
    { revalidate: false }
  )
  return data.cart
}
