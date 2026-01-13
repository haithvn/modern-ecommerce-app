package com.ecommerce.backend.service;

public interface EmailService {
  void sendVerificationEmail(String to, String code);

  void sendOrderConfirmation(String to, Long orderId);
}
