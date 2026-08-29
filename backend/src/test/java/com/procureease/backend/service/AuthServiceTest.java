package com.procureease.backend.service;

import com.procureease.backend.dto.LoginRequest;
import com.procureease.backend.dto.LoginResponse;
import com.procureease.backend.dto.RegisterRequest;
import com.procureease.backend.entity.User;
import com.procureease.backend.exception.ResourceAlreadyExistsException;
import com.procureease.backend.exception.ResourceNotFoundException;
import com.procureease.backend.repository.UserRepository;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @InjectMocks
    private AuthService authService;


    // ============================================================
    // 1. Register User Successfully
    // ============================================================

    @Test
    void register_ShouldRegisterUserSuccessfully() {

        // Arrange
        RegisterRequest request = new RegisterRequest();
        request.setFullName("Test User");
        request.setEmail("test@example.com");
        request.setPassword("password123");

        when(userRepository.findByEmail(request.getEmail()))
                .thenReturn(Optional.empty());

        when(passwordEncoder.encode(request.getPassword()))
                .thenReturn("encodedPassword");

        // Act
        String result = authService.register(request);

        // Assert
        assertEquals("User Registered Successfully", result);

        verify(userRepository)
                .findByEmail(request.getEmail());

        verify(passwordEncoder)
                .encode(request.getPassword());

        verify(userRepository)
                .save(any(User.class));
    }


    // ============================================================
    // 2. Register Should Fail If Email Already Exists
    // ============================================================

    @Test
    void register_ShouldThrowException_WhenEmailAlreadyExists() {

        // Arrange
        RegisterRequest request = new RegisterRequest();
        request.setFullName("Test User");
        request.setEmail("test@example.com");
        request.setPassword("password123");

        User existingUser = User.builder()
                .id(1)
                .fullName("Existing User")
                .email("test@example.com")
                .password("encodedPassword")
                .build();

        when(userRepository.findByEmail(request.getEmail()))
                .thenReturn(Optional.of(existingUser));

        // Act + Assert
        ResourceAlreadyExistsException exception =
                assertThrows(
                        ResourceAlreadyExistsException.class,
                        () -> authService.register(request)
                );

        assertEquals(
                "Email already registered",
                exception.getMessage()
        );

        verify(userRepository)
                .findByEmail(request.getEmail());

        verify(userRepository, never())
                .save(any(User.class));

        verify(passwordEncoder, never())
                .encode(anyString());
    }


    // ============================================================
    // 3. Login Successfully
    // ============================================================

    @Test
    void login_ShouldReturnLoginResponse_WhenCredentialsAreValid() {

        // Arrange
        LoginRequest request = new LoginRequest();
        request.setEmail("test@example.com");
        request.setPassword("password123");

        User user = User.builder()
                .id(1)
                .fullName("Test User")
                .email("test@example.com")
                .password("encodedPassword")
                .build();

        when(userRepository.findByEmail(request.getEmail()))
                .thenReturn(Optional.of(user));

        when(passwordEncoder.matches(
                request.getPassword(),
                user.getPassword()
        )).thenReturn(true);

        when(jwtService.generateToken(user))
                .thenReturn("jwt-token-123");

        // Act
        LoginResponse response =
                authService.login(request);

        // Assert
        assertNotNull(response);

        assertEquals(
                "Login Successful",
                response.getMessage()
        );

        assertEquals(
                "jwt-token-123",
                response.getToken()
        );

        assertNotNull(response.getUser());

        assertEquals(
                "Test User",
                response.getUser().getFullName()
        );

        assertEquals(
                "test@example.com",
                response.getUser().getEmail()
        );

        verify(userRepository)
                .findByEmail(request.getEmail());

        verify(passwordEncoder)
                .matches(
                        request.getPassword(),
                        user.getPassword()
                );

        verify(jwtService)
                .generateToken(user);
    }


    // ============================================================
    // 4. Login Should Fail When User Does Not Exist
    // ============================================================

    @Test
    void login_ShouldThrowException_WhenUserDoesNotExist() {

        // Arrange
        LoginRequest request = new LoginRequest();
        request.setEmail("unknown@example.com");
        request.setPassword("password123");

        when(userRepository.findByEmail(request.getEmail()))
                .thenReturn(Optional.empty());

        // Act + Assert
        ResourceNotFoundException exception =
                assertThrows(
                        ResourceNotFoundException.class,
                        () -> authService.login(request)
                );

        assertEquals(
                "Invalid Email or Password",
                exception.getMessage()
        );

        verify(userRepository)
                .findByEmail(request.getEmail());

        verify(passwordEncoder, never())
                .matches(anyString(), anyString());

        verify(jwtService, never())
                .generateToken(any(User.class));
    }


    // ============================================================
    // 5. Login Should Fail When Password Is Incorrect
    // ============================================================

    @Test
    void login_ShouldThrowException_WhenPasswordIsIncorrect() {

        // Arrange
        LoginRequest request = new LoginRequest();
        request.setEmail("test@example.com");
        request.setPassword("wrongPassword");

        User user = User.builder()
                .id(1)
                .fullName("Test User")
                .email("test@example.com")
                .password("encodedPassword")
                .build();

        when(userRepository.findByEmail(request.getEmail()))
                .thenReturn(Optional.of(user));

        when(passwordEncoder.matches(
                request.getPassword(),
                user.getPassword()
        )).thenReturn(false);

        // Act + Assert
        ResourceNotFoundException exception =
                assertThrows(
                        ResourceNotFoundException.class,
                        () -> authService.login(request)
                );

        assertEquals(
                "Invalid Email or Password",
                exception.getMessage()
        );

        verify(userRepository)
                .findByEmail(request.getEmail());

        verify(passwordEncoder)
                .matches(
                        request.getPassword(),
                        user.getPassword()
                );

        verify(jwtService, never())
                .generateToken(any(User.class));
    }
}