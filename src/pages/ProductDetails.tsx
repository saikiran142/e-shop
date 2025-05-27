import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import type { CartItem } from '../store/slices/cartSlice';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { FiShoppingCart, FiStar } from 'react-icons/fi';
import { getProduct } from '../api/products';
import { Product } from '../types';

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);

  const { data: product, isLoading, error } = useQuery<Product>({
    queryKey: ['product', id],
    queryFn: () => getProduct(Number(id)),
  });

  const { data: suggestedProducts = [] } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await axios.get('https://fakestoreapi.com/products');
      return response.data as Product[];
    },
    enabled: !!product,
  });

  const handleAddToCart = () => {
    if (product) {
      dispatch(addToCart({ ...product, quantity }));
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-red-600 dark:text-red-400">Error loading product</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Please try again later</p>
      </div>
    );
  }

  // Filter suggested products (same category, excluding current product)
  const filteredSuggestions = suggestedProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Link
        to="/products"
        className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors duration-200"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Products
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="bg-white dark:bg-dark-secondary rounded-lg shadow-card p-6">
          <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-100 dark:bg-dark-primary">
            <img
              src={product.image}
              alt={product.title}
              className="h-96 w-full object-contain object-center"
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="bg-white dark:bg-dark-secondary rounded-lg shadow-card p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {product.title}
          </h1>

          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center text-yellow-400">
              <FiStar className="w-5 h-5" />
              <span className="ml-1 text-gray-600 dark:text-gray-400">
                {product.rating.rate} ({product.rating.count} reviews)
              </span>
            </div>
          </div>

          <p className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-6">
            ${product.price.toFixed(2)}
          </p>

          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {product.description}
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <label htmlFor="quantity" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Quantity
              </label>
              <select
                id="quantity"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="rounded-lg border-gray-300 dark:border-dark-primary focus:border-primary-500 focus:ring-primary-500 bg-white dark:bg-dark-primary shadow-sm text-gray-900 dark:text-white"
              >
                {[1, 2, 3, 4, 5].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleAddToCart}
              className="w-full bg-primary-600 dark:bg-primary-500 text-white py-3 px-6 rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <FiShoppingCart className="w-5 h-5" />
              <span>Add to Cart</span>
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-dark-primary">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Product Details
            </h2>
            <div className="space-y-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-medium text-gray-900 dark:text-white">Category:</span>{' '}
                {product.category}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Suggested Products */}
      {filteredSuggestions.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">You May Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredSuggestions.map((suggestedProduct) => (
              <div
                key={suggestedProduct.id}
                className="group bg-white dark:bg-dark-secondary rounded-lg shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col"
              >
                <Link to={`/products/${suggestedProduct.id}`} className="block p-4 flex-grow">
                  <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-100 dark:bg-dark-primary mb-4 group-hover:bg-gray-50 dark:group-hover:bg-dark-primary/80 transition-colors duration-300">
                    <img
                      src={suggestedProduct.image}
                      alt={suggestedProduct.title}
                      className="h-48 w-full object-contain object-center group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200">
                    {suggestedProduct.title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-semibold text-primary-600 dark:text-primary-400">
                      ${suggestedProduct.price.toFixed(2)}
                    </p>
                    <div className="flex items-center text-yellow-400">
                      <span>★</span>
                      <span className="text-gray-600 dark:text-gray-400 text-sm ml-1">
                        {suggestedProduct.rating.rate}
                      </span>
                    </div>
                  </div>
                </Link>
                <div className="p-4 pt-0 mt-auto">
                  <button
                    onClick={() => dispatch(addToCart({ ...suggestedProduct, quantity }))}
                    className="w-full bg-primary-600 dark:bg-primary-500 text-white py-2.5 px-4 rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors duration-200 flex items-center justify-center gap-2 group-hover:shadow-lg"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails; 