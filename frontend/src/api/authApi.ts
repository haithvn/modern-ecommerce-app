import axiosClient from "./axiosClient";
import { RegisterRequest, LoginRequest, LoginResponse } from "../types";

export const register = async (data: RegisterRequest) => {
  const response = await axiosClient.post("/auth/register", data);
  return response.data;
};

export const verify = async (code: string) => {
  const response = await axiosClient.post(`/auth/verify?code=${code}`);
  return response.data;
};

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await axiosClient.post("/auth/login", data);
  return response.data;
};
