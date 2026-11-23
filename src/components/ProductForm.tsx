import { useState } from 'react'
import type { FormEvent, ChangeEvent } from 'react'
import type { Product } from '../types/Product'

interface ProductFormProps {
  onAddProduct?: (product: Omit<Product, 'id'>) => void
  onEditProduct?: (product: Omit<Product, 'id'>) => void
  initialProduct?: Product
  categories: string[]
}

const ProductForm = ({
  onAddProduct,
  onEditProduct,
  initialProduct,
  categories,
}: ProductFormProps) => {
  const [title, setTitle] = useState(initialProduct?.title || '')
  const [description, setDescription] = useState(initialProduct?.description || '')
  const [price, setPrice] = useState(initialProduct ? String(initialProduct.price) : '')
  const [category, setCategory] = useState(initialProduct?.category || '')
  const [brand, setBrand] = useState(initialProduct?.brand || '')
  const [stock, setStock] = useState(initialProduct ? String(initialProduct.stock) : '10')
  const [discount, setDiscount] = useState(
    initialProduct ? String(initialProduct.discountPercentage) : '0'
  )
  const [image, setImage] = useState(initialProduct?.thumbnail || '')
  const [preview, setPreview] = useState(initialProduct?.thumbnail || '')
  const [error, setError] = useState('')

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('File harus berupa gambar.')
      event.target.value = ''
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Ukuran foto maksimal 5 MB.')
      event.target.value = ''
      return
    }

    const reader = new FileReader()

    reader.onloadend = () => {
      if (typeof reader.result !== 'string') {
        setError('Gagal membaca file gambar.')
        return
      }

      setImage(reader.result)
      setPreview(reader.result)
      setError('')
    }

    reader.onerror = () => {
      setError('Terjadi kesalahan saat membaca gambar.')
    }

    reader.readAsDataURL(file)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')

    if (
      !title.trim() ||
      !description.trim() ||
      !price ||
      !category ||
      !brand.trim() ||
      !stock ||
      !discount ||
      !image
    ) {
      setError('Semua kolom wajib diisi.')
      return
    }

    if (title.trim().length < 3) {
      setError('Nama produk minimal 3 karakter.')
      return
    }

    if (description.trim().length < 10) {
      setError('Deskripsi produk minimal 10 karakter.')
      return
    }

    const numericPrice = Number(price)
    const numericStock = Number(stock)
    const numericDiscount = Number(discount)

    if (!Number.isInteger(numericPrice) || numericPrice <= 0) {
      setError('Harga harus berupa bilangan bulat lebih dari 0.')
      return
    }

    if (!Number.isInteger(numericStock) || numericStock < 0) {
      setError('Stock harus berupa bilangan bulat minimal 0.')
      return
    }

    if (
      !Number.isFinite(numericDiscount) ||
      numericDiscount < 0 ||
      numericDiscount > 100
    ) {
      setError('Discount harus antara 0 sampai 100%.')
      return
    }

    const productData: Omit<Product, 'id'> = {
      title: title.trim(),
      description: description.trim(),
      price: numericPrice,
      category,
      brand: brand.trim(),
      stock: numericStock,
      discountPercentage: numericDiscount,
      rating: initialProduct?.rating ?? 5,
      tags: initialProduct?.tags ?? [],
      thumbnail: image,
      images: [image],
    }

    if (initialProduct && onEditProduct) {
      onEditProduct(productData)
    } else if (onAddProduct) {
      onAddProduct(productData)
    }
  }

  const isEditing = Boolean(initialProduct)

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      <h2>{isEditing ? 'Edit Product' : 'Add New Product'}</h2>

      <div className="form-group">
        <label htmlFor="product-title">Product Name</label>
        <input
          id="product-title"
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Enter product name"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="product-description">Description</label>
        <textarea
          id="product-description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Enter product description"
          rows={4}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="product-price">Price (Rp)</label>
        <input
          id="product-price"
          type="number"
          min="1"
          step="1"
          value={price}
          onChange={(event) => setPrice(event.target.value)}
          placeholder="Contoh: 25000"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="product-category">Category</label>
        <select
          id="product-category"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          required
        >
          <option value="">Select category</option>

          {categories.map((item) => (
            <option key={item} value={item}>
              {item.replace(/-/g, ' ')}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="product-brand">Brand</label>
        <input
          id="product-brand"
          type="text"
          value={brand}
          onChange={(event) => setBrand(event.target.value)}
          placeholder="Enter brand name"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="product-stock">Stock</label>
        <input
          id="product-stock"
          type="number"
          min="0"
          step="1"
          value={stock}
          onChange={(event) => setStock(event.target.value)}
          placeholder="Enter stock"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="product-discount">Discount (%)</label>
        <input
          id="product-discount"
          type="number"
          min="0"
          max="100"
          step="any"
          value={discount}
          onChange={(event) => setDiscount(event.target.value)}
          placeholder="Enter discount percentage"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="product-image">Product Photo</label>
        <input
          id="product-image"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />
      </div>

      {preview && (
        <div className="image-preview">
          <p>Photo Preview</p>
          <img src={preview} alt="Product preview" />
        </div>
      )}

      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}

      <button type="submit" className="submit-btn">
        {isEditing ? 'Save Changes' : 'Add Product'}
      </button>
    </form>
  )
}

export default ProductForm