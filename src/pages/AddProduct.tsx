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
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const fetchCategories = async () => {
      try {
        const data = await getCategories()

        const addedCategories = addedProducts
          .map((product) => product.category)
          .filter(Boolean)

        if (isMounted) {
          setCategories(
            [...new Set([...data, ...addedCategories])].sort()
          )
        }
      } catch {
        if (isMounted) {
          const addedCategories = addedProducts
            .map((product) => product.category)
            .filter(Boolean)

          setCategories([...new Set(addedCategories)].sort())
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchCategories()

    return () => {
      isMounted = false
    }
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

      {loading ? (
        <p>Loading categories...</p>
      ) : (
        <ProductForm
          onAddProduct={handleAddProduct}
          categories={categories}
        />
      )}
    </section>
  )
}

export default AddProduct