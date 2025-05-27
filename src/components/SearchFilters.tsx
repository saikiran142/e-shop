import { useState } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';

interface SearchFiltersProps {
  onFilterChange: (filters: FilterState) => void;
  isOpen: boolean;
  onClose: () => void;
}

export interface FilterState {
  priceRange: [number, number];
  categories: string[];
  rating: number | null;
  sortBy: 'price-asc' | 'price-desc' | 'rating' | 'newest' | null;
}

const initialFilters: FilterState = {
  priceRange: [0, 1000],
  categories: [],
  rating: null,
  sortBy: null,
};

const categories = [
  "men's clothing",
  "women's clothing",
  "jewelery",
  "electronics",
];

const SearchFilters = ({ onFilterChange, isOpen, onClose }: SearchFiltersProps) => {
  const [filters, setFilters] = useState<FilterState>(initialFilters);

  const handlePriceChange = (value: string, index: number) => {
    const newPriceRange = [...filters.priceRange] as [number, number];
    newPriceRange[index] = Number(value);
    setFilters({ ...filters, priceRange: newPriceRange });
  };

  const handleCategoryToggle = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter((c) => c !== category)
      : [...filters.categories, category];
    setFilters({ ...filters, categories: newCategories });
  };

  const handleRatingChange = (rating: number) => {
    setFilters({ ...filters, rating: filters.rating === rating ? null : rating });
  };

  const handleSortChange = (sortBy: FilterState['sortBy']) => {
    setFilters({ ...filters, sortBy });
  };

  const handleApplyFilters = () => {
    onFilterChange(filters);
    onClose();
  };

  const handleReset = () => {
    setFilters(initialFilters);
    onFilterChange(initialFilters);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <SlidersHorizontal className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold">Filters</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="p-4 space-y-6">
          {/* Price Range */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-3">Price Range</h3>
            <div className="flex items-center space-x-4">
              <input
                type="number"
                value={filters.priceRange[0]}
                onChange={(e) => handlePriceChange(e.target.value, 0)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Min"
              />
              <span className="text-gray-500">to</span>
              <input
                type="number"
                value={filters.priceRange[1]}
                onChange={(e) => handlePriceChange(e.target.value, 1)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Max"
              />
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-3">Categories</h3>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryToggle(category)}
                  className={`px-3 py-2 text-sm rounded-lg text-left transition-colors duration-200 ${
                    filters.categories.includes(category)
                      ? 'bg-primary-50 text-primary-600'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Rating */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-3">Rating</h3>
            <div className="flex items-center space-x-2">
              {[4, 3, 2, 1].map((rating) => (
                <button
                  key={rating}
                  onClick={() => handleRatingChange(rating)}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm ${
                    filters.rating === rating
                      ? 'bg-primary-50 text-primary-600'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <span>★</span>
                  <span>& Up</span>
                </button>
              ))}
            </div>
          </div>

          {/* Sort By */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-3">Sort By</h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleSortChange('price-asc')}
                className={`px-3 py-2 text-sm rounded-lg text-left ${
                  filters.sortBy === 'price-asc'
                    ? 'bg-primary-50 text-primary-600'
                    : 'hover:bg-gray-50'
                }`}
              >
                Price: Low to High
              </button>
              <button
                onClick={() => handleSortChange('price-desc')}
                className={`px-3 py-2 text-sm rounded-lg text-left ${
                  filters.sortBy === 'price-desc'
                    ? 'bg-primary-50 text-primary-600'
                    : 'hover:bg-gray-50'
                }`}
              >
                Price: High to Low
              </button>
              <button
                onClick={() => handleSortChange('rating')}
                className={`px-3 py-2 text-sm rounded-lg text-left ${
                  filters.sortBy === 'rating'
                    ? 'bg-primary-50 text-primary-600'
                    : 'hover:bg-gray-50'
                }`}
              >
                Top Rated
              </button>
              <button
                onClick={() => handleSortChange('newest')}
                className={`px-3 py-2 text-sm rounded-lg text-left ${
                  filters.sortBy === 'newest'
                    ? 'bg-primary-50 text-primary-600'
                    : 'hover:bg-gray-50'
                }`}
              >
                Newest
              </button>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-200 flex items-center justify-between">
          <button
            onClick={handleReset}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
          >
            Reset
          </button>
          <button
            onClick={handleApplyFilters}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchFilters; 