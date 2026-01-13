package com.ecommerce.backend.dto;

import java.math.BigDecimal;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class OrderResponse {
  private Long id;
  private String status;
  private BigDecimal totalAmount;
}
