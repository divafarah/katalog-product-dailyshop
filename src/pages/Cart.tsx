import { useState } from 'react'
import { Link } from 'react-router-dom'

import { useProductContext } from '../context/ProductContext'
import { formatRupiah } from '../utils/formatCurrency'

const Cart = () => {
  const [showClearModal, setShowClearModal] = useState(false)

  const {
    cartItems,
    removeFromCart,
    updateCartQuantity,
    clearCart,
  } = useProductContext()

  const totalItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  )

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  )

  const handleClearCart = () => {
    clearCart()
    setShowClearModal(false)
  }

  if (cartItems.length === 0) {
    return (
      <section className="page-container cart-page">
        <div className="products-header">
          <span className="section-label">YOUR SHOPPING</span>
          <h1>Shopping Cart</h1>
          <p>Your cart is currently empty.</p>
        </div>

        <div className="empty-cart">
          <span className="empty-cart-icon">🛒</span>
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added anything yet.</p>

          <Link to="/products" className="detail-btn">
            Explore Products
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="page-container cart-page">

      {showClearModal && (
        <div
          className="clear-modal-overlay"
          onClick={() => setShowClearModal(false)}
        >
          <div
            className="clear-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="clear-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="clear-modal-icon">
              <span>🛒</span>
            </div>

            <h2 id="clear-modal-title">
              Kosongkan Keranjang?
            </h2>

            <p>
              Apakah kamu yakin ingin menghapus semua produk
              dari keranjang?
            </p>

            <div className="clear-modal-actions">
              <button
                type="button"
                className="clear-modal-cancel"
                onClick={() => setShowClearModal(false)}
              >
                Batal
              </button>

              <button
                type="button"
                className="clear-modal-confirm"
                onClick={handleClearCart}
              >
                Ya, Kosongkan
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="products-header">
        <span className="section-label">YOUR SHOPPING</span>
        <h1>Shopping Cart</h1>
        <p>You have {totalItems} item(s) in your cart.</p>
      </div>

      <div className="cart-container">
        <div className="cart-list">
          {cartItems.map((item) => (
            <div className="cart-item" key={item.product.id}>
              <img
                src={item.product.thumbnail}
                alt={item.product.title}
              />

              <div className="cart-item-info">
                <span>{item.product.category}</span>
                <h3>{item.product.title}</h3>
                <p>{formatRupiah(item.product.price)}</p>

                <div className="cart-quantity">
                  <button
                    type="button"
                    onClick={() =>
                      updateCartQuantity(
                        item.product.id,
                        item.quantity - 1
                      )
                    }
                    disabled={item.quantity <= 1}
                    aria-label={`Kurangi jumlah ${item.product.title}`}
                  >
                    −
                  </button>

                  <span>{item.quantity}</span>

                  <button
                    type="button"
                    onClick={() =>
                      updateCartQuantity(
                        item.product.id,
                        item.quantity + 1
                      )
                    }
                    disabled={item.quantity >= item.product.stock}
                    aria-label={`Tambah jumlah ${item.product.title}`}
                  >
                    +
                  </button>
                </div>

                <small>
                  Stok tersedia: {item.product.stock}
                </small>
              </div>

              <div className="cart-item-actions">
                <strong>
                  {formatRupiah(
                    item.product.price * item.quantity
                  )}
                </strong>

                <button
                  type="button"
                  className="cart-remove-btn"
                  onClick={() => removeFromCart(item.product.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <aside className="cart-summary">
          <h2>Order Summary</h2>

          <div>
            <span>Total Items</span>
            <strong>{totalItems}</strong>
          </div>

          <div className="cart-total">
            <span>Total Price</span>
            <strong>{formatRupiah(totalPrice)}</strong>
          </div>

          <Link to="/checkout" className="checkout-btn">
            Proceed to Checkout →
          </Link>

          <button
            type="button"
            className="clear-cart-btn"
            onClick={() => setShowClearModal(true)}
          >
            Clear Cart
          </button>

          <Link to="/products" className="continue-shopping">
            Continue Shopping
          </Link>
        </aside>
      </div>
    </section>
  )
}

export default Cart