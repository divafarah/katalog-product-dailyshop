import { NavLink } from 'react-router-dom'
import { useProductContext } from '../context/ProductContext'

const Navbar = () => {
  const { favorites, cartItems } = useProductContext()

  const totalCartItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  )

  const getNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? 'active' : ''

  return (
    <nav className="navbar">
      <NavLink to="/" className="logo">
        DailyShop<span>.</span>
      </NavLink>

      <div className="nav-links">
        <NavLink to="/" end className={getNavLinkClass}>
          Home
        </NavLink>

        <NavLink to="/products" className={getNavLinkClass}>
          Products
        </NavLink>

        <NavLink to="/favorites" className={getNavLinkClass}>
          Favorites ({favorites.length})
        </NavLink>

        <NavLink to="/orders" className={getNavLinkClass}>
          Orders
        </NavLink>

        <NavLink to="/cart" className={getNavLinkClass}>
          Cart ({totalCartItems})
        </NavLink>
      </div>
    </nav>
  )
}

export default Navbar