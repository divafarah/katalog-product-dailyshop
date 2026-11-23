interface SearchBarProps {
  search: string
  onSearchChange: (value: string) => void
}

const SearchBar = ({
  search,
  onSearchChange,
}: SearchBarProps) => {
  return (
    <div className="search-container">
      <span className="search-icon" aria-hidden="true">
        ⌕
      </span>

      <input
        type="text"
        placeholder="Search your favorite products..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        aria-label="Search products"
      />

      {search && (
        <button
          type="button"
          onClick={() => onSearchChange('')}
          className="clear-search"
          aria-label="Clear search"
        >
          ×
        </button>
      )}
    </div>
  )
}

export default SearchBar