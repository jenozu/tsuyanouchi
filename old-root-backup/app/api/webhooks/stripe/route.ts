import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { verifyWebhookSignature } from '@/lib/stripe'
import { updateOrderStatus, getOrder } from '@/lib/supabase-helpers'
import { sendOrderConfirmation, sendOrderNotification } from '@/lib/email'

export async function POST(request: Request) {
  try {
    const body = await request.text()
    const headersList = await headers()
    const signature = headersList.get('stripe-signature')
    
    if (!signature) {
      console.error('No Stripe signature found')
      return NextResponse.json(
        { error: 'No signature' },
        { status: 400 }
      )
    }
    
    // Verify webhook signature
    const event = verifyWebhookSignature(body, signature)
    
    console.log('Received Stripe webhook:', event.type)
    
    // Handle different event types
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object
        const { orderId, email } = paymentIntent.metadata
        
        if (!orderId) {
          console.error('No orderId in payment intent metadata')
          break
        }
        
        console.log('Payment succeeded for order:', orderId)
        
        // Update order status in Supabase
        const updated = await updateOrderStatus(orderId, 'processing', 'paid')
        
        if (updated) {
          console.log('Order status updated successfully')
          
          // Send email notifications
          const order = await getOrder(orderId)
          if (order && email) {
            try {
              await sendOrderConfirmation(email, orderId, order)
              await sendOrderNotification(orderId, order)
              console.log('Email notifications sent successfully')
            } catch (emailError) {
              console.error('Error sending email notifications:', emailError)
              // Don't fail the webhook if emails fail
            }
          }
        } else {
          console.error('Failed to update order status')
        }
        
        break
      }
      
      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object
        const { orderId } = paymentIntent.metadata
        
        if (!orderId) {
          console.error('No orderId in payment intent metadata')
          break
        }
        
        console.log('Payment failed for order:', orderId)
        
        // Update order status to failed
        await updateOrderStatus(orderId, 'failed', 'failed')
        
        break
      }
      
      case 'payment_intent.canceled': {
        const paymentIntent = event.data.object
        const { orderId } = paymentIntent.metadata
        
        if (orderId) {
          console.log('Payment canceled for order:', orderId)
          await updateOrderStatus(orderId, 'canceled', 'canceled')
        }
        
        break
      }
      
      default:
        console.log('Unhandled event type:', event.type)
    }
    
    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}

// Important: Disable body parsing for webhook routes
export const runtime = 'nodejs'
