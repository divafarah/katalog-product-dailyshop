import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { getProductById } from '../services/productService'
import { useProductContext } from '../context/ProductContext'

import type { Product } from '../types/Product'
import { formatRupiah } from '../utils/formatCurrency'

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [imageError, setImageError] = useState(false)

  const {
    toggleFavorite,
    isFavorite,
    addedProducts,
    removeProduct,
    addToCart,
    cartItems,
  } = useProductContext()

  const isAddedProduct = addedProducts.some(
    (item) => item.id === Number(id)
  )

  useEffect(() => {
    let isMounted = true

    const fetchProduct = async () => {
      try {
        setLoading(true)
        setError(null)
        setProduct(null)
        setImageError(false)

        if (!id || !Number.isInteger(Number(id)) || Number(id) <= 0) {
          throw new Error('Product ID tidak valid.')
        }

        const localProduct = addedProducts.find(
          (item) => item.id === Number(id)
        )

        if (localProduct) {
          if (isMounted) {
            setProduct(localProduct)
          }
        } else {
          const data = await getProductById(id)

          if (isMounted) {
            setProduct(data)
          }
        }
      } catch {
        if (isMounted) {
          setError('Produk tidak ditemukan atau gagal dimuat.')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchProduct()

    return () => {
      isMounted = false
    }
  }, [id, addedProducts])

  const handleDelete = () => {
    if (!product || !isAddedProduct) return

    const confirmed = window.confirm(
      `Yakin ingin menghapus ${product.title}?`
    )

    if (confirmed) {
      removeProduct(product.id)
      navigate('/products')
    }
  }

  const handleAddToCart = () => {
    if (!product || product.stock <= 0) return

    const currentItem = cartItems.find(
      (item) => item.product.id === product.id
    )

    const currentQuantity = currentItem?.quantity ?? 0

    if (currentQuantity >= product.stock) {
      window.alert('Jumlah produk di keranjang sudah mencapai batas stok.')
      return
    }

    addToCart(product)

    window.alert(
      `${product.title} berhasil ditambahkan ke keranjang!`
    )
  }

  const handleToggleFavorite = () => {
    if (!product) return

    toggleFavorite(product)
  }

  if (loading) {
    return (
      <p className="loading-message">
        Loading product details...
      </p>
    )
  }

  if (error || !product) {
    return (
      <section className="page-container">
        <h2>{error || 'Product not found'}</h2>

        <Link to="/products" className="detail-btn">
          Back to Products
        </Link>
      </section>
    )
  }

  const currentCartItem = cartItems.find(
    (item) => item.product.id === product.id
  )

  const cartQuantity = currentCartItem?.quantity ?? 0
  const isStockLimitReached = cartQuantity >= product.stock

  return (
    <section className="product-detail">
      <Link to="/products" className="back-link">
        ← Back to Products
      </Link>

      <div className="detail-container">
        <div className="detail-image">
          <img
            src={
              imageError
                ? 'https://placehold.co/600x600?text=No+Image'
                : product.thumbnail
            }
            alt={product.title}
            onError={() => setImageError(true)}
          />

          {isAddedProduct && (
            <>
              <Link
                to={`/products/${product.id}/edit`}
                className="edit-detail-btn"
              >
                ✏️ Edit Product
              </Link>

              <button
                type="button"
                className="delete-detail-btn"
                onClick={handleDelete}
              >
                🗑 Delete Product
              </button>
            </>
          )}
        </div>

        <div className="detail-info">
          <span className="product-category">
            {product.category}
          </span>

          <h1>{product.title}</h1>

          <p className="detail-rating">
            ⭐ {product.rating} / 5
          </p>

          <h2 className="product-price">
            {formatRupiah(product.price)}
          </h2>

          <p>{product.description}</p>

          <div className="detail-meta">
            <p>
              <strong>Brand:</strong> {product.brand || 'No brand'}
            </p>

            <p>
              <strong>Stock:</strong> {product.stock}
            </p>

            <p>
              <strong>Discount:</strong> {product.discountPercentage}%
            </p>
          </div>

          <button
            type="button"
            className="add-to-cart-btn"
            onClick={handleAddToCart}
            disabled={product.stock <= 0 || isStockLimitReached}
          >
            {product.stock <= 0
              ? 'Out of Stock'
              : isStockLimitReached
                ? 'Stock Limit Reached'
                : '🛒 Add to Cart'}
          </button>

          <button
            type="button"
            className="favorite-btn-detail"
            onClick={handleToggleFavorite}
            aria-pressed={isFavorite(product.id)}
          >
            {isFavorite(product.id)
              ? '♥ Remove from Favorites'
              : '♡ Add to Favorites'}
          </button>
        </div>
      </div>
    </section>
  )
}

export default ProductDetail