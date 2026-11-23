import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'

import { useProducts } from '../hooks/useProducts'
import { getCategories } from '../services/productService'
import { useProductContext } from '../context/ProductContext'

import ProductCard from '../components/ProductCard'
import SearchBar from '../components/SearchBar'
import FilterBar from '../components/FilterBar'
import Pagination from '../components/Pagination'

const Products = () => {
  const { products, loading, error } = useProducts()
  const { addedProducts } = useProductContext()

  const [searchParams, setSearchParams] = useSearchParams()
  const [categories, setCategories] = useState<string[]>([])

  const search = searchParams.get('search') || ''
  const category = searchParams.get('category') || 'all'
  const sort = searchParams.get('sort') || 'default'

  const currentPage = Math.max(
    1,
    Number(searchParams.get('page')) || 1
  )

  const productsPerPage = 8

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories()
        setCategories(data)
      } catch {
        setCategories([])
      }
    }

    fetchCategories()
  }, [])

  useEffect(() => {
    setCategories((prev) => {
      const newCategories = addedProducts
        .map((product) => product.category)
        .filter((item) => !prev.includes(item))

      return [...prev, ...newCategories]
    })
  }, [addedProducts])

  const updateParams = (key: string, value: string) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev)

      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }

      params.delete('page')

      return params
    })
  }

  const filteredProducts = useMemo(() => {
    let result = [...addedProducts, ...products]

    if (search) {
      result = result.filter((product) =>
        product.title.toLowerCase().includes(search.toLowerCase())
      )
    }

    if (category !== 'all') {
      result = result.filter(
        (product) => product.category === category
      )
    }

    if (sort === 'name-asc') {
      result.sort((a, b) => a.title.localeCompare(b.title))
    } else if (sort === 'price-asc') {
      result.sort((a, b) => a.price - b.price)
    } else if (sort === 'price-desc') {
      result.sort((a, b) => b.price - a.price)
    }

    return result
  }, [products, addedProducts, search, category, sort])

  const totalPages = Math.ceil(
    filteredProducts.length / productsPerPage
  )

  const validPage = Math.min(
    currentPage,
    Math.max(1, totalPages)
  )

  const startIndex = (validPage - 1) * productsPerPage

  const displayedProducts = filteredProducts.slice(
    startIndex,
    startIndex + productsPerPage
  )

  return (
    <section className="products-page">

      <div className="products-header">
        <span className="section-label">OUR COLLECTION</span>
        <h1>Explore Our Products</h1>
        <p>Find something special for your everyday needs.</p>

        <Link to="/products/add" className="primary-btn">
          + Add Product
        </Link>
      </div>

      <div className="products-toolbar">
        <SearchBar
          search={search}
          onSearchChange={(value) => updateParams('search', value)}
        />

        <FilterBar
          categories={categories}
          category={category}
          sort={sort}
          onCategoryChange={(value) =>
            updateParams('category', value === 'all' ? '' : value)
          }
          onSortChange={(value) => updateParams('sort', value)}
        />
      </div>

      {loading && (
        <p className="loading-message">Loading products...</p>
      )}

      {error && (
        <p className="error-message">{error}</p>
      )}

      {!loading && !error && (
        <>
          <p className="results-count">
            Showing {filteredProducts.length} products
          </p>

          {displayedProducts.length === 0 ? (
            <div className="empty-state">
              <h3>No products found</h3>
              <p>Try another keyword or category.</p>
            </div>
          ) : (
            <div className="product-grid">
              {displayedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
            </div>
          )}

          <Pagination
            currentPage={validPage}
            totalPages={totalPages}
            onPageChange={(page) =>
              setSearchParams((prev) => {
                const params = new URLSearchParams(prev)
                params.set('page', String(page))
                return params
              })
            }
          />
        </>
      )}

    </section>
  )
}

export default Products