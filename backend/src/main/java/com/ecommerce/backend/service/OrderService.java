package com.ecommerce.backend.service;

import com.ecommerce.backend.dto.OrderRequest;
import com.ecommerce.backend.dto.OrderResponse;

public interface OrderService {
  OrderResponse placeOrder(OrderRequest request);
}
