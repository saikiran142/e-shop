import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { removeFromCart, updateQuantity, selectCartItems, selectCartTotal } from '../store/slices/cartSlice';
import type { RootState } from '../store/store';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);

  const handleQuantityChange = (itemId: number, change: number) => {
    const item = cartItems.find((i) => i.id === itemId);
    if (item) {
      const newQuantity = Math.max(1, item.quantity + change);
      dispatch(updateQuantity({ id: itemId, quantity: newQuantity }));
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-primary py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto text-center">
            <div className="w-20 h-20 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-10 h-10 text-primary-600 dark:text-primary-400" />
            </div>
            <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Your cart is empty</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Looks like you haven't added any products to your cart yet.
            </p>
            <button
              onClick={() => navigate('/products')}
              className="btn btn-primary"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-primary py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-900 dark:text-white">Shopping Cart</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {cartItems.map((item) => (
              <div key={item.id} className="card mb-4 bg-white dark:bg-dark-secondary">
                <div className="p-6">
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{item.title}</h3>
                      <p className="text-primary-600 dark:text-primary-400 font-bold text-lg">${item.price}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center border border-gray-200 dark:border-dark-primary rounded-lg">
                        <button
                          onClick={() => handleQuantityChange(item.id, -1)}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-dark-accent rounded-l-lg transition-colors text-gray-600 dark:text-gray-300"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-4 py-2 border-x border-gray-200 dark:border-dark-primary text-gray-900 dark:text-white">{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item.id, 1)}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-dark-accent rounded-r-lg transition-colors text-gray-600 dark:text-gray-300"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <button
                        onClick={() => dispatch(removeFromCart(item.id))}
                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div>
            <div className="card sticky top-8 bg-white dark:bg-dark-secondary">
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Order Summary</h2>
                <div className="space-y-4">
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Subtotal</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="border-t border-gray-200 dark:border-dark-primary pt-4">
                    <div className="flex justify-between font-bold text-lg text-gray-900 dark:text-white">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                  <button
                    onClick={handleCheckout}
                    className="btn btn-primary w-full mt-6"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart; 