import { FiFilter } from 'react-icons/fi';

interface FilterSidebarProps {
  filters: {
    category: string;
    priceRange: [number, number];
    sortBy: string;
  };
  onFilterChange: (filters: {
    category: string;
    priceRange: [number, number];
    sortBy: string;
  }) => void;
}

const FilterSidebar = ({ filters, onFilterChange }: FilterSidebarProps) => {
  const categories = [
    'all',
    'electronics',
    'jewelery',
    "men's clothing",
    "women's clothing",
  ];

  const handleCategoryChange = (category: string) => {
    onFilterChange({ ...filters, category });
  };

  const handlePriceRangeChange = (index: number, value: number) => {
    const newPriceRange = [...filters.priceRange] as [number, number];
    newPriceRange[index] = value;
    onFilterChange({ ...filters, priceRange: newPriceRange });
  };

  const handleSortChange = (sortBy: string) => {
    onFilterChange({ ...filters, sortBy });
  };

  return (
    <div className="bg-white dark:bg-dark-secondary rounded-lg shadow-card p-6">
      <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-200 dark:border-dark-primary">
        <div className="p-2 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
          <FiFilter className="w-5 h-5 text-primary-600 dark:text-primary-400" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Filters</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Refine your product selection</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Category Filter */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Category
          </label>
          <select
            value={filters.category}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="w-full rounded-lg border-gray-300 dark:border-dark-primary focus:border-primary-500 focus:ring-primary-500 bg-white dark:bg-dark-primary shadow-sm text-gray-900 dark:text-white"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Price Range Filter */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Price Range
          </label>
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">$</span>
              <input
                type="number"
                value={filters.priceRange[0]}
                onChange={(e) => handlePriceRangeChange(0, Number(e.target.value))}
                className="w-full pl-7 pr-3 rounded-lg border-gray-300 dark:border-dark-primary focus:border-primary-500 focus:ring-primary-500 bg-white dark:bg-dark-primary shadow-sm text-gray-900 dark:text-white"
                min="0"
                placeholder="Min"
              />
            </div>
            <span className="text-gray-500 dark:text-gray-400">-</span>
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">$</span>
              <input
                type="number"
                value={filters.priceRange[1]}
                onChange={(e) => handlePriceRangeChange(1, Number(e.target.value))}
                className="w-full pl-7 pr-3 rounded-lg border-gray-300 dark:border-dark-primary focus:border-primary-500 focus:ring-primary-500 bg-white dark:bg-dark-primary shadow-sm text-gray-900 dark:text-white"
                min="0"
                placeholder="Max"
              />
            </div>
          </div>
        </div>

        {/* Sort Filter */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Sort By
          </label>
          <select
            value={filters.sortBy}
            onChange={(e) => handleSortChange(e.target.value)}
            className="w-full rounded-lg border-gray-300 dark:border-dark-primary focus:border-primary-500 focus:ring-primary-500 bg-white dark:bg-dark-primary shadow-sm text-gray-900 dark:text-white"
          >
            <option value="newest">Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Rating</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar; 