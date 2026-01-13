package com.ecommerce.backend.service.impl;

import com.ecommerce.backend.dto.OrderRequest;
import com.ecommerce.backend.dto.OrderResponse;
import com.ecommerce.backend.entity.CartItem;
import com.ecommerce.backend.entity.Order;
import com.ecommerce.backend.entity.OrderItem;
import com.ecommerce.backend.entity.User;
import com.ecommerce.backend.repository.CartItemRepository;
import com.ecommerce.backend.repository.OrderRepository;
import com.ecommerce.backend.repository.UserRepository;
import com.ecommerce.backend.service.EmailService;
import com.ecommerce.backend.service.OrderService;
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
public class OrderServiceImpl implements OrderService {

  private final OrderRepository orderRepository;
  private final CartItemRepository cartItemRepository;
  private final UserRepository userRepository;
  private final EmailService emailService;

  @Override
  @Transactional
  public OrderResponse placeOrder(OrderRequest request) {
    String email = SecurityContextHolder.getContext().getAuthentication().getName();
    User user =
        userRepository
            .findByEmail(email)
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));

    List<CartItem> cartItems = cartItemRepository.findByUser(user);
    if (cartItems.isEmpty()) {
      throw new RuntimeException("Cart is empty");
    }

    Order order = new Order();
    order.setUser(user);
    order.setStatus("PENDING");
    order.setPaymentMethod(request.getPaymentMethod());
    order.setShippingName(request.getShippingName());
    order.setShippingPhone(request.getShippingPhone());
    order.setShippingAddress(request.getShippingAddress());

    List<OrderItem> orderItems =
        cartItems.stream()
            .map(
                cartItem -> {
                  OrderItem orderItem = new OrderItem();
                  orderItem.setOrder(order);
                  orderItem.setProduct(cartItem.getProduct());
                  orderItem.setQuantity(cartItem.getQuantity());
                  orderItem.setPrice(cartItem.getProduct().getPrice());
                  return orderItem;
                })
            .collect(Collectors.toList());

    order.setItems(orderItems);

    BigDecimal totalAmount =
        orderItems.stream()
            .map(item -> item.getPrice().multiply(new BigDecimal(item.getQuantity())))
            .reduce(BigDecimal.ZERO, BigDecimal::add);

    order.setTotalAmount(totalAmount);

    Order savedOrder = orderRepository.save(order);

    cartItemRepository.deleteAll(cartItems);

    emailService.sendOrderConfirmation(user.getEmail(), savedOrder.getId());

    return OrderResponse.builder()
        .id(savedOrder.getId())
        .status(savedOrder.getStatus())
        .totalAmount(savedOrder.getTotalAmount())
        .build();
  }
}
