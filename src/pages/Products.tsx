import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import type { CartItem } from '../store/slices/cartSlice';
import { Filter, ShoppingCart } from 'lucide-react';

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
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [sortBy, setSortBy] = useState<string>('default');

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await axios.get('https://fakestoreapi.com/products');
      return response.data as Product[];
    },
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

  // Get unique categories
  const categories = ['all', ...new Set(products.map((product) => product.category))];

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    return matchesCategory && matchesPrice;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
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
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Products</h1>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-card p-6 mb-8">
        <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-200">
          <div className="p-2 bg-primary-50 rounded-lg">
            <Filter className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
            <p className="text-sm text-gray-500">Refine your product selection</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Category Filter */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500 bg-white shadow-sm"
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
            <label className="block text-sm font-medium text-gray-700">
              Price Range
            </label>
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                  className="w-full pl-7 pr-3 rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500 bg-white shadow-sm"
                  min="0"
                  placeholder="Min"
                />
              </div>
              <span className="text-gray-500">-</span>
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                  className="w-full pl-7 pr-3 rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500 bg-white shadow-sm"
                  min="0"
                  placeholder="Max"
                />
              </div>
            </div>
          </div>

          {/* Sort Filter */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500 bg-white shadow-sm"
            >
              <option value="default">Default</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Rating</option>
            </select>
          </div>
        </div>

        {/* Active Filters */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            {selectedCategory !== 'all' && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-50 text-primary-700">
                {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}
                <button
                  onClick={() => setSelectedCategory('all')}
                  className="ml-2 text-primary-500 hover:text-primary-700"
                >
                  ×
                </button>
              </span>
            )}
            {(priceRange[0] > 0 || priceRange[1] < 1000) && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-50 text-primary-700">
                ${priceRange[0]} - ${priceRange[1]}
                <button
                  onClick={() => setPriceRange([0, 1000])}
                  className="ml-2 text-primary-500 hover:text-primary-700"
                >
                  ×
                </button>
              </span>
            )}
            {sortBy !== 'default' && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-50 text-primary-700">
                {sortBy === 'price-asc' ? 'Price: Low to High' :
                 sortBy === 'price-desc' ? 'Price: High to Low' :
                 'Rating'}
                <button
                  onClick={() => setSortBy('default')}
                  className="ml-2 text-primary-500 hover:text-primary-700"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {sortedProducts.map((product) => (
          <div
            key={product.id}
            className="group bg-white rounded-lg shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col"
          >
            <Link to={`/products/${product.id}`} className="block p-4 flex-grow">
              <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-100 mb-4 group-hover:bg-gray-50 transition-colors duration-300">
                <img
                  src={product.image}
                  alt={product.title}
                  className="h-48 w-full object-contain object-center group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors duration-200">
                {product.title}
              </h3>
              <div className="flex items-center justify-between">
                <p className="text-lg font-semibold text-primary-600">
                  ${product.price.toFixed(2)}
                </p>
                <div className="flex items-center text-yellow-400">
                  <span>★</span>
                  <span className="text-gray-600 text-sm ml-1">{product.rating.rate}</span>
                </div>
              </div>
            </Link>
            <div className="p-4 pt-0 mt-auto">
              <button
                onClick={() => handleAddToCart(product)}
                className="w-full bg-primary-600 text-white py-2.5 px-4 rounded-lg hover:bg-primary-700 transition-colors duration-200 flex items-center justify-center gap-2 group-hover:shadow-lg"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Add to Cart</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {sortedProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default Products; 