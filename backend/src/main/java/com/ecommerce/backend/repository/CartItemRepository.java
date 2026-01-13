package com.ecommerce.backend.repository;

import com.ecommerce.backend.entity.CartItem;
import com.ecommerce.backend.entity.Product;
import com.ecommerce.backend.entity.User;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
  List<CartItem> findByUser(User user);

  Optional<CartItem> findByUserAndProduct(User user, Product product);

  void deleteByUser(User user);
}
