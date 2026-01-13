import axiosClient from "./axiosClient";
import { CartDTO } from "../types";

export const getCart = async (): Promise<CartDTO> => {
  const response = await axiosClient.get("/cart");
  return response.data;
};

export const addToCart = async (productId: number, quantity: number) => {
  const response = await axiosClient.post(
    `/cart/add?productId=${productId}&quantity=${quantity}`,
  );
  return response.data;
};

export const removeFromCart = async (cartItemId: number) => {
  const response = await axiosClient.delete(`/cart/${cartItemId}`);
  return response.data;
};

export const updateCartQuantity = async (
  cartItemId: number,
  quantity: number,
) => {
  const response = await axiosClient.put(
    `/cart/${cartItemId}?quantity=${quantity}`,
  );
  return response.data;
};

export const clearCart = async () => {
  const response = await axiosClient.delete("/cart/clear");
  return response.data;
};
