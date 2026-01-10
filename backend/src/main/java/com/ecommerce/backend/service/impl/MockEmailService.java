package com.ecommerce.backend.service.impl;

import com.ecommerce.backend.service.EmailService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class MockEmailService implements EmailService {

  @Override
  public void sendVerificationEmail(String to, String code) {
    System.out.println("MOCK EMAIL TO: " + to);
    System.out.println("VERIFICATION CODE: " + code);
    System.out.println("VERIFICATION LINK: http://localhost:8080/api/auth/verify?code=" + code);
  }
}
