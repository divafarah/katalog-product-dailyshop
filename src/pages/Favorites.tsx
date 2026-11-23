import { Link } from 'react-router-dom'

import { useProductContext } from '../context/ProductContext'
import ProductCard from '../components/ProductCard'

const Favorites = () => {
  const { favorites } = useProductContext()

  return (
    <section className="page-container favorites-page">
      <div className="favorites-header">
        <span className="section-label">YOUR COLLECTION</span>
        <h1>My Favorites ♡</h1>
        <p>Your favorite products in one place.</p>
      </div>

      {favorites.length === 0 ? (
        <div className="favorites-empty">
          <div className="empty-icon">♡</div>

          <h2>No Favorites Yet</h2>

          <p>
            You haven't added any favorite products.
            Start exploring and save the products you love!
          </p>

          <Link to="/products" className="primary-btn">
            Explore Products →
          </Link>
        </div>
      ) : (
        <>
          <p className="results-count">
            You have {favorites.length} favorite products.
          </p>

          <div className="product-grid">
            {favorites.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        </>
      )}
    </section>
  )
}

export default Favorites