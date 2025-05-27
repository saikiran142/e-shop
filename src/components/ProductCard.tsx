import { Link } from 'react-router-dom';
import { FiShoppingCart } from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(addToCart({ ...product, quantity: 1 }));
  };

  return (
    <div className="group bg-white dark:bg-dark-secondary rounded-lg border border-gray-200 dark:border-dark-primary shadow-sm hover:shadow-md transition-all duration-300 flex flex-col">
      <Link to={`/products/${product.id}`} className="block p-4 flex-grow">
        <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-100 dark:bg-dark-primary mb-4 group-hover:bg-gray-50 dark:group-hover:bg-dark-accent transition-colors duration-300">
          <img
            src={product.image}
            alt={product.title}
            className="h-48 w-full object-contain object-center group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200">
          {product.title}
        </h3>
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold text-primary-600 dark:text-primary-400">
            ${product.price.toFixed(2)}
          </p>
          <div className="flex items-center text-yellow-400">
            <span>★</span>
            <span className="text-gray-600 dark:text-gray-400 text-sm ml-1">{product.rating.rate}</span>
          </div>
        </div>
      </Link>
      <div className="p-4 pt-0 mt-auto">
        <button
          onClick={handleAddToCart}
          className="w-full bg-primary-600 dark:bg-primary-500 text-white py-2 px-3 rounded-lg hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors duration-200 flex items-center justify-center gap-2 text-sm font-medium"
        >
          <FiShoppingCart className="w-4 h-4" />
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  );
};

export default ProductCard; 