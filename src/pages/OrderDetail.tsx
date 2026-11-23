import { Link, Navigate, useParams } from 'react-router-dom'

import { useProductContext } from '../context/ProductContext'
import { formatRupiah } from '../utils/formatCurrency'

const OrderDetail = () => {
  const { id } = useParams()
  const { orders } = useProductContext()

  const order = orders.find(
    (item) => item.id === Number(id)
  )

  if (!order) {
    return <Navigate to="/orders" replace />
  }

  return (
    <section className="page-container order-detail-page">
      <div className="products-header">
        <span className="section-label">ORDER INFORMATION</span>
        <h1>Order Detail</h1>
        <p>Complete information about your purchase.</p>
      </div>

      <div className="order-detail-card">
        <div className="history-header">
          <div>
            <span className="section-label">ORDER ID</span>
            <h3>#{order.id}</h3>
          </div>

          <span className="order-status">Completed</span>
        </div>

        <p className="history-date">
          Order Date: {new Date(order.orderDate).toLocaleString('id-ID')}
        </p>

        <div className="history-customer">
          <h2>Shipping Information</h2>

          <p><strong>Recipient:</strong> {order.customerName}</p>
          <p><strong>Phone:</strong> {order.phone}</p>
          <p><strong>Address:</strong> {order.address}</p>
        </div>

        <div className="history-products">
          <h2>Products Ordered</h2>

          {order.cartItems.map((item) => (
            <div className="checkout-item" key={item.product.id}>
              <span>
                {item.product.title} x {item.quantity}
              </span>

              <strong>
                {formatRupiah(item.product.price * item.quantity)}
              </strong>
            </div>
          ))}
        </div>

        <div className="history-total">
          <span>Total Payment</span>
          <strong>{formatRupiah(order.totalPrice)}</strong>
        </div>
        <Link
  to={`/orders/${order.id}`}
  className="detail-btn"
>
  View Details
</Link>

        <Link to="/orders" className="detail-btn">
          Back to Order History
        </Link>
      </div>
    </section>
  )
}

export default OrderDetail