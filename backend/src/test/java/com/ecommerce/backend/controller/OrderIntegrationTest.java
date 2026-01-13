package com.ecommerce.backend.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.ecommerce.backend.dto.OrderRequest;
import com.ecommerce.backend.entity.CartItem;
import com.ecommerce.backend.entity.Catalog;
import com.ecommerce.backend.entity.Category;
import com.ecommerce.backend.entity.Product;
import com.ecommerce.backend.entity.User;
import com.ecommerce.backend.repository.CartItemRepository;
import com.ecommerce.backend.repository.CatalogRepository;
import com.ecommerce.backend.repository.CategoryRepository;
import com.ecommerce.backend.repository.ProductRepository;
import com.ecommerce.backend.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.math.BigDecimal;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
class OrderIntegrationTest {

  @Autowired private MockMvc mockMvc;

  @Autowired private ObjectMapper objectMapper;

  @Autowired private UserRepository userRepository;
  @Autowired private ProductRepository productRepository;
  @Autowired private CartItemRepository cartItemRepository;
  @Autowired private CategoryRepository categoryRepository;
  @Autowired private CatalogRepository catalogRepository;
  @Autowired private PasswordEncoder passwordEncoder;

  @BeforeEach
  void setUp() {
    cartItemRepository.deleteAll();
    productRepository.deleteAll();
    categoryRepository.deleteAll();
    catalogRepository.deleteAll();
    userRepository.deleteAll();

    User user = new User();
    user.setEmail("test@example.com");
    user.setPassword(passwordEncoder.encode("password"));
    userRepository.save(user);

    Catalog catalog = new Catalog();
    catalog.setName("Test Catalog");
    catalogRepository.save(catalog);

    Category category = new Category();
    category.setName("Test Category");
    category.setCatalog(catalog);
    categoryRepository.save(category);

    Product product = new Product();
    product.setName("Test Product");
    product.setPrice(new BigDecimal("100.00"));
    product.setDescription("Description");
    product.setImageUrl("http://img.com");
    product.setCategory(category);
    product.setCurrency("USD");
    productRepository.save(product);

    CartItem cartItem = new CartItem();
    cartItem.setUser(user);
    cartItem.setProduct(product);
    cartItem.setQuantity(2);
    cartItemRepository.save(cartItem);
  }

  @Test
  @WithMockUser(username = "test@example.com")
  void placeOrder_ShouldReturnOk_WhenRequestIsValid() throws Exception {
    OrderRequest request =
        OrderRequest.builder()
            .shippingName("John Doe")
            .shippingAddress("123 St")
            .shippingPhone("123456789")
            .paymentMethod("COD")
            .build();

    mockMvc
        .perform(
            post("/api/orders")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
        .andExpect(status().isOk());
  }
}
