package com.ecommerce.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing // Kích hoạt tính năng tự động cập nhật createdDate/updatedDate
public class BackendApplication {
  // Trigger hook
  public static void main(String[] args) {
    SpringApplication.run(BackendApplication.class, args);
  }
}
