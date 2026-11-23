import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import ProductForm from '../components/ProductForm'
import { useProductContext } from '../context/ProductContext'
import { getCategories } from '../services/productService'

import type { Product } from '../types/Product'

const AddProduct = () => {
  const navigate = useNavigate()
  const { addProduct, addedProducts } = useProductContext()

  const [categories, setCategories] = useState<string[]>([])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories()

        const addedCategories = addedProducts.map(
          (product) => product.category
        )

        setCategories(
          [...new Set([...data, ...addedCategories])].sort()
        )
      } catch {
        setCategories(
          [...new Set(addedProducts.map(
            (product) => product.category
          ))].sort()
        )
      }
    }

    fetchCategories()
  }, [addedProducts])

  const handleAddProduct = (productData: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      id: Date.now(),
      ...productData,
    }

    addProduct(newProduct)
    navigate('/products')
  }

  return (
    <section className="page-container">
      <div className="products-header">
        <span className="section-label">YOUR COLLECTION</span>
        <h1>Add New Product</h1>
        <p>Add a new product to your DailyShop collection.</p>
      </div>

      <ProductForm
        onAddProduct={handleAddProduct}
        categories={categories}
      />
    </section>
  )
}

export default AddProduct