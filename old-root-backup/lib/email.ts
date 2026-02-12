import { Resend } from 'resend'
import { Order } from './supabase-helpers'

if (!process.env.RESEND_API_KEY) {
  console.warn('RESEND_API_KEY is not set - email functionality will be disabled')
}

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'TSUYA NO UCHI <orders@tsuyanouchi.com>'
const ADMIN_EMAIL = process.env.ORDER_NOTIFICATION_EMAIL || 'admin@tsuyanouchi.com'

export async function sendOrderConfirmation(
  customerEmail: string,
  orderId: string,
  order: Order
): Promise<boolean> {
  if (!resend) {
    console.warn('Resend not configured - skipping order confirmation email')
    return false
  }

  try {
    const itemsList = order.items
      .map(
        (item) =>
          `<tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.productName}</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">$${item.price.toFixed(2)}</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">$${(item.price * item.quantity).toFixed(2)}</td>
          </tr>`
      )
      .join('')

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation - ${orderId}</title>
</head>
<body style="font-family: 'Geist Sans', -apple-system, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #2D2A26 0%, #5C5446 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="margin: 0; font-size: 28px; font-weight: 600;">TSUYA NO UCHI</h1>
    <p style="margin: 10px 0 0; opacity: 0.9; font-size: 14px;">Ukiyo-e Style Anime Art Prints</p>
  </div>
  
  <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px;">
    <h2 style="color: #2D2A26; margin-top: 0;">Thank you for your order!</h2>
    <p>Your order has been received and is being processed.</p>
    
    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #5C5446;">
      <p style="margin: 0; font-size: 14px; color: #666;">Order Number</p>
      <p style="margin: 5px 0 0; font-size: 18px; font-weight: 600; color: #2D2A26;">${orderId}</p>
    </div>
    
    <h3 style="color: #2D2A26; margin-top: 30px;">Order Details</h3>
    <table style="width: 100%; background: white; border-radius: 8px; overflow: hidden; border-collapse: collapse;">
      <thead>
        <tr style="background: #2D2A26; color: white;">
          <th style="padding: 12px 8px; text-align: left;">Item</th>
          <th style="padding: 12px 8px; text-align: center;">Qty</th>
          <th style="padding: 12px 8px; text-align: right;">Price</th>
          <th style="padding: 12px 8px; text-align: right;">Total</th>
        </tr>
      </thead>
      <tbody>
        ${itemsList}
      </tbody>
    </table>
    
    <div style="background: white; padding: 20px; border-radius: 8px; margin-top: 20px;">
      <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee;">
        <span>Subtotal:</span>
        <span>$${order.subtotal.toFixed(2)}</span>
      </div>
      <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee;">
        <span>Shipping:</span>
        <span>$${order.shipping.toFixed(2)}</span>
      </div>
      <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee;">
        <span>Tax:</span>
        <span>$${order.taxes.toFixed(2)}</span>
      </div>
      <div style="display: flex; justify-content: space-between; padding: 12px 0 0; font-size: 18px; font-weight: 600; color: #2D2A26;">
        <span>Total:</span>
        <span>$${order.total.toFixed(2)}</span>
      </div>
    </div>
    
    <h3 style="color: #2D2A26; margin-top: 30px;">Shipping Address</h3>
    <div style="background: white; padding: 20px; border-radius: 8px;">
      <p style="margin: 0;">${order.shipping_address.firstName} ${order.shipping_address.lastName}</p>
      <p style="margin: 5px 0 0;">${order.shipping_address.address}</p>
      <p style="margin: 5px 0 0;">${order.shipping_address.city}, ${order.shipping_address.state} ${order.shipping_address.postalCode}</p>
      <p style="margin: 5px 0 0;">${order.shipping_address.country}</p>
    </div>
    
    <div style="margin-top: 30px; padding: 20px; background: white; border-radius: 8px; text-align: center;">
      <p style="margin: 0; color: #666;">You will receive a shipping confirmation email once your order ships.</p>
      <p style="margin: 10px 0 0; color: #666;">Questions? Contact us at <a href="mailto:support@tsuyanouchi.com" style="color: #5C5446;">support@tsuyanouchi.com</a></p>
    </div>
  </div>
  
  <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
    <p>TSUYA NO UCHI - Handcrafted ukiyo-e inspired anime prints</p>
    <p style="margin: 5px 0;">© ${new Date().getFullYear()} TSUYA NO UCHI. All rights reserved.</p>
  </div>
</body>
</html>
`

    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: customerEmail,
      subject: `Order Confirmation - ${orderId}`,
      html,
    })

    if (error) {
      console.error('Error sending order confirmation email:', error)
      return false
    }

    console.log('Order confirmation email sent to:', customerEmail)
    return true
  } catch (error) {
    console.error('Error sending order confirmation email:', error)
    return false
  }
}

export async function sendOrderNotification(
  orderId: string,
  order: Order
): Promise<boolean> {
  if (!resend) {
    console.warn('Resend not configured - skipping admin notification email')
    return false
  }

  try {
    const itemsList = order.items
      .map(
        (item) =>
          `<li>${item.productName} (Qty: ${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}</li>`
      )
      .join('')

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Order - ${orderId}</title>
</head>
<body style="font-family: 'Geist Sans', -apple-system, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #2D2A26 0%, #5C5446 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="margin: 0; font-size: 24px;">🎉 New Order Received!</h1>
  </div>
  
  <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px;">
    <h2 style="color: #2D2A26; margin-top: 0;">Order: ${orderId}</h2>
    
    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="margin-top: 0; color: #2D2A26;">Customer Information</h3>
      <p><strong>Email:</strong> ${order.email}</p>
      <p><strong>Name:</strong> ${order.shipping_address.firstName} ${order.shipping_address.lastName}</p>
      <p><strong>Address:</strong><br>
        ${order.shipping_address.address}<br>
        ${order.shipping_address.city}, ${order.shipping_address.state} ${order.shipping_address.postalCode}<br>
        ${order.shipping_address.country}
      </p>
    </div>
    
    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="margin-top: 0; color: #2D2A26;">Order Items</h3>
      <ul style="list-style-type: none; padding: 0;">
        ${itemsList}
      </ul>
    </div>
    
    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="margin-top: 0; color: #2D2A26;">Order Summary</h3>
      <p><strong>Subtotal:</strong> $${order.subtotal.toFixed(2)}</p>
      <p><strong>Shipping:</strong> $${order.shipping.toFixed(2)}</p>
      <p><strong>Tax:</strong> $${order.taxes.toFixed(2)}</p>
      <p style="font-size: 18px; font-weight: 600; color: #2D2A26;"><strong>Total:</strong> $${order.total.toFixed(2)}</p>
    </div>
    
    <div style="background: #2D2A26; color: white; padding: 20px; border-radius: 8px; text-align: center; margin-top: 30px;">
      <p style="margin: 0;">View order details in your admin dashboard</p>
    </div>
  </div>
</body>
</html>
`

    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: `New Order - ${orderId}`,
      html,
    })

    if (error) {
      console.error('Error sending admin notification email:', error)
      return false
    }

    console.log('Admin notification email sent')
    return true
  } catch (error) {
    console.error('Error sending admin notification email:', error)
    return false
  }
}
