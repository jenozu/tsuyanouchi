import { getProducts as getProductsFromStorage, getProduct as getProductFromStorage } from '@/lib/product-storage'
import { Product as StorageProduct } from '@/lib/product-storage'

// Map storage product format to frontend format (for compatibility with existing pages)
function mapProduct(product: StorageProduct) {
  return {
    id: product.id,
    title: product.name, // Map name to title
    description: product.description,
    price: product.price,
    cost: product.cost,
    category: product.category,
    image: product.imageUrl, // Map imageUrl to image
    stock: product.stock,
    sizes: product.sizes,
  }
}

// Get all products (compatible with existing pages)
export async function getProducts() {
  const products = getProductsFromStorage()
  return products.map(mapProduct)
}

// Get single product by ID (compatible with existing pages)
export async function getProduct(id: string) {
  const product = getProductFromStorage(id)
  if (!product) return null
  return mapProduct(product)
}

// Alternative names for new code
export async function getAllProducts() {
  return getProducts()
}

export async function getProductById(id: string) {
  return getProduct(id)
}

// Get products by category
export async function getProductsByCategory(category: string) {
  const products = getProductsFromStorage()
  return products.filter(p => p.category === category).map(mapProduct)
}

// Search products
export async function searchProducts(query: string) {
  const products = getProductsFromStorage()
  const lowerQuery = query.toLowerCase()
  
  return products
    .filter(product =>
      product.name.toLowerCase().includes(lowerQuery) ||
      product.description.toLowerCase().includes(lowerQuery) ||
      product.category.toLowerCase().includes(lowerQuery)
    )
    .map(mapProduct)
}
