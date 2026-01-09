import axiosClient from './axiosClient';
import { Product } from '../types';

export const productApi = {
  getAll: async (): Promise<Product[]> => {
    const response = await axiosClient.get<Product[]>('/products');
    return response.data;
  },
};
