export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  currency: string;
  imageUrl: string;
  categoryId: number;
  categoryName: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword?: string;
  address?: string;
  birthDate?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  email: string;
}
