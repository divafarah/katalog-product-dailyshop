import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { useProductContext } from '../context/ProductContext'
import { formatRupiah } from '../utils/formatCurrency'

const Checkout = () => {
  const navigate = useNavigate()

  const { cartItems } = useProductContext()

  const [customerName, setCustomerName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [error, setError] = useState('')

  const totalItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  )

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  )

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')

    if (
      !customerName.trim() ||
      !phone.trim() ||
      !address.trim()
    ) {
      setError('Semua informasi pengiriman wajib diisi.')
      return
    }

    if (customerName.trim().length < 2) {
      setError('Nama minimal terdiri dari 2 karakter.')
      return
    }

    if (address.trim().length < 10) {
      setError('Alamat minimal terdiri dari 10 karakter.')
      return
    }

    const cleanPhone = phone.replace(/[\s-]/g, '')

    if (!/^\+?\d{10,15}$/.test(cleanPhone)) {
      setError('Masukkan nomor telepon yang valid (10–15 digit).')
      return
    }

    if (cartItems.length === 0) {
      setError('Keranjang belanja kamu masih kosong.')
      return
    }

    const invalidStock = cartItems.find(
      (item) =>
        item.quantity < 1 ||
        item.quantity > item.product.stock ||
        item.product.stock <= 0
    )

    if (invalidStock) {
      setError(
        `Stok ${invalidStock.product.title} tidak mencukupi. Silakan periksa keranjang.`
      )
      return
    }

    const orderData = {
      customerName: customerName.trim(),
      phone: cleanPhone,
      address: address.trim(),
      cartItems: cartItems.map((item) => ({ ...item })),
      totalPrice,
    }

    navigate('/order-success', {
      state: orderData,
    })
  }

  if (cartItems.length === 0) {
    return (
      <section className="page-container">
        <h1>Checkout</h1>
        <p>Your shopping cart is empty.</p>

        <Link to="/products" className="detail-btn">
          Explore Products
        </Link>
      </section>
    )
  }

  return (
    <section className="page-container checkout-page">
      <div className="products-header">
        <span className="section-label">COMPLETE YOUR ORDER</span>
        <h1>Checkout</h1>
        <p>Fill in your delivery information below.</p>
      </div>

      <div className="checkout-container">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <h2>Shipping Information</h2>

          <label htmlFor="customerName">Full Name</label>
          <input
            id="customerName"
            type="text"
            value={customerName}
            onChange={(event) => setCustomerName(event.target.value)}
            placeholder="Enter your full name"
            required
            minLength={2}
          />

          <label htmlFor="phone">Phone Number</label>
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="Enter your phone number"
            required
          />

          <label htmlFor="address">Delivery Address</label>
          <textarea
            id="address"
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            placeholder="Enter your complete address"
            rows={5}
            required
            minLength={10}
          />

          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}

          <button type="submit" className="place-order-btn">
            Place Order
          </button>
        </form>

        <aside className="checkout-summary">
          <h2>Order Summary</h2>

          {cartItems.map((item) => (
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
            <span>Total Items</span>
            <strong>{totalItems}</strong>
          </div>

          <div className="checkout-total">
            <span>Total Payment</span>
            <strong>{formatRupiah(totalPrice)}</strong>
          </div>
        </aside>
      </div>
    </section>
  )
}

export default Checkout