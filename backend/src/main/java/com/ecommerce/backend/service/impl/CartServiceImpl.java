package com.ecommerce.backend.service.impl;

import com.ecommerce.backend.dto.CartDTO;
import com.ecommerce.backend.entity.CartItem;
import com.ecommerce.backend.entity.Product;
import com.ecommerce.backend.entity.User;
import com.ecommerce.backend.repository.CartItemRepository;
import com.ecommerce.backend.repository.ProductRepository;
import com.ecommerce.backend.repository.UserRepository;
import com.ecommerce.backend.service.CartService;
import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

  private final CartItemRepository cartItemRepository;
  private final ProductRepository productRepository;
  private final UserRepository userRepository;

  private User getCurrentUser() {
    String email = SecurityContextHolder.getContext().getAuthentication().getName();
    return userRepository
        .findByEmail(email)
        .orElseThrow(() -> new UsernameNotFoundException("User not found"));
  }

  @Override
  public CartDTO getCart() {
    User user = getCurrentUser();
    List<CartItem> items = cartItemRepository.findByUser(user);

    List<CartDTO.CartItemDTO> itemDTOs =
        items.stream()
            .map(
                item -> {
                  BigDecimal subTotal =
                      item.getProduct().getPrice().multiply(new BigDecimal(item.getQuantity()));
                  return CartDTO.CartItemDTO.builder()
                      .id(item.getId())
                      .productId(item.getProduct().getId())
                      .productName(item.getProduct().getName())
                      .productImageUrl(item.getProduct().getImageUrl())
                      .unitPrice(item.getProduct().getPrice())
                      .quantity(item.getQuantity())
                      .subTotal(subTotal)
                      .build();
                })
            .collect(Collectors.toList());

    BigDecimal totalAmount =
        itemDTOs.stream()
            .map(CartDTO.CartItemDTO::getSubTotal)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

    String currency = items.isEmpty() ? "USD" : items.get(0).getProduct().getCurrency();

    return CartDTO.builder().items(itemDTOs).totalAmount(totalAmount).currency(currency).build();
  }

  @Override
  @Transactional
  public void addToCart(Long productId, Integer quantity) {
    User user = getCurrentUser();
    Product product =
        productRepository
            .findById(productId)
            .orElseThrow(() -> new RuntimeException("Product not found"));

    CartItem cartItem =
        cartItemRepository
            .findByUserAndProduct(user, product)
            .map(
                item -> {
                  item.setQuantity(item.getQuantity() + quantity);
                  return item;
                })
            .orElseGet(
                () -> {
                  CartItem newItem = new CartItem();
                  newItem.setUser(user);
                  newItem.setProduct(product);
                  newItem.setQuantity(quantity);
                  return newItem;
                });

    cartItemRepository.save(cartItem);
  }

  @Override
  @Transactional
  public void removeFromCart(Long cartItemId) {
    CartItem cartItem =
        cartItemRepository
            .findById(cartItemId)
            .orElseThrow(() -> new RuntimeException("Cart item not found"));

    // Security check: ensure item belongs to current user
    if (!cartItem.getUser().equals(getCurrentUser())) {
      throw new RuntimeException("Unauthorized to remove this item");
    }

    cartItemRepository.delete(cartItem);
  }

  @Override
  @Transactional
  public void updateQuantity(Long cartItemId, Integer quantity) {
    CartItem cartItem =
        cartItemRepository
            .findById(cartItemId)
            .orElseThrow(() -> new RuntimeException("Cart item not found"));

    if (!cartItem.getUser().equals(getCurrentUser())) {
      throw new RuntimeException("Unauthorized to update this item");
    }

    if (quantity <= 0) {
      cartItemRepository.delete(cartItem);
    } else {
      cartItem.setQuantity(quantity);
      cartItemRepository.save(cartItem);
    }
  }

  @Override
  @Transactional
  public void clearCart() {
    User user = getCurrentUser();
    cartItemRepository.deleteByUser(user);
  }
}
