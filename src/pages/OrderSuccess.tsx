import { useEffect, useRef } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'

import { useProductContext } from '../context/ProductContext'
import type { CartItem } from '../context/ProductContext'
import { formatRupiah } from '../utils/formatCurrency'

interface OrderData {
  customerName: string
  phone: string
  address: string
  cartItems: CartItem[]
  totalPrice: number
}

const OrderSuccess = () => {
  const location = useLocation()
  const { addOrder, clearCart } = useProductContext()

  const order = location.state as OrderData | null
  const hasProcessed = useRef(false)

  const isValidOrder =
    !!order &&
    !!order.cartItems?.length &&
    !!order.customerName &&
    !!order.phone &&
    !!order.address

  useEffect(() => {
    if (!isValidOrder || !order || hasProcessed.current) {
      return
    }

    hasProcessed.current = true

    addOrder({
      customerName: order.customerName,
      phone: order.phone,
      address: order.address,
      cartItems: order.cartItems,
      totalPrice: order.totalPrice,
    })

    clearCart()
  }, [isValidOrder, order, addOrder, clearCart])

  if (!isValidOrder || !order) {
    return <Navigate to="/cart" replace />
  }

  return (
    <section className="page-container order-success-page">
      <div className="order-success-card">
        <div className="success-icon">✓</div>

        <span className="section-label">ORDER COMPLETED</span>

        <h1>Thank You for Your Order!</h1>

        <p>
          Your order has been successfully placed.
        </p>

        <div className="order-information">
          <h2>Shipping Information</h2>

          <p>
            <strong>Name:</strong> {order.customerName}
          </p>

          <p>
            <strong>Phone:</strong> {order.phone}
          </p>

          <p>
            <strong>Address:</strong> {order.address}
          </p>
        </div>

        <div className="order-information">
          <h2>Order Details</h2>

          {order.cartItems.map((item) => (
            <div className="checkout-item" key={item.product.id}>
              <span>
                {item.product.title} × {item.quantity}
              </span>

              <strong>
                {formatRupiah(item.product.price * item.quantity)}
              </strong>
            </div>
          ))}

          <div className="checkout-total">
            <strong>Total Payment</strong>
            <strong>{formatRupiah(order.totalPrice)}</strong>
          </div>
        </div>

        <Link to="/products" className="detail-btn">
          Continue Shopping
        </Link>
      </div>
    </section>
  )
}

export default OrderSuccess