import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import App from './App'
import { ProductProvider } from './context/ProductContext'

import './index.css'
import './App.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename="/katalogproduk-daily.shop">
      <ProductProvider>
        <App />
      </ProductProvider>
    </BrowserRouter>
  </StrictMode>,
)