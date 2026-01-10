package com.ecommerce.backend.dto;

import java.math.BigDecimal;
import lombok.Data;

@Data
public class ProductDTO {
  private Long id;
  private String name;
  private String description;
  private BigDecimal price;
  private String currency;
  private String imageUrl;
  private Long categoryId;
  private String categoryName;
}
