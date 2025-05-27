import { useQuery } from '@tanstack/react-query';

interface Order {
  id: string;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  total: number;
  items: {
    id: number;
    name: string;
    quantity: number;
    price: number;
  }[];
}

// Mock orders data
const mockOrders: Order[] = [
  {
    id: 'ORD001',
    date: '2024-03-15',
    status: 'delivered',
    total: 349.98,
    items: [
      {
        id: 1,
        name: 'Premium Headphones',
        quantity: 1,
        price: 199.99,
      },
      {
        id: 2,
        name: 'Wireless Speaker',
        quantity: 1,
        price: 149.99,
      },
    ],
  },
  {
    id: 'ORD002',
    date: '2024-03-10',
    status: 'shipped',
    total: 299.99,
    items: [
      {
        id: 3,
        name: 'Smart Watch',
        quantity: 1,
        price: 299.99,
      },
    ],
  },
];

const getStatusColor = (status: Order['status']) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'processing':
      return 'bg-blue-100 text-blue-800';
    case 'shipped':
      return 'bg-primary-100 text-primary-800';
    case 'delivered':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const Orders = () => {
  const { data: orders = mockOrders, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: () => Promise.resolve(mockOrders),
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-gray-600">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Order History</h1>
      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-lg shadow-card p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <h2 className="text-xl font-semibold">Order #{order.id}</h2>
                <p className="text-gray-600">
                  Placed on {new Date(order.date).toLocaleDateString()}
                </p>
              </div>
              <div className="sm:text-right">
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-2 ${getStatusColor(order.status)}`}>
                  {order.status.toUpperCase()}
                </span>
                <p className="text-xl font-semibold">
                  Total: ${order.total.toFixed(2)}
                </p>
              </div>
            </div>
            <div className="border-t border-gray-200 my-4"></div>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-600">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                  <p className="font-medium">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders; 