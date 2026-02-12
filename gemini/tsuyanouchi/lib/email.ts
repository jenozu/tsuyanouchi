import { Resend } from 'resend'
import { Order } from './supabase-helpers'

if (!process.env.RESEND_API_KEY) {
  console.warn('RESEND_API_KEY is not set - email functionality will be disabled')
}

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'Tsuyanouchi <orders@tsuyanouchi.com>'
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
            <td style="padding: 12px 8px; border-bottom: 1px solid #E5E0D8; font-family: Georgia, serif;">${item.productName}</td>
            <td style="padding: 12px 8px; border-bottom: 1px solid #E5E0D8; text-align: center;">${item.quantity}</td>
            <td style="padding: 12px 8px; border-bottom: 1px solid #E5E0D8; text-align: right;">$${item.price.toFixed(2)}</td>
            <td style="padding: 12px 8px; border-bottom: 1px solid #E5E0D8; text-align: right; font-weight: 600;">$${(item.price * item.quantity).toFixed(2)}</td>
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
<body style="font-family: Georgia, Cambria, 'Times New Roman', Times, serif; line-height: 1.7; color: #2D2A26; max-width: 600px; margin: 0 auto; padding: 0; background: #F2EFE9;">
  <div style="background: #2D2A26; color: #F9F8F4; padding: 40px 30px; text-align: center;">
    <h1 style="margin: 0; font-size: 32px; font-weight: 400; letter-spacing: 0.05em;">Tsuyanouchi</h1>
    <p style="margin: 12px 0 0; opacity: 0.85; font-size: 12px; text-transform: uppercase; letter-spacing: 0.2em;">House of Lustre</p>
  </div>
  
  <div style="background: #F9F8F4; padding: 40px 30px;">
    <h2 style="color: #2D2A26; margin-top: 0; font-size: 24px; font-weight: 400;">Thank you for your order</h2>
    <p style="color: #4A4036; margin: 16px 0;">Your order has been received and is being carefully prepared for shipment.</p>
    
    <div style="background: white; padding: 24px; margin: 30px 0; border-left: 3px solid #786B59;">
      <p style="margin: 0; font-size: 12px; color: #786B59; text-transform: uppercase; letter-spacing: 0.1em;">Order Number</p>
      <p style="margin: 8px 0 0; font-size: 20px; font-weight: 600; color: #2D2A26; letter-spacing: 0.02em;">${orderId}</p>
    </div>
    
    <h3 style="color: #2D2A26; margin-top: 40px; font-size: 18px; font-weight: 400; border-bottom: 1px solid #E5E0D8; padding-bottom: 12px;">Order Details</h3>
    <table style="width: 100%; background: white; margin-top: 20px; border-collapse: collapse;">
      <thead>
        <tr style="background: #F2EFE9;">
          <th style="padding: 12px 8px; text-align: left; font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; color: #786B59; font-weight: 500;">Item</th>
          <th style="padding: 12px 8px; text-align: center; font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; color: #786B59; font-weight: 500;">Qty</th>
          <th style="padding: 12px 8px; text-align: right; font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; color: #786B59; font-weight: 500;">Price</th>
          <th style="padding: 12px 8px; text-align: right; font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; color: #786B59; font-weight: 500;">Total</th>
        </tr>
      </thead>
      <tbody>
        ${itemsList}
      </tbody>
    </table>
    
    <div style="background: white; padding: 24px; margin-top: 20px;">
      <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #F2EFE9; color: #4A4036;">
        <span>Subtotal</span>
        <span>$${order.subtotal.toFixed(2)}</span>
      </div>
      <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #F2EFE9; color: #4A4036;">
        <span>Shipping</span>
        <span>$${order.shipping.toFixed(2)}</span>
      </div>
      <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #F2EFE9; color: #4A4036;">
        <span>Tax</span>
        <span>$${order.taxes.toFixed(2)}</span>
      </div>
      <div style="display: flex; justify-content: space-between; padding: 16px 0 0; font-size: 20px; font-weight: 600; color: #2D2A26;">
        <span>Total</span>
        <span>$${order.total.toFixed(2)}</span>
      </div>
    </div>
    
    <h3 style="color: #2D2A26; margin-top: 40px; font-size: 18px; font-weight: 400; border-bottom: 1px solid #E5E0D8; padding-bottom: 12px;">Shipping Address</h3>
    <div style="background: white; padding: 24px; margin-top: 20px;">
      <p style="margin: 0; color: #2D2A26; font-weight: 500;">${order.shipping_address.firstName} ${order.shipping_address.lastName}</p>
      <p style="margin: 8px 0 0; color: #4A4036;">${order.shipping_address.address}</p>
      <p style="margin: 4px 0 0; color: #4A4036;">${order.shipping_address.city}, ${order.shipping_address.state} ${order.shipping_address.postalCode}</p>
      <p style="margin: 4px 0 0; color: #4A4036;">${order.shipping_address.country}</p>
    </div>
    
    <div style="margin-top: 40px; padding: 30px; background: #F2EFE9; border-top: 2px solid #E5E0D8; text-align: center;">
      <p style="margin: 0; color: #786B59; font-size: 14px; font-style: italic;">You will receive a shipping confirmation once your order is dispatched.</p>
      <p style="margin: 16px 0 0; color: #786B59; font-size: 14px;">For inquiries: <a href="mailto:support@tsuyanouchi.com" style="color: #5C7C66; text-decoration: none;">support@tsuyanouchi.com</a></p>
    </div>
  </div>
  
  <div style="text-align: center; padding: 30px; color: #786B59; font-size: 11px; background: #E5E0D8;">
    <p style="margin: 0; text-transform: uppercase; letter-spacing: 0.15em;">Tsuyanouchi — House of Lustre</p>
    <p style="margin: 8px 0 0;">© ${new Date().getFullYear()} All rights reserved</p>
  </div>
</body>
</html>
`

    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: customerEmail,
      subject: `Order Confirmation — ${orderId}`,
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
          `<li style="padding: 8px 0; border-bottom: 1px solid #E5E0D8; color: #2D2A26;">
            <span style="font-weight: 600;">${item.productName}</span> 
            <span style="color: #786B59;">(Qty: ${item.quantity})</span> — 
            <span style="font-weight: 600;">$${(item.price * item.quantity).toFixed(2)}</span>
          </li>`
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
<body style="font-family: Georgia, Cambria, 'Times New Roman', Times, serif; line-height: 1.7; color: #2D2A26; max-width: 600px; margin: 0 auto; padding: 0; background: #F2EFE9;">
  <div style="background: #2D2A26; color: #F9F8F4; padding: 40px 30px; text-align: center;">
    <h1 style="margin: 0; font-size: 28px; font-weight: 400;">New Order Received</h1>
    <p style="margin: 12px 0 0; opacity: 0.85; font-size: 14px;">Order ${orderId}</p>
  </div>
  
  <div style="background: #F9F8F4; padding: 40px 30px;">
    <div style="background: white; padding: 24px; margin: 0 0 30px; border-left: 3px solid #5C7C66;">
      <h3 style="margin-top: 0; color: #2D2A26; font-size: 18px; font-weight: 400;">Customer Information</h3>
      <p style="margin: 12px 0 0; color: #4A4036;"><strong>Email:</strong> ${order.email}</p>
      <p style="margin: 8px 0 0; color: #4A4036;"><strong>Name:</strong> ${order.shipping_address.firstName} ${order.shipping_address.lastName}</p>
      <p style="margin: 12px 0 0; color: #4A4036;"><strong>Address:</strong></p>
      <p style="margin: 4px 0 0; color: #786B59;">
        ${order.shipping_address.address}<br>
        ${order.shipping_address.city}, ${order.shipping_address.state} ${order.shipping_address.postalCode}<br>
        ${order.shipping_address.country}
      </p>
    </div>
    
    <div style="background: white; padding: 24px; margin: 0 0 30px;">
      <h3 style="margin-top: 0; color: #2D2A26; font-size: 18px; font-weight: 400;">Order Items</h3>
      <ul style="list-style-type: none; padding: 0; margin: 12px 0 0;">
        ${itemsList}
      </ul>
    </div>
    
    <div style="background: #2D2A26; color: #F9F8F4; padding: 30px; text-align: center;">
      <h3 style="margin: 0 0 16px; font-size: 18px; font-weight: 400;">Order Summary</h3>
      <div style="display: flex; justify-content: space-between; padding: 8px 0; opacity: 0.8;">
        <span>Subtotal</span>
        <span>$${order.subtotal.toFixed(2)}</span>
      </div>
      <div style="display: flex; justify-content: space-between; padding: 8px 0; opacity: 0.8;">
        <span>Shipping</span>
        <span>$${order.shipping.toFixed(2)}</span>
      </div>
      <div style="display: flex; justify-content: space-between; padding: 8px 0; opacity: 0.8;">
        <span>Tax</span>
        <span>$${order.taxes.toFixed(2)}</span>
      </div>
      <div style="display: flex; justify-content: space-between; padding: 16px 0 0; font-size: 24px; font-weight: 600; border-top: 1px solid rgba(249, 248, 244, 0.2); margin-top: 8px;">
        <span>Total</span>
        <span>$${order.total.toFixed(2)}</span>
      </div>
    </div>
    
    <div style="background: #F2EFE9; padding: 24px; text-align: center; margin-top: 30px;">
      <p style="margin: 0; color: #786B59; font-style: italic;">View and manage this order in your admin dashboard</p>
    </div>
  </div>
</body>
</html>
`

    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: `New Order — ${orderId}`,
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
