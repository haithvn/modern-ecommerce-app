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

export interface CartItemDTO {
  id: number;
  productId: number;
  productName: string;
  productImageUrl: string;
  unitPrice: number;
  quantity: number;
  subTotal: number;
}

export interface CartDTO {
  items: CartItemDTO[];
  totalAmount: number;
  currency: string;
}

export interface OrderRequest {
  shippingName: string;
  shippingPhone: string;
  shippingAddress: string;
  paymentMethod: string;
}

export interface OrderResponse {
  id: number;
  status: string;
  totalAmount: number;
}
