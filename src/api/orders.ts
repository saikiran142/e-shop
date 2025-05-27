import axios from 'axios';
import { Order } from '../types';

// Mock orders data for demonstration
const mockOrders: Order[] = [
  {
    id: 'ORD001',
    date: '2024-03-15',
    status: 'delivered',
    total: 349.98,
    items: [
      {
        id: 1,
        title: 'Premium Headphones',
        quantity: 1,
        price: 199.99,
        image: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg',
      },
      {
        id: 2,
        title: 'Wireless Speaker',
        quantity: 1,
        price: 149.99,
        image: 'https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg',
      },
    ],
  },
  {
    id: 'ORD002',
    date: '2024-03-10',
    status: 'processing',
    total: 299.99,
    items: [
      {
        id: 3,
        title: 'Smart Watch',
        quantity: 1,
        price: 299.99,
        image: 'https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_.jpg',
      },
    ],
  },
];

export const getOrders = async (): Promise<Order[]> => {
  // In a real application, this would be an API call
  // return axios.get('/api/orders').then(response => response.data);
  return Promise.resolve(mockOrders);
}; 