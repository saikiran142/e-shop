import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const Confirmation = () => {
  return (
    <div className="container px-4 py-16 mx-auto">
      <div className="max-w-2xl mx-auto text-center">
        <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h1 className="mb-4 text-3xl font-bold">Order Confirmed!</h1>
        <p className="mb-8 text-gray-600">
          Thank you for your purchase. Your order has been received and is being processed.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Link
            to="/orders"
            className="px-6 py-3 text-white transition-colors duration-200 rounded-lg bg-primary-600 hover:bg-primary-700"
          >
            View Orders
          </Link>
          <Link
            to="/"
            className="px-6 py-3 text-primary-600 transition-colors duration-200 border border-primary-600 rounded-lg hover:bg-primary-50"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Confirmation; 