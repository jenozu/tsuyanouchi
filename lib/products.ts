import { getProducts } from '@/lib/product-storage'
import { Product } from '@/lib/product-storage'

// Get all products
export async function getAllProducts(): Promise<Product[]> {
  return getProducts()
}

// Get single product by ID
export async function getProductById(id: string): Promise<Product | null> {
  const products = getProducts()
  return products.find(p => p.id === id) || null
}

// Get products by category
export async function getProductsByCategory(category: string): Promise<Product[]> {
  const products = getProducts()
  return products.filter(p => p.category === category)
}

// Search products
export async function searchProducts(query: string): Promise<Product[]> {
  const products = getProducts()
  const lowerQuery = query.toLowerCase()
  
  return products.filter(product =>
    product.name.toLowerCase().includes(lowerQuery) ||
    product.description.toLowerCase().includes(lowerQuery) ||
    product.category.toLowerCase().includes(lowerQuery)
  )
}
