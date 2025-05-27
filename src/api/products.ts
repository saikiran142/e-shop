import axios from 'axios';
import { Product } from '../types';

export const getProducts = async (): Promise<Product[]> => {
  const response = await axios.get('https://fakestoreapi.com/products');
  return response.data;
};

export const getProduct = async (id: number): Promise<Product> => {
  const response = await axios.get(`https://fakestoreapi.com/products/${id}`);
  return response.data;
}; 