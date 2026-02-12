import fs from 'fs'
import path from 'path'

export interface ProductSize {
  label: string
  price: number
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  cost?: number // Cost of Goods Sold (COGS)
  category: string
  imageUrl: string
  stock: number
  sizes?: ProductSize[]
  createdAt?: string
  updatedAt?: string
}

const DATA_DIR = path.join(process.cwd(), 'data')
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json')

// Ensure data directory exists
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
}

// Read products from JSON file
export function getProducts(): Product[] {
  try {
    ensureDataDir()
    
    if (!fs.existsSync(PRODUCTS_FILE)) {
      // Initialize with empty array if file doesn't exist
      fs.writeFileSync(PRODUCTS_FILE, JSON.stringify([], null, 2))
      return []
    }
    
    const data = fs.readFileSync(PRODUCTS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading products:', error)
    return []
  }
}

// Write products to JSON file
export function saveProducts(products: Product[]): void {
  try {
    ensureDataDir()
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2))
  } catch (error) {
    console.error('Error saving products:', error)
    throw new Error('Failed to save products')
  }
}

// Get single product by ID
export function getProduct(id: string): Product | null {
  const products = getProducts()
  return products.find(p => p.id === id) || null
}

// Add new product
export function addProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Product {
  const products = getProducts()
  const newProduct: Product = {
    ...product,
    id: `p${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  products.push(newProduct)
  saveProducts(products)
  return newProduct
}

// Update existing product
export function updateProduct(id: string, updates: Partial<Product>): Product | null {
  const products = getProducts()
  const index = products.findIndex(p => p.id === id)
  
  if (index === -1) return null
  
  products[index] = {
    ...products[index],
    ...updates,
    id, // Ensure ID doesn't change
    updatedAt: new Date().toISOString(),
  }
  
  saveProducts(products)
  return products[index]
}

// Delete product
export function deleteProduct(id: string): boolean {
  const products = getProducts()
  const filtered = products.filter(p => p.id !== id)
  
  if (filtered.length === products.length) {
    return false // Product not found
  }
  
  saveProducts(filtered)
  return true
}

// Bulk add products (for CSV import)
export function bulkAddProducts(newProducts: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>[]): Product[] {
  const products = getProducts()
  const now = new Date().toISOString()
  
  const addedProducts = newProducts.map((product, index) => ({
    ...product,
    id: `p${Date.now()}_${index}`,
    createdAt: now,
    updatedAt: now,
  }))
  
  const updated = [...products, ...addedProducts]
  saveProducts(updated)
  return addedProducts
}

