import { NextRequest, NextResponse } from 'next/server'
import { getProduct, updateProduct, deleteProduct } from '@/lib/supabase-helpers'

// GET /api/products/[id] - Get single product
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const product = await getProduct(params.id)
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }
    
    // Map to API format
    const mappedProduct = {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      cost: product.cost,
      category: product.category,
      imageUrl: product.image_url,
      stock: product.stock,
      sizes: product.sizes,
      createdAt: product.created_at,
      updatedAt: product.updated_at,
    }
    
    return NextResponse.json(mappedProduct)
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}

// PUT /api/products/[id] - Update product
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    
    const updates: any = {}
    if (body.name !== undefined) updates.name = body.name
    if (body.description !== undefined) updates.description = body.description
    if (body.price !== undefined) updates.price = parseFloat(body.price)
    if (body.cost !== undefined) updates.cost = parseFloat(body.cost)
    if (body.category !== undefined) updates.category = body.category
    if (body.imageUrl !== undefined) updates.image_url = body.imageUrl
    if (body.stock !== undefined) updates.stock = parseInt(body.stock)
    if (body.sizes !== undefined) updates.sizes = body.sizes
    
    const updatedProduct = await updateProduct(params.id, updates)
    
    if (!updatedProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }
    
    // Map to API format
    const mappedProduct = {
      id: updatedProduct.id,
      name: updatedProduct.name,
      description: updatedProduct.description,
      price: updatedProduct.price,
      cost: updatedProduct.cost,
      category: updatedProduct.category,
      imageUrl: updatedProduct.image_url,
      stock: updatedProduct.stock,
      sizes: updatedProduct.sizes,
      createdAt: updatedProduct.created_at,
      updatedAt: updatedProduct.updated_at,
    }
    
    return NextResponse.json(mappedProduct)
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    )
  }
}

// DELETE /api/products/[id] - Delete product
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const success = await deleteProduct(params.id)
    
    if (!success) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ message: 'Product deleted successfully' })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}
