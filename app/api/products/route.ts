import { NextRequest, NextResponse } from 'next/server'
import { getProducts, addProduct } from '@/lib/product-storage'

// GET /api/products - Get all products
export async function GET() {
  try {
    const products = getProducts()
    return NextResponse.json(products)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

// POST /api/products - Create new product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.name || !body.price || !body.category) {
      return NextResponse.json(
        { error: 'Missing required fields: name, price, category' },
        { status: 400 }
      )
    }
    
    const newProduct = addProduct({
      name: body.name,
      description: body.description || '',
      price: parseFloat(body.price),
      cost: body.cost ? parseFloat(body.cost) : undefined,
      category: body.category,
      imageUrl: body.imageUrl || '',
      stock: parseInt(body.stock) || 0,
      sizes: body.sizes || [],
    })
    
    return NextResponse.json(newProduct, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}

