import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import ProductForm from '../components/ProductForm'
import { useProductContext } from '../context/ProductContext'
import { getCategories } from '../services/productService'

import type { Product } from '../types/Product'

const EditProduct = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const { addedProducts, updateProduct } = useProductContext()

  const [categories, setCategories] = useState<string[]>([])
  const [product, setProduct] = useState<Product | null>(null)

  useEffect(() => {
    const foundProduct = addedProducts.find(
      (item) => item.id === Number(id)
    )

    setProduct(foundProduct || null)
  }, [id, addedProducts])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories()

        const addedCategories = addedProducts.map(
          (item) => item.category
        )

        setCategories(
          [...new Set([...data, ...addedCategories])].sort()
        )
      } catch {
        setCategories(
          [...new Set(addedProducts.map(
            (item) => item.category
          ))].sort()
        )
      }
    }

    fetchCategories()
  }, [addedProducts])

  const handleEditProduct = (productData: Omit<Product, 'id'>) => {
    if (!product) return

    const updatedProduct: Product = {
      ...product,
      ...productData,
    }

    updateProduct(updatedProduct)
    navigate(`/products/${product.id}`)
  }

  if (!product) {
    return (
      <section className="page-container">
        <h2>Product not found.</h2>
        <Link to="/products">Back to Products</Link>
      </section>
    )
  }

  return (
    <section className="page-container">
      <div className="products-header">
        <span className="section-label">YOUR COLLECTION</span>
        <h1>Edit Product</h1>
        <p>Update your product information.</p>
      </div>

      <ProductForm
        initialProduct={product}
        onEditProduct={handleEditProduct}
        categories={categories}
      />
    </section>
  )
}

export default EditProduct