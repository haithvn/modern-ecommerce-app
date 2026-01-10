package com.ecommerce.backend.dto;

import java.time.LocalDate;
import lombok.Data;

@Data
public class RegisterRequest {
  private String email;
  private String password;
  private String address;
  private LocalDate birthDate;
}
