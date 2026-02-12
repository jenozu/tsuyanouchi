import { NextResponse } from 'next/server'
import { createOrder } from '@/lib/supabase-helpers'

export async function POST(request: Request) {
  try {
    const orderData = await request.json()
    
    const order = await createOrder(orderData)
    
    if (!order) {
      return NextResponse.json(
        { error: 'Failed to create order' },
        { status: 500 }
      )
    }
    
    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}
