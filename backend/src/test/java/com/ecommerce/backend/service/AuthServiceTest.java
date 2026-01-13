package com.ecommerce.backend.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import com.ecommerce.backend.config.security.JwtUtil;
import com.ecommerce.backend.dto.LoginRequest;
import com.ecommerce.backend.dto.LoginResponse;
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
  @Mock private JwtUtil jwtUtil;

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

  @Test
  void verify_ShouldActivateUser_WhenCodeIsValid() {
    // Arrange
    String code = "validCode";
    User user = new User();
    user.setVerificationCode(code);
    user.setActive(false);

    when(userRepository.findByVerificationCode(code)).thenReturn(Optional.of(user));

    // Act
    authService.verify(code);

    // Assert
    assertTrue(user.isActive());
    assertNull(user.getVerificationCode());
    verify(userRepository, times(1)).save(user);
  }

  @Test
  void verify_ShouldThrowException_WhenCodeIsInvalid() {
    // Arrange
    String code = "invalidCode";
    when(userRepository.findByVerificationCode(code)).thenReturn(Optional.empty());

    // Act & Assert
    assertThrows(RuntimeException.class, () -> authService.verify(code));
  }

  @Test
  void login_ShouldReturnToken_WhenCredentialsAreValid() {
    // Arrange
    LoginRequest loginRequest = new LoginRequest();
    loginRequest.setEmail("test@example.com");
    loginRequest.setPassword("password");

    User user = new User();
    user.setEmail("test@example.com");
    user.setPassword("encodedPass");
    user.setActive(true);

    when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));
    when(passwordEncoder.matches("password", "encodedPass")).thenReturn(true);
    when(jwtUtil.generateToken("test@example.com")).thenReturn("mockToken");

    // Act
    LoginResponse response = authService.login(loginRequest);

    // Assert
    assertEquals("mockToken", response.getToken());
    assertEquals("test@example.com", response.getEmail());
  }

  @Test
  void login_ShouldThrowException_WhenUserNotFound() {
    // Arrange
    LoginRequest loginRequest = new LoginRequest();
    loginRequest.setEmail("notfound@example.com");
    loginRequest.setPassword("password");

    when(userRepository.findByEmail("notfound@example.com")).thenReturn(Optional.empty());

    // Act & Assert
    assertThrows(RuntimeException.class, () -> authService.login(loginRequest));
  }

  @Test
  void login_ShouldThrowException_WhenUserNotActive() {
    // Arrange
    LoginRequest loginRequest = new LoginRequest();
    loginRequest.setEmail("inactive@example.com");
    loginRequest.setPassword("password");

    User user = new User();
    user.setEmail("inactive@example.com");
    user.setActive(false);

    when(userRepository.findByEmail("inactive@example.com")).thenReturn(Optional.of(user));

    // Act & Assert
    assertThrows(RuntimeException.class, () -> authService.login(loginRequest));
  }

  @Test
  void login_ShouldThrowException_WhenPasswordIsIncorrect() {
    // Arrange
    LoginRequest loginRequest = new LoginRequest();
    loginRequest.setEmail("test@example.com");
    loginRequest.setPassword("wrongpassword");

    User user = new User();
    user.setEmail("test@example.com");
    user.setPassword("encodedPass");
    user.setActive(true);

    when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));
    when(passwordEncoder.matches("wrongpassword", "encodedPass")).thenReturn(false);

    // Act & Assert
    assertThrows(RuntimeException.class, () -> authService.login(loginRequest));
  }
}
