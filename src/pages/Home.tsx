import { Link } from 'react-router-dom'
import { useProducts } from '../hooks/useProducts'
import ProductCard from '../components/ProductCard'

const Home = () => {
  const { products, loading, error } = useProducts()

  const featuredProducts = products.slice(0, 4)

  return (
    <div className="home-page">

      <section className="hero-section">
        <div className="hero-content">
          <span className="hero-label">
            WELCOME TO DAILYSHOP
          </span>

          <h1>
            Find Your Everyday
            <span> Favorites.</span>
          </h1>

          <p>
            Discover amazing products for your everyday needs.
            Find your favorites and explore something new.
          </p>

          <Link to="/products" className="hero-btn">
            Explore Products →
          </Link>
        </div>

        <div className="hero-image">
          <img
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800"
            alt="DailyShop shopping collection"
          />
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

        {!loading && !error && (
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