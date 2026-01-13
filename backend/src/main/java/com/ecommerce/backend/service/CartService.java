package com.ecommerce.backend.service;

import com.ecommerce.backend.dto.CartDTO;

public interface CartService {
  CartDTO getCart();

  void addToCart(Long productId, Integer quantity);

  void removeFromCart(Long cartItemId);

  void updateQuantity(Long cartItemId, Integer quantity);

  void clearCart();
}
