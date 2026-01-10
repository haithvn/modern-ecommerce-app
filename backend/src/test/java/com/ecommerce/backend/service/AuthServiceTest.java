package com.ecommerce.backend.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import com.ecommerce.backend.dto.RegisterRequest;
import com.ecommerce.backend.entity.User;
import com.ecommerce.backend.repository.UserRepository;
import java.time.LocalDate;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

  @Mock private UserRepository userRepository;
  @Mock private PasswordEncoder passwordEncoder;
  @Mock private EmailService emailService;

  @InjectMocks private AuthService authService;

  private RegisterRequest registerRequest;

  @BeforeEach
  void setUp() {
    registerRequest = new RegisterRequest();
    registerRequest.setEmail("test@example.com");
    registerRequest.setPassword("password");
    registerRequest.setAddress("123 Street");
    registerRequest.setBirthDate(LocalDate.of(1990, 1, 1));
  }

  @Test
  void register_ShouldSaveUserAndSendEmail_WhenEmailIsUnique() {
    // Arrange
    when(userRepository.findByEmail(registerRequest.getEmail())).thenReturn(Optional.empty());
    when(passwordEncoder.encode(any())).thenReturn("encodedPass");

    // Act
    authService.register(registerRequest);

    // Assert
    verify(userRepository, times(1)).save(any(User.class));
    verify(emailService, times(1)).sendVerificationEmail(eq("test@example.com"), anyString());
  }

  @Test
  void register_ShouldThrowException_WhenEmailExists() {
    // Arrange
    when(userRepository.findByEmail(registerRequest.getEmail()))
        .thenReturn(Optional.of(new User()));

    // Act & Assert
    assertThrows(RuntimeException.class, () -> authService.register(registerRequest));
    verify(userRepository, never()).save(any());
  }
}
