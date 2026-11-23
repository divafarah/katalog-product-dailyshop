import { NavLink } from 'react-router-dom'
import { useProductContext } from '../context/ProductContext'

const Navbar = () => {
  const { favorites, cartItems } = useProductContext()

  const totalCartItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  )

  return (
    <nav className="navbar">
      <NavLink to="/" className="logo">
        DailyShop<span>.</span>
      </NavLink>

      <div className="nav-links">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/products">Products</NavLink>

        <NavLink to="/favorites">
          Favorites ({favorites.length})
        </NavLink>

        <NavLink to="/orders">
          Orders
        </NavLink>

        <NavLink to="/cart">
          Cart ({totalCartItems})
        </NavLink>
      </div>
    </nav>
  )
}

export default Navbar