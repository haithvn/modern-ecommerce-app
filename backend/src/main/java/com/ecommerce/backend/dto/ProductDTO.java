package com.ecommerce.backend.dto;

import lombok.Data;
import java.math.BigDecimal;

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
