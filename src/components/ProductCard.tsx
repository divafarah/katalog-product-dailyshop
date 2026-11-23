import { useState } from 'react'
import { Link } from 'react-router-dom'

import { useProductContext } from '../context/ProductContext'
import type { Product } from '../types/Product'
import { formatRupiah } from '../utils/formatCurrency'

interface ProductCardProps {
  product: Product
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { toggleFavorite, isFavorite } = useProductContext()
  const [imageError, setImageError] = useState(false)

  const favorite = isFavorite(product.id)

  return (
    <div className="product-card">
      <div className="product-image">
        <img
          src={
            imageError
              ? 'https://placehold.co/400x400?text=No+Image'
              : product.thumbnail
          }
          alt={product.title}
          onError={() => setImageError(true)}
        />

        <button
          type="button"
          className="favorite-btn"
          onClick={() => toggleFavorite(product)}
          aria-label={
            favorite
              ? `Remove ${product.title} from favorites`
              : `Add ${product.title} to favorites`
          }
          aria-pressed={favorite}
        >
          {favorite ? '♥' : '♡'}
        </button>
      </div>

      <div className="product-info">
        <span className="product-category">
          {product.category}
        </span>

        <h3>{product.title}</h3>

        <p className="product-rating">
          Rating: {product.rating ?? 'N/A'} / 5
        </p>

        <p className="product-price">
          {formatRupiah(product.price)}
        </p>

        <Link
          to={`/products/${product.id}`}
          className="detail-btn"
        >
          View Details
        </Link>
      </div>
    </div>
  )
}

export default ProductCard