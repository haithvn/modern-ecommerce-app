package com.ecommerce.backend.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.ecommerce.backend.dto.CartDTO;
import com.ecommerce.backend.entity.CartItem;
import com.ecommerce.backend.entity.Product;
import com.ecommerce.backend.entity.User;
import com.ecommerce.backend.repository.CartItemRepository;
import com.ecommerce.backend.repository.ProductRepository;
import com.ecommerce.backend.repository.UserRepository;
import com.ecommerce.backend.service.impl.CartServiceImpl;
import java.math.BigDecimal;
import java.util.Collections;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

@ExtendWith(MockitoExtension.class)
class CartServiceTest {

  @Mock private CartItemRepository cartItemRepository;
  @Mock private ProductRepository productRepository;
  @Mock private UserRepository userRepository;
  @Mock private SecurityContext securityContext;
  @Mock private Authentication authentication;

  @InjectMocks private CartServiceImpl cartService;

  private User user;
  private Product product;

  @BeforeEach
  void setUp() {
    user = new User();
    user.setEmail("test@example.com");

    product = new Product();
    product.setId(1L);
    product.setName("Product 1");
    product.setPrice(new BigDecimal("100"));
    product.setCurrency("USD");

    SecurityContextHolder.setContext(securityContext);
    when(securityContext.getAuthentication()).thenReturn(authentication);
    when(authentication.getName()).thenReturn("test@example.com");
    when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));
  }

  @Test
  void getCart_ShouldReturnCartDTO() {
    CartItem cartItem = new CartItem();
    cartItem.setId(1L);
    cartItem.setUser(user);
    cartItem.setProduct(product);
    cartItem.setQuantity(2);

    when(cartItemRepository.findByUser(user)).thenReturn(Collections.singletonList(cartItem));

    CartDTO cartDTO = cartService.getCart();

    assertEquals(1, cartDTO.getItems().size());
    assertEquals(new BigDecimal("200"), cartDTO.getTotalAmount());
    assertEquals("Product 1", cartDTO.getItems().get(0).getProductName());
  }

  @Test
  void addToCart_ShouldAddNewItem_WhenProductNotInCart() {
    when(productRepository.findById(1L)).thenReturn(Optional.of(product));
    when(cartItemRepository.findByUserAndProduct(user, product)).thenReturn(Optional.empty());

    cartService.addToCart(1L, 2);

    verify(cartItemRepository, times(1)).save(any(CartItem.class));
  }
}
