import { Link } from 'react-router-dom'
import { useProductContext } from '../context/ProductContext'
import type { Product } from '../types/Product'
import { formatRupiah } from '../utils/formatCurrency'

interface ProductCardProps {
  product: Product
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { toggleFavorite, isFavorite } = useProductContext()

  return (
    <div className="product-card">
      <div className="product-image">
        <img src={product.thumbnail} alt={product.title} />

        <button
          className="favorite-btn"
          onClick={() => toggleFavorite(product)}
          aria-label="Toggle favorite"
        >
          {isFavorite(product.id) ? '♥' : '♡'}
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