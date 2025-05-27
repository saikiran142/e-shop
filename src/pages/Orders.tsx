import { useQuery } from '@tanstack/react-query';
import { getOrders } from '../api/orders';
import { format } from 'date-fns';

const Orders = () => {
  const { data: orders, isLoading, error } = useQuery({
    queryKey: ['orders'],
    queryFn: getOrders,
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
        <h2 className="text-2xl font-semibold text-red-600 dark:text-red-400">Error loading orders</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Please try again later</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Your Orders</h1>

      <div className="space-y-6">
        {orders?.map((order) => (
          <div
            key={order.id}
            className="bg-white dark:bg-dark-secondary rounded-lg shadow-card p-6"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Order #{order.id}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Placed on {format(new Date(order.date), 'MMMM d, yyyy')}
                </p>
              </div>
              <div className="mt-2 md:mt-0">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  order.status === 'delivered'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                    : order.status === 'processing'
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                    : 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                }`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-dark-primary pt-4">
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-16 h-16 object-contain bg-gray-100 dark:bg-dark-primary rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        ${item.price.toFixed(2)} each
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-dark-primary">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Items</p>
                    <p className="text-lg font-medium text-gray-900 dark:text-white">
                      {order.items.reduce((total, item) => total + item.quantity, 0)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Amount</p>
                    <p className="text-lg font-medium text-primary-600 dark:text-primary-400">
                      ${order.total.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {orders?.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">No orders found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders; 