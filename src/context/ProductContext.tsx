import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

import type { ReactNode } from 'react'
import type { Product } from '../types/Product'

export interface CartItem {
  product: Product
  quantity: number
}

export interface Order {
  id: number
  orderDate: string
  customerName: string
  phone: string
  address: string
  cartItems: CartItem[]
  totalPrice: number
}

type NewOrder = Omit<Order, 'id' | 'orderDate'>

interface ProductContextType {
  favorites: Product[]
  addedProducts: Product[]
  cartItems: CartItem[]
  orders: Order[]
  addProduct: (product: Product) => void
  updateProduct: (product: Product) => void
  removeProduct: (id: number) => void
  toggleFavorite: (product: Product) => void
  isFavorite: (id: number) => boolean
  addToCart: (product: Product) => void
  removeFromCart: (id: number) => void
  updateCartQuantity: (id: number, quantity: number) => void
  clearCart: () => void
  addOrder: (order: NewOrder) => void
}

const ProductContext = createContext<ProductContextType | undefined>(
  undefined
)

interface ProductProviderProps {
  children: ReactNode
}

const getSavedData = <T,>(key: string, fallback: T): T => {
  try {
    const savedData = localStorage.getItem(key)
    return savedData ? JSON.parse(savedData) as T : fallback
  } catch {
    return fallback
  }
}

export const ProductProvider = ({
  children,
}: ProductProviderProps) => {
  const [favorites, setFavorites] = useState<Product[]>(
    () => getSavedData('dailyshop-favorites', [])
  )

  const [addedProducts, setAddedProducts] = useState<Product[]>(
    () => getSavedData('dailyshop-products', [])
  )

  const [cartItems, setCartItems] = useState<CartItem[]>(
    () => getSavedData('dailyshop-cart', [])
  )

  const [orders, setOrders] = useState<Order[]>(
    () => getSavedData('dailyshop-orders', [])
  )

  useEffect(() => {
    localStorage.setItem('dailyshop-favorites', JSON.stringify(favorites))
  }, [favorites])

  useEffect(() => {
    localStorage.setItem('dailyshop-products', JSON.stringify(addedProducts))
  }, [addedProducts])

  useEffect(() => {
    localStorage.setItem('dailyshop-cart', JSON.stringify(cartItems))
  }, [cartItems])

  useEffect(() => {
    localStorage.setItem('dailyshop-orders', JSON.stringify(orders))
  }, [orders])

  const addProduct = useCallback((product: Product) => {
    setAddedProducts((prev) => [product, ...prev])
  }, [])

  const updateProduct = useCallback((updatedProduct: Product) => {
    setAddedProducts((prev) =>
      prev.map((product) =>
        product.id === updatedProduct.id ? updatedProduct : product
      )
    )

    setFavorites((prev) =>
      prev.map((product) =>
        product.id === updatedProduct.id ? updatedProduct : product
      )
    )

    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === updatedProduct.id
          ? { ...item, product: updatedProduct }
          : item
      )
    )
  }, [])

  const removeProduct = useCallback((id: number) => {
    setAddedProducts((prev) =>
      prev.filter((product) => product.id !== id)
    )

    setFavorites((prev) =>
      prev.filter((product) => product.id !== id)
    )

    setCartItems((prev) =>
      prev.filter((item) => item.product.id !== id)
    )
  }, [])

  const toggleFavorite = useCallback((product: Product) => {
    setFavorites((prev) => {
      const exists = prev.some((item) => item.id === product.id)

      return exists
        ? prev.filter((item) => item.id !== product.id)
        : [...prev, product]
    })
  }, [])

  const isFavorite = useCallback((id: number) => {
    return favorites.some((item) => item.id === id)
  }, [favorites])

  const addToCart = useCallback((product: Product) => {
    setCartItems((prev) => {
      const exists = prev.find(
        (item) => item.product.id === product.id
      )

      const currentQuantity = exists?.quantity ?? 0

      if (currentQuantity >= product.stock) {
        return prev
      }

      if (exists) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }

      return [...prev, { product, quantity: 1 }]
    })
  }, [])

  const removeFromCart = useCallback((id: number) => {
    setCartItems((prev) =>
      prev.filter((item) => item.product.id !== id)
    )
  }, [])

  const updateCartQuantity = useCallback((id: number, quantity: number) => {
    if (quantity < 1) return

    setCartItems((prev) =>
      prev.map((item) => {
        if (item.product.id !== id) return item

        const safeQuantity = Math.min(quantity, item.product.stock)

        return { ...item, quantity: safeQuantity }
      })
    )
  }, [])

  const clearCart = useCallback(() => {
    setCartItems([])
  }, [])

  const addOrder = useCallback((order: NewOrder) => {
    const newOrder: Order = {
      ...order,
      id: Date.now(),
      orderDate: new Date().toISOString(),
    }

    setOrders((prev) => [newOrder, ...prev])
  }, [])

  return (
    <ProductContext.Provider
      value={{
        favorites,
        addedProducts,
        cartItems,
        orders,
        addProduct,
        updateProduct,
        removeProduct,
        toggleFavorite,
        isFavorite,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        addOrder,
      }}
    >
      {children}
    </ProductContext.Provider>
  )
}

export const useProductContext = () => {
  const context = useContext(ProductContext)

  if (!context) {
    throw new Error(
      'useProductContext harus digunakan di dalam ProductProvider'
    )
  }

  return context
}