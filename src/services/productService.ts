import axios from 'axios'
import type { Product, ProductResponse } from '../types/Product'
import { convertUsdToIdr } from '../utils/formatCurrency'

const API_URL = 'https://dummyjson.com'

export const getProducts = async (): Promise<Product[]> => {
  const response = await axios.get<ProductResponse>(
    `${API_URL}/products?limit=100`
  )

  return response.data.products.map((product) => ({
    ...product,
    price: convertUsdToIdr(product.price),
  }))
}

export const getProductById = async (id: string): Promise<Product> => {
  const response = await axios.get<Product>(
    `${API_URL}/products/${id}`
  )

  return {
    ...response.data,
    price: convertUsdToIdr(response.data.price),
  }
}

export const getCategories = async (): Promise<string[]> => {
  const response = await axios.get<string[]>(
    `${API_URL}/products/category-list`
  )

  return response.data
}