package com.ecommerce.backend.controller;

import com.ecommerce.backend.dto.CartDTO;
import com.ecommerce.backend.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

  private final CartService cartService;

  @GetMapping
  public ResponseEntity<CartDTO> getCart() {
    return ResponseEntity.ok(cartService.getCart());
  }

  @PostMapping("/add")
  public ResponseEntity<Void> addToCart(
      @RequestParam Long productId, @RequestParam Integer quantity) {
    cartService.addToCart(productId, quantity);
    return ResponseEntity.ok().build();
  }

  @DeleteMapping("/{cartItemId}")
  public ResponseEntity<Void> removeFromCart(@PathVariable Long cartItemId) {
    cartService.removeFromCart(cartItemId);
    return ResponseEntity.ok().build();
  }

  @PutMapping("/{cartItemId}")
  public ResponseEntity<Void> updateQuantity(
      @PathVariable Long cartItemId, @RequestParam Integer quantity) {
    cartService.updateQuantity(cartItemId, quantity);
    return ResponseEntity.ok().build();
  }

  @DeleteMapping("/clear")
  public ResponseEntity<Void> clearCart() {
    cartService.clearCart();
    return ResponseEntity.ok().build();
  }
}
