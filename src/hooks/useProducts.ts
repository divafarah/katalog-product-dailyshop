import { useEffect, useState } from 'react'
import { getProducts } from '../services/productService'
import type { Product } from '../types/Product'

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        setError(null)

        const data = await getProducts()
        setProducts(data)
      } catch {
        setError('Gagal mengambil data produk. Silakan coba lagi.')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  return {
    products,
    loading,
    error,
    setProducts,
  }
}