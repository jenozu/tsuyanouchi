import { getProducts as getProductsFromSupabase, getProduct as getProductFromSupabase, getProductsByCategory as getProductsByCategoryFromSupabase } from '@/lib/supabase-helpers'
import { Product as SupabaseProduct } from '@/lib/supabase-helpers'

// Map Supabase product format to frontend format (for compatibility with existing pages)
function mapProduct(product: SupabaseProduct) {
  return {
    id: product.id,
    title: product.name, // Map name to title
    description: product.description,
    price: product.price,
    cost: product.cost,
    category: product.category,
    image: product.image_url, // Map image_url to image
    stock: product.stock,
    sizes: product.sizes,
  }
}

// Get all products (compatible with existing pages)
export async function getProducts() {
  const products = await getProductsFromSupabase()
  return products.map(mapProduct)
}

// Get single product by ID (compatible with existing pages)
export async function getProduct(id: string) {
  const product = await getProductFromSupabase(id)
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
  const products = await getProductsByCategoryFromSupabase(category)
  return products.map(mapProduct)
}

// Search products
export async function searchProducts(query: string) {
  const products = await getProductsFromSupabase()
  const lowerQuery = query.toLowerCase()
  
  return products
    .filter(product =>
      product.name.toLowerCase().includes(lowerQuery) ||
      product.description.toLowerCase().includes(lowerQuery) ||
      product.category.toLowerCase().includes(lowerQuery)
    )
    .map(mapProduct)
}
