package com.ecommerce.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OrderRequest {
  private String shippingName;
  private String shippingPhone;
  private String shippingAddress;
  private String paymentMethod; // "COD", "BANK_TRANSFER", etc.
}
