package com.maroctransit.auth.controller;

import com.maroctransit.auth.dto.ApiResponse;
import com.maroctransit.auth.dto.JwtAuthResponse;
import com.maroctransit.auth.dto.LoginRequest;
import com.maroctransit.auth.dto.SignUpRequest;
import com.maroctransit.auth.security.JwtTokenProvider;
import com.maroctransit.auth.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

/**
 * Controller for authentication operations like signup, login, and token refresh
 */
@RestController
@RequestMapping("/api/v1/auth")
@Tag(name = "Authentication API", description = "APIs for user authentication and registration")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private UserService userService;

    /**
     * Authenticate user and generate JWT token
     */
    @PostMapping("/login")
    @Operation(summary = "Login user", description = "Authenticates a user and returns JWT tokens")
    public ResponseEntity<ApiResponse<JwtAuthResponse>> login(@Valid @RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsername(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        
        String accessToken = tokenProvider.generateToken(userDetails);
        String refreshToken = tokenProvider.generateRefreshToken(userDetails);

        JwtAuthResponse response = new JwtAuthResponse(accessToken, refreshToken);
        
        return ResponseEntity.ok(ApiResponse.success("Login successful", response));
    }

    /**
     * Register a new user
     */
    @PostMapping("/signup")
    @Operation(summary = "Register user", description = "Registers a new user with role selection")
    public ResponseEntity<ApiResponse<?>> registerUser(@Valid @RequestBody SignUpRequest signUpRequest) {
        if (userService.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity
                    .badRequest()
                    .body(ApiResponse.error("Username is already taken!"));
        }

        if (userService.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(ApiResponse.error("Email is already in use!"));
        }

        userService.createUser(signUpRequest);
        
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("User registered successfully"));
    }

    /**
     * Refresh authentication token
     */
    @PostMapping("/refresh")
    @Operation(summary = "Refresh token", description = "Generate a new access token using refresh token")
    public ResponseEntity<ApiResponse<JwtAuthResponse>> refreshToken(@RequestParam("refreshToken") String refreshToken) {
        if (!tokenProvider.validateToken(refreshToken)) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Invalid refresh token"));
        }
        
        String username = tokenProvider.getUsernameFromToken(refreshToken);
        UserDetails userDetails = userService.loadUserByUsername(username);
        
        String accessToken = tokenProvider.generateToken(userDetails);
        JwtAuthResponse response = new JwtAuthResponse(accessToken, refreshToken);
        
        return ResponseEntity.ok(ApiResponse.success("Token refreshed successfully", response));
    }
}