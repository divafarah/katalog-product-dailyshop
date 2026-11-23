import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'

const MainLayout = () => {
  return (
    <div className="app-layout">
      <Navbar />

      <main className="main-content">
        <Outlet />
      </main>

      <footer className="footer">
        <p>© 2026 DailyShop. Your Everyday Shopping Destination.</p>
      </footer>
    </div>
  )
}

export default MainLayout