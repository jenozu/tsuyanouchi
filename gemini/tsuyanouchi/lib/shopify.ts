import { ShopifyProduct, ShopifyCollection } from './shopify-types'

/* eslint-disable @typescript-eslint/no-explicit-any */
declare const process: { env: Record<string, string | undefined> }

type NextFetchInit = RequestInit & { next?: { revalidate?: number | false; tags?: string[] } }

const SHOPIFY_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN!
const SHOPIFY_STOREFRONT_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN!
const API_VERSION = '2025-10'

export async function storefrontFetch<T = unknown>(
  query: string,
  variables?: Record<string, unknown>,
  options?: { revalidate?: number | false }
): Promise<T> {
  const fetchOptions: NextFetchInit = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: options?.revalidate !== undefined ? options.revalidate : 300 },
  }
  const res = await fetch(
    `https://${SHOPIFY_DOMAIN}/api/${API_VERSION}/graphql.json`,
    fetchOptions as RequestInit
  )
  if (!res.ok) throw new Error(`Shopify fetch failed: ${res.status}`)
  const json = await res.json()
  if (json.errors) throw new Error(JSON.stringify(json.errors))
  return json.data as T
}

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ProductSize {
  label: string
  price: number
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  image_url: string
  stock: number
  sizes?: ProductSize[]
  created_at?: string
  updated_at?: string
  _variantGid?: string
  _variantMap?: Record<string, string>
}

// ─── Image helper ─────────────────────────────────────────────────────────────

export function getImageUrls(product: Product): string[] {
  const val = product.image_url
  if (!val?.trim()) return []
  const trimmed = val.trim()
  if (trimmed.startsWith('[')) {
    try {
      const arr = JSON.parse(trimmed) as string[]
      return Array.isArray(arr) ? arr.filter(Boolean) : [trimmed]
    } catch {
      return [trimmed]
    }
  }
  return [trimmed]
}

// ─── Mapping ──────────────────────────────────────────────────────────────────

function shopifyProductToProduct(p: ShopifyProduct): Product {
  const variants = p.variants.edges.map((e) => e.node)
  const images = p.images.edges.map((e) => e.node.url)
  const hasMeaningfulVariants =
    variants.length > 1 ||
    (variants.length === 1 && variants[0].title !== 'Default Title')

  return {
    id: p.handle,
    name: p.title,
    description: p.description,
    price: parseFloat(variants[0]?.price.amount ?? '0'),
    category: p.productType || (p.tags[0] ?? ''),
    image_url: JSON.stringify(images),
    stock: variants[0]?.quantityAvailable ?? 999,
    sizes: hasMeaningfulVariants
      ? variants.map((v) => ({ label: v.title, price: parseFloat(v.price.amount) }))
      : undefined,
    created_at: p.createdAt,
    updated_at: p.updatedAt,
    _variantGid: variants[0]?.id,
    _variantMap: Object.fromEntries(variants.map((v) => [v.title, v.id])),
  }
}

// ─── GraphQL fragments ────────────────────────────────────────────────────────

const PRODUCT_FIELDS = `
  id
  title
  handle
  description
  descriptionHtml
  productType
  tags
  createdAt
  updatedAt
  images(first: 10) {
    edges { node { url altText width height } }
  }
  variants(first: 20) {
    edges {
      node {
        id
        title
        availableForSale
        quantityAvailable
        price { amount currencyCode }
        compareAtPrice { amount currencyCode }
      }
    }
  }
`

// ─── Queries ──────────────────────────────────────────────────────────────────

export async function getProducts(): Promise<Product[]> {
  const data = await storefrontFetch<{
    products: { edges: Array<{ node: ShopifyProduct }> }
  }>(`
    query GetProducts {
      products(first: 250, sortKey: CREATED_AT, reverse: true) {
        edges { node { ${PRODUCT_FIELDS} } }
      }
    }
  `)
  return data.products.edges.map((e) => shopifyProductToProduct(e.node))
}

export async function getProductByHandle(handle: string): Promise<Product | null> {
  const data = await storefrontFetch<{ product: ShopifyProduct | null }>(`
    query GetProductByHandle($handle: String!) {
      product(handle: $handle) { ${PRODUCT_FIELDS} }
    }
  `, { handle })
  return data.product ? shopifyProductToProduct(data.product) : null
}

export async function getCollections(): Promise<ShopifyCollection[]> {
  const data = await storefrontFetch<{
    collections: { edges: Array<{ node: ShopifyCollection }> }
  }>(`
    query GetCollections {
      collections(first: 50) {
        edges {
          node {
            id title handle description
            image { url altText width height }
            products(first: 50) { edges { node { ${PRODUCT_FIELDS} } } }
          }
        }
      }
    }
  `)
  return data.collections.edges.map((e) => e.node)
}

export async function getCollectionByHandle(handle: string): Promise<ShopifyCollection | null> {
  const data = await storefrontFetch<{ collection: ShopifyCollection | null }>(`
    query GetCollectionByHandle($handle: String!) {
      collection(handle: $handle) {
        id title handle description
        image { url altText width height }
        products(first: 50) { edges { node { ${PRODUCT_FIELDS} } } }
      }
    }
  `, { handle })
  return data.collection
}

export async function searchProducts(query: string): Promise<Product[]> {
  const data = await storefrontFetch<{
    products: { edges: Array<{ node: ShopifyProduct }> }
  }>(`
    query SearchProducts($query: String!) {
      products(first: 50, query: $query) {
        edges { node { ${PRODUCT_FIELDS} } }
      }
    }
  `, { query })
  return data.products.edges.map((e) => shopifyProductToProduct(e.node))
}
