export interface ShopifyMoneyV2 {
  amount: string
  currencyCode: string
}

export interface ShopifyProductImage {
  url: string
  altText: string | null
  width: number | null
  height: number | null
}

export interface ShopifyProductVariant {
  id: string
  title: string
  availableForSale: boolean
  quantityAvailable: number | null
  price: ShopifyMoneyV2
  compareAtPrice: ShopifyMoneyV2 | null
}

export interface ShopifyProduct {
  id: string
  title: string
  handle: string
  description: string
  descriptionHtml: string
  productType: string
  tags: string[]
  createdAt: string
  updatedAt: string
  images: { edges: Array<{ node: ShopifyProductImage }> }
  variants: { edges: Array<{ node: ShopifyProductVariant }> }
}

export interface ShopifyCollection {
  id: string
  title: string
  handle: string
  description: string
  image: ShopifyProductImage | null
  products: { edges: Array<{ node: ShopifyProduct }> }
}

export interface ShopifyCartLine {
  id: string
  quantity: number
  merchandise: {
    id: string
    title: string
    price: ShopifyMoneyV2
    product: {
      title: string
      handle: string
      images: { edges: Array<{ node: ShopifyProductImage }> }
    }
  }
}

export interface ShopifyCart {
  id: string
  checkoutUrl: string
  totalQuantity: number
  cost: {
    subtotalAmount: ShopifyMoneyV2
    totalAmount: ShopifyMoneyV2
  }
  lines: { edges: Array<{ node: ShopifyCartLine }> }
}
