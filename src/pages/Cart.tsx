import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { removeFromCart, updateQuantity, selectCartItems, selectCartTotal } from '../store/slices/cartSlice';

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
      <div className="min-h-screen py-12 bg-gray-50 dark:bg-dark-primary">
        <div className="container px-4 mx-auto">
          <div className="max-w-md mx-auto text-center">
            <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 rounded-full bg-primary-100 dark:bg-primary-900/20">
              <ShoppingBag className="w-10 h-10 text-primary-600 dark:text-primary-400" />
            </div>
            <h1 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">Your cart is empty</h1>
            <p className="mb-8 text-gray-600 dark:text-gray-400">
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
    <div className="min-h-screen py-12 bg-gray-50 dark:bg-dark-primary">
      <div className="container px-4 mx-auto">
        <h1 className="mb-8 text-4xl font-bold text-center text-gray-900 dark:text-white">Shopping Cart</h1>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {cartItems.map((item) => (
              <div key={item.id} className="mb-4 bg-white card dark:bg-dark-secondary">
                <div className="p-6">
                  <div className="flex flex-col items-center gap-6 md:flex-row">
                    <div className="relative w-24 h-24 overflow-hidden rounded-lg">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="flex-grow">
                      <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">{item.title}</h3>
                      <p className="text-lg font-bold text-primary-600 dark:text-primary-400">${item.price}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center border border-gray-200 rounded-lg dark:border-dark-primary">
                        <button
                          onClick={() => handleQuantityChange(item.id, -1)}
                          className="p-2 text-gray-600 transition-colors rounded-l-lg hover:bg-gray-100 dark:hover:bg-dark-accent dark:text-gray-300"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-4 py-2 text-gray-900 border-gray-200 border-x dark:border-dark-primary dark:text-white">{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item.id, 1)}
                          className="p-2 text-gray-600 transition-colors rounded-r-lg hover:bg-gray-100 dark:hover:bg-dark-accent dark:text-gray-300"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <button
                        onClick={() => dispatch(removeFromCart(item.id))}
                        className="p-2 text-red-500 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
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
            <div className="sticky bg-white card top-8 dark:bg-dark-secondary">
              <div className="p-6">
                <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">Order Summary</h2>
                <div className="space-y-4">
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Subtotal</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="pt-4 border-t border-gray-200 dark:border-dark-primary">
                    <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                  <button
                    onClick={handleCheckout}
                    className="w-full mt-6 btn btn-primary"
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