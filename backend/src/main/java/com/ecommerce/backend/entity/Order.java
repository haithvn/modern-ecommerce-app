package com.ecommerce.backend.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

@Data
@Entity
@Table(name = "orders")
public class Order {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne
  @JoinColumn(name = "user_id", nullable = false)
  private User user;

  @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<OrderItem> items = new ArrayList<>();

  @Column(nullable = false)
  private BigDecimal totalAmount;

  @Column(nullable = false)
  private String status; // PENDING, PAID, SHIPPED, CANCELLED

  @Column(nullable = false)
  private String paymentMethod;

  private String shippingName;
  private String shippingPhone;
  private String shippingAddress;

  @CreationTimestamp private LocalDateTime createdAt;
}
