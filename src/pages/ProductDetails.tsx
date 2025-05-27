import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import type { CartItem } from '../store/slices/cartSlice';
import { ArrowLeft, ShoppingCart } from 'lucide-react';

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

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { data: product, isLoading: isLoadingProduct } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const response = await axios.get(`https://fakestoreapi.com/products/${id}`);
      return response.data as Product;
    },
  });

  const { data: suggestedProducts = [] } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await axios.get('https://fakestoreapi.com/products');
      return response.data as Product[];
    },
    enabled: !!product,
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

  if (isLoadingProduct) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-600">
          Product not found. Please try again later.
        </div>
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
        className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Products
      </Link>

      {/* Product Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Product Image */}
        <div className="bg-white rounded-lg p-8 flex items-center justify-center">
          <img
            src={product.image}
            alt={product.title}
            className="max-h-96 w-auto object-contain"
          />
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
            <div className="flex items-center space-x-4">
              <p className="text-2xl font-semibold text-primary-600">
                ${product.price.toFixed(2)}
              </p>
              <div className="flex items-center text-yellow-400">
                <span>★</span>
                <span className="text-gray-600 ml-1">{product.rating.rate}</span>
                <span className="text-gray-400 text-sm ml-1">
                  ({product.rating.count} reviews)
                </span>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Description</h2>
            <p className="text-gray-600">{product.description}</p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Category</h2>
            <span className="inline-block bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
              {product.category}
            </span>
          </div>

          <button
            onClick={() => handleAddToCart(product)}
            className="w-full md:w-auto flex items-center justify-center space-x-2 bg-primary-600 text-white py-3 px-6 rounded-lg hover:bg-primary-700 transition-colors duration-200"
          >
            <ShoppingCart className="w-5 h-5" />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>

      {/* Suggested Products */}
      {filteredSuggestions.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">You May Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredSuggestions.map((suggestedProduct) => (
              <div
                key={suggestedProduct.id}
                className="group bg-white rounded-lg shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col"
              >
                <Link to={`/products/${suggestedProduct.id}`} className="block p-4 flex-grow">
                  <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-100 mb-4 group-hover:bg-gray-50 transition-colors duration-300">
                    <img
                      src={suggestedProduct.image}
                      alt={suggestedProduct.title}
                      className="h-48 w-full object-contain object-center group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors duration-200">
                    {suggestedProduct.title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-semibold text-primary-600">
                      ${suggestedProduct.price.toFixed(2)}
                    </p>
                    <div className="flex items-center text-yellow-400">
                      <span>★</span>
                      <span className="text-gray-600 text-sm ml-1">
                        {suggestedProduct.rating.rate}
                      </span>
                    </div>
                  </div>
                </Link>
                <div className="p-4 pt-0 mt-auto">
                  <button
                    onClick={() => handleAddToCart(suggestedProduct)}
                    className="w-full bg-primary-600 text-white py-2.5 px-4 rounded-lg hover:bg-primary-700 transition-colors duration-200 flex items-center justify-center gap-2 group-hover:shadow-lg"
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