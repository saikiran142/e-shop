import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import type { CartItem } from '../store/slices/cartSlice';
import { Filter, ShoppingCart, X } from 'lucide-react';
import { getProducts } from '../api/products';
import ProductCard from '../components/ProductCard';
import FilterSidebar from '../components/FilterSidebar';
import { Product } from '../types';

interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

const Products = () => {
  const dispatch = useDispatch();
  const [showFilters, setShowFilters] = useState(true);
  const [filters, setFilters] = useState({
    category: 'all',
    priceRange: [0, 1000] as [number, number],
    sortBy: 'newest',
  });

  const { data: products = [], isLoading, error } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: getProducts,
  });

  const handleAddToCart = (product: Product) => {
    const cartItem: CartItem = {
      id: product.id,
      name: product.title,
      price: product.price,
      image: product.image,
      quantity: 1,
    };
    dispatch(addToCart(cartItem));
  };

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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-red-600 dark:text-red-400">Error loading products</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Please try again later</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Our Products</h1>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-dark-secondary hover:bg-gray-200 dark:hover:bg-dark-accent transition-colors duration-200"
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
      
      <div className="flex flex-col md:flex-row gap-8">
        {showFilters && (
          <div className="w-full md:w-64 flex-shrink-0">
            <FilterSidebar filters={filters} onFilterChange={setFilters} />
          </div>
        )}
        
        <div className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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