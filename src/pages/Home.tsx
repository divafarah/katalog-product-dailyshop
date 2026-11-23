import { Link } from 'react-router-dom'

import { useProducts } from '../hooks/useProducts'
import { useProductContext } from '../context/ProductContext'
import ProductCard from '../components/ProductCard'

const Home = () => {
  const { products, loading, error } = useProducts()
  const { addedProducts } = useProductContext()

  const allProducts = [...addedProducts, ...products]
  const featuredProducts = allProducts.slice(0, 4)

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-content">
          <span className="hero-label">
            WELCOME TO DAILYSHOP
          </span>

          <h1>
            Everything You Need,
            <span> All in One Place.</span>
          </h1>

          <p>
            Temukan koleksi lengkap dari fashion, kebutuhan rumah & furniture,
            kosmetik, hingga camilan favoritmu.
          </p>

          <Link to="/products" className="hero-btn">
            Explore Products →
          </Link>
        </div>
      </section>

      <section className="featured-section">
        <div className="section-heading">
          <div>
            <span className="section-label">
              OUR COLLECTION
            </span>

            <h2>Featured Products</h2>
            <p>Discover our handpicked products for you.</p>
          </div>

          <Link to="/products" className="view-all">
            View All →
          </Link>
        </div>

        {loading && (
          <p className="loading-message">
            Loading products...
          </p>
        )}

        {error && (
          <p className="error-message">
            {error}
          </p>
        )}

        {!loading && !error && featuredProducts.length === 0 && (
          <p>No products available.</p>
        )}

        {!loading && !error && featuredProducts.length > 0 && (
          <div className="product-grid">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default Home