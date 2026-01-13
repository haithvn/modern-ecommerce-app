import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { CartDTO } from "../types";
import * as cartApi from "../api/cartApi";

interface CartContextType {
  cart: CartDTO | null;
  itemCount: number;
  loading: boolean;
  addToCart: (productId: number, quantity: number) => Promise<void>;
  removeFromCart: (cartItemId: number) => Promise<void>;
  updateCartQuantity: (cartItemId: number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  fetchCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [cart, setCart] = useState<CartDTO | null>(null);
  const [itemCount, setItemCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  const fetchCart = useCallback(async () => {
    if (!token) {
      setCart(null);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const cartData = await cartApi.getCart();
      setCart(cartData);
    } catch (error) {
      console.error("Failed to fetch cart", error);
      setCart(null);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  useEffect(() => {
    if (cart) {
      const count = cart.items.reduce((sum, item) => sum + item.quantity, 0);
      setItemCount(count);
    } else {
      setItemCount(0);
    }
  }, [cart]);

  const addToCart = async (productId: number, quantity: number) => {
    await cartApi.addToCart(productId, quantity);
    await fetchCart();
  };

  const removeFromCart = async (cartItemId: number) => {
    await cartApi.removeFromCart(cartItemId);
    await fetchCart();
  };

  const updateCartQuantity = async (cartItemId: number, quantity: number) => {
    await cartApi.updateCartQuantity(cartItemId, quantity);
    await fetchCart();
  };

  const clearCart = async () => {
    await cartApi.clearCart();
    await fetchCart();
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        itemCount,
        loading,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
