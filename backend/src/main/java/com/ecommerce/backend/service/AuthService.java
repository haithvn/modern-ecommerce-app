package com.ecommerce.backend.service;

import com.ecommerce.backend.dto.RegisterRequest;
import com.ecommerce.backend.entity.User;
import com.ecommerce.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final EmailService emailService;

  public void register(RegisterRequest request) {
    if (userRepository.findByEmail(request.getEmail()).isPresent()) {
      throw new RuntimeException("Email already exists");
    }

    User user = new User();
    user.setEmail(request.getEmail());
    user.setPassword(passwordEncoder.encode(request.getPassword()));
    user.setAddress(request.getAddress());
    user.setBirthDate(request.getBirthDate());
    user.setActive(false);
    user.setVerificationCode(java.util.UUID.randomUUID().toString());

    userRepository.save(user);

    emailService.sendVerificationEmail(user.getEmail(), user.getVerificationCode());
  }

  public void verify(String code) {
    User user =
        userRepository
            .findByVerificationCode(code)
            .orElseThrow(() -> new RuntimeException("Invalid verification code"));

    user.setActive(true);
    user.setVerificationCode(null);
    userRepository.save(user);
  }
}
