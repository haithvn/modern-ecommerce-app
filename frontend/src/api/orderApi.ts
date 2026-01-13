import axiosClient from "./axiosClient";
import { OrderRequest, OrderResponse } from "../types";

export const placeOrder = async (
  data: OrderRequest,
): Promise<OrderResponse> => {
  const response = await axiosClient.post("/orders", data);
  return response.data;
};
