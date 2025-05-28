import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Filter, X } from 'lucide-react';
import { getProducts } from '../api/products';
import ProductCard from '../components/ProductCard';
import FilterSidebar from '../components/FilterSidebar';
import { Product } from '../types';

const Products = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: 'all',
    priceRange: [0, 1000] as [number, number],
    sortBy: 'newest',
  });

  const { data: products = [], isLoading, error } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: getProducts,
  });

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesCategory = filters.category === 'all' || product.category === filters.category;
    const matchesPrice = product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1];
    return matchesCategory && matchesPrice;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (filters.sortBy) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'rating':
        return b.rating.rate - a.rating.rate;
      default:
        return 0;
    }
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="w-12 h-12 border-t-2 border-b-2 rounded-full animate-spin border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 text-center">
        <h2 className="text-2xl font-semibold text-red-600 dark:text-red-400">Error loading products</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Please try again later</p>
      </div>
    );
  }

  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Our Products</h1>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 transition-colors duration-200 bg-gray-100 rounded-lg dark:bg-dark-secondary hover:bg-gray-200 dark:hover:bg-dark-accent"
        >
          {showFilters ? (
            <>
              <X className="w-5 h-5" />
              <span className="text-gray-700 dark:text-gray-300">Hide Filters</span>
            </>
          ) : (
            <>
              <Filter className="w-5 h-5" />
              <span className="text-gray-700 dark:text-gray-300">Show Filters</span>
            </>
          )}
        </button>
      </div>
      
      <div className="flex flex-col gap-8 md:flex-row">
        {showFilters && (
          <div className="flex-shrink-0 w-full md:w-64">
            <FilterSidebar filters={filters} onFilterChange={setFilters} />
          </div>
        )}
        
        <div className={`flex-1 ${showFilters ? 'md:ml-0' : ''}`}>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products; 