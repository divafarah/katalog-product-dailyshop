import { Link } from 'react-router-dom'

import { useProductContext } from '../context/ProductContext'
import { formatRupiah } from '../utils/formatCurrency'

const OrderHistory = () => {
  const { orders } = useProductContext()

  return (
    <section className="page-container order-history-page">
      <div className="products-header">
        <span className="section-label">YOUR PURCHASES</span>
        <h1>Order History</h1>
        <p>Keep track of your previous orders.</p>
      </div>

      {orders.length === 0 ? (
        <div className="empty-cart">
          <span className="empty-cart-icon">📦</span>
          <h2>No Orders Yet</h2>
          <p>Your order history will appear here.</p>

          <Link to="/products" className="detail-btn">
            Explore Products
          </Link>
        </div>
      ) : (
        <div className="order-history-list">
          {orders.map((order) => {
            const orderDate = new Date(order.orderDate)
            const isValidDate = !Number.isNaN(orderDate.getTime())

            const totalItems = order.cartItems.reduce(
              (total, item) => total + item.quantity,
              0
            )

            return (
              <article className="history-card" key={order.id}>
                <div className="history-header">
                  <div>
                    <span className="section-label">ORDER ID</span>
                    <h3>#{order.id}</h3>
                  </div>

                  <span className="order-status">
                    Completed
                  </span>
                </div>

                <p className="history-date">
                  {isValidDate
                    ? orderDate.toLocaleString('id-ID', {
                        dateStyle: 'long',
                        timeStyle: 'short',
                      })
                    : 'Tanggal tidak tersedia'}
                </p>

                <div className="history-customer">
                  <p>
                    <strong>Recipient:</strong> {order.customerName}
                  </p>

                  <p>
                    <strong>Phone:</strong> {order.phone}
                  </p>

                  <p>
                    <strong>Address:</strong> {order.address}
                  </p>
                </div>

                <div className="history-products">
                  {order.cartItems.map((item) => (
                    <div
                      className="checkout-item"
                      key={item.product.id}
                    >
                      <span>
                        {item.product.title} × {item.quantity}
                      </span>

                      <strong>
                        {formatRupiah(
                          item.product.price * item.quantity
                        )}
                      </strong>
                    </div>
                  ))}
                </div>

                <div className="history-total">
                  <span>
                    Total Payment ({totalItems} items)
                  </span>

                  <strong>
                    {formatRupiah(order.totalPrice)}
                  </strong>
                </div>

                <Link
                  to={`/orders/${order.id}`}
                  className="detail-btn"
                  aria-label={`View details for order ${order.id}`}
                >
                  View Order Details
                </Link>
              </article>
            )
          })}
        </div>
      )}
    </section>
  )
}

export default OrderHistory