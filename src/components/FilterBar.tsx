interface FilterBarProps {
  categories: string[]
  category: string
  sort: string
  onCategoryChange: (value: string) => void
  onSortChange: (value: string) => void
}

const FilterBar = ({
  categories,
  category,
  sort,
  onCategoryChange,
  onSortChange,
}: FilterBarProps) => {
  return (
    <div className="filter-container">

      <div className="filter-group">
        <label htmlFor="category-filter">
          Category
        </label>

        <select
          id="category-filter"
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
        >
          <option value="all">All Categories</option>

          {categories.map((item) => (
            <option key={item} value={item}>
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="sort-filter">
          Sort By
        </label>

        <select
          id="sort-filter"
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
        >
          <option value="default">Default</option>
          <option value="name-asc">Name (A-Z)</option>
          <option value="price-asc">Price (Low to High)</option>
          <option value="price-desc">Price (High to Low)</option>
        </select>
      </div>

    </div>
  )
}

export default FilterBar