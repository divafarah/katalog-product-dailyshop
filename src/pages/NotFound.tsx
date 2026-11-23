import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <section className="not-found">
      <h1>404</h1>
      <h2>Oops! Page Not Found</h2>
      <p>
        The page you are looking for doesn't exist
        or may have been moved.
      </p>

      <Link to="/" className="detail-btn">
        Back to Home
      </Link>
    </section>
  )
}

export default NotFound