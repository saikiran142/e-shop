import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
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
        <div className="w-12 h-12 border-t-2 border-b-2 rounded-full animate-spin border-primary-500"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="py-12 text-center">
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
    <div className="container px-4 py-8 mx-auto">
      {/* Back Button */}
      <Link
        to="/products"
        className="inline-flex items-center mb-6 text-gray-600 transition-colors duration-200 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Products
      </Link>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Product Image */}
        <div className="p-6 bg-white rounded-lg dark:bg-dark-secondary shadow-card">
          <div className="w-full overflow-hidden bg-gray-100 rounded-lg aspect-w-1 aspect-h-1 dark:bg-dark-primary">
            <img
              src={product.image}
              alt={product.title}
              className="object-contain object-center w-full h-96"
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="p-6 bg-white rounded-lg dark:bg-dark-secondary shadow-card">
          <h1 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
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

          <p className="mb-6 text-3xl font-bold text-primary-600 dark:text-primary-400">
            ${product.price.toFixed(2)}
          </p>

          <p className="mb-6 text-gray-600 dark:text-gray-400">
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
                className="text-gray-900 bg-white border-gray-300 rounded-lg shadow-sm dark:border-dark-primary focus:border-primary-500 focus:ring-primary-500 dark:bg-dark-primary dark:text-white"
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
              className="flex items-center justify-center w-full gap-2 px-6 py-3 text-white transition-colors duration-200 rounded-lg bg-primary-600 dark:bg-primary-500 hover:bg-primary-700 dark:hover:bg-primary-600"
            >
              <FiShoppingCart className="w-5 h-5" />
              <span>Add to Cart</span>
            </button>
          </div>

          <div className="pt-6 mt-8 border-t border-gray-200 dark:border-dark-primary">
            <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
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
          <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">You May Also Like</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredSuggestions.map((suggestedProduct) => (
              <div
                key={suggestedProduct.id}
                className="flex flex-col transition-all duration-300 bg-white rounded-lg group dark:bg-dark-secondary shadow-card hover:shadow-card-hover"
              >
                <Link to={`/products/${suggestedProduct.id}`} className="flex-grow block p-4">
                  <div className="w-full mb-4 overflow-hidden transition-colors duration-300 bg-gray-100 rounded-lg aspect-w-1 aspect-h-1 dark:bg-dark-primary group-hover:bg-gray-50 dark:group-hover:bg-dark-primary/80">
                    <img
                      src={suggestedProduct.image}
                      alt={suggestedProduct.title}
                      className="object-contain object-center w-full h-48 transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <h3 className="mb-2 text-lg font-medium text-gray-900 transition-colors duration-200 dark:text-white line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400">
                    {suggestedProduct.title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-semibold text-primary-600 dark:text-primary-400">
                      ${suggestedProduct.price.toFixed(2)}
                    </p>
                    <div className="flex items-center text-yellow-400">
                      <span>★</span>
                      <span className="ml-1 text-sm text-gray-600 dark:text-gray-400">
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