import { NextRequest, NextResponse } from 'next/server'
import { getProducts, createProduct } from '@/lib/supabase-helpers'

// GET /api/products - Get all products
export async function GET() {
  try {
    const products = await getProducts()
    
    // Map Supabase format to API format for compatibility
    const mappedProducts = products.map(p => ({
      id: p.id,
      name: p.name,
      description: p.description,
      price: p.price,
      cost: p.cost,
      category: p.category,
      imageUrl: p.image_url,
      stock: p.stock,
      sizes: p.sizes,
      createdAt: p.created_at,
      updatedAt: p.updated_at,
    }))
    
    return NextResponse.json(mappedProducts)
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
    
    const newProduct = await createProduct({
      name: body.name,
      description: body.description || '',
      price: parseFloat(body.price),
      cost: body.cost ? parseFloat(body.cost) : undefined,
      category: body.category,
      image_url: body.imageUrl || '',
      stock: parseInt(body.stock) || 0,
      sizes: body.sizes || [],
    })
    
    if (!newProduct) {
      return NextResponse.json(
        { error: 'Failed to create product' },
        { status: 500 }
      )
    }
    
    // Map back to API format
    const mappedProduct = {
      id: newProduct.id,
      name: newProduct.name,
      description: newProduct.description,
      price: newProduct.price,
      cost: newProduct.cost,
      category: newProduct.category,
      imageUrl: newProduct.image_url,
      stock: newProduct.stock,
      sizes: newProduct.sizes,
      createdAt: newProduct.created_at,
      updatedAt: newProduct.updated_at,
    }
    
    return NextResponse.json(mappedProduct, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}
