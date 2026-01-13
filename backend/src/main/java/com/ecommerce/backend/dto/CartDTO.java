package com.ecommerce.backend.dto;

import java.math.BigDecimal;
import java.util.List;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CartDTO {
  private List<CartItemDTO> items;
  private BigDecimal totalAmount;
  private String currency;

  @Data
  @Builder
  public static class CartItemDTO {
    private Long id;
    private Long productId;
    private String productName;
    private String productImageUrl;
    private BigDecimal unitPrice;
    private Integer quantity;
    private BigDecimal subTotal;
  }
}
