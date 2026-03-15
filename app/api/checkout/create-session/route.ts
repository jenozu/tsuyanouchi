import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'

interface ShippingAddressPayload {
  firstName: string
  lastName: string
  address: string
  city: string
  state: string
  postalCode: string
  country: string
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      items,
      subtotal,
      shipping,
      tax,
      country,
      state,
      shipping_address,
      email,
      successUrl,
      cancelUrl,
    } = body as {
      items: Array<{ id: string; name: string; price: number; quantity: number; imageUrl?: string }>
      subtotal: number
      shipping: number
      tax: number
      country: string
      state?: string
      shipping_address: ShippingAddressPayload
      email?: string
      successUrl?: string
      cancelUrl?: string
    }

    if (!items?.length) {
      return NextResponse.json({ error: 'No items in cart' }, { status: 400 })
    }

    if (typeof subtotal !== 'number' || typeof shipping !== 'number' || typeof tax !== 'number') {
      return NextResponse.json({ error: 'Missing or invalid subtotal, shipping, or tax' }, { status: 400 })
    }

    if (!shipping_address || typeof shipping_address !== 'object') {
      return NextResponse.json({ error: 'Missing shipping_address' }, { status: 400 })
    }

    const origin = request.headers.get('origin') || request.nextUrl?.origin || ''
    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 11).toUpperCase()}`
    const success = successUrl || `${origin}/thank-you?orderId=${encodeURIComponent(orderId)}`
    const cancel = cancelUrl || `${origin}/checkout`

    const lineItems: Parameters<typeof stripe.checkout.sessions.create>[0]['line_items'] = items.map((item) => {
      const unitAmount = Math.round((item.price ?? 0) * 100)
      return {
        price_data: {
          currency: 'usd',
          unit_amount: unitAmount,
          product_data: {
            name: item.name,
            images: item.imageUrl ? [item.imageUrl] : undefined,
          },
        },
        quantity: item.quantity,
      }
    })

    const shippingCents = Math.round(shipping * 100)
    if (shippingCents > 0) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          unit_amount: shippingCents,
          product_data: {
            name: 'Shipping',
          },
        },
        quantity: 1,
      })
    }

    const taxCents = Math.round(tax * 100)
    if (taxCents > 0) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          unit_amount: taxCents,
          product_data: {
            name: 'Tax',
          },
        },
        quantity: 1,
      })
    }

    const addr = shipping_address as ShippingAddressPayload
    const metadata: Record<string, string> = {
      orderId,
      addr_firstName: (addr.firstName ?? '').slice(0, 500),
      addr_lastName: (addr.lastName ?? '').slice(0, 500),
      addr_address: (addr.address ?? '').slice(0, 500),
      addr_city: (addr.city ?? '').slice(0, 500),
      addr_state: (addr.state ?? '').slice(0, 500),
      addr_postalCode: (addr.postalCode ?? '').slice(0, 500),
      addr_country: (addr.country ?? '').slice(0, 500),
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      automatic_tax: { enabled: false },
      success_url: success,
      cancel_url: cancel,
      customer_creation: 'always',
      ...(email && typeof email === 'string' && email.includes('@') ? { customer_email: email } : {}),
      metadata,
    })

    if (!session.url) {
      return NextResponse.json({ error: 'Failed to create checkout URL' }, { status: 500 })
    }

    return NextResponse.json({ url: session.url, sessionId: session.id, orderId })
  } catch (error) {
    console.error('Checkout session error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
