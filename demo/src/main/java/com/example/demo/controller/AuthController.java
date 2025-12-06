package com.example.demo.controller;

import com.example.demo.config.JwtUtil; // Custom Tool we created
import com.example.demo.model.User;
import com.example.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private AuthenticationManager authenticationManager; // Handles the password check

    @Autowired
    private JwtUtil jwtUtil; // Handles the token creation

    // API: POST http://localhost:8080/api/auth/register
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        try {
            User newUser = userService.registerUser(user);
            return ResponseEntity.ok("User registered successfully! ID: " + newUser.getId());
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // API: POST http://localhost:8080/api/auth/login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            // 1. Verify Phone & Password using Spring Security
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getPhoneNumber(), request.getPassword())
            );

            // 2. If verification succeeds, generate the Token
            String token = jwtUtil.generateToken(request.getPhoneNumber());

            // 3. Return the token to the user
            return ResponseEntity.ok(new LoginResponse(token));

        } catch (Exception e) {
            // 4. If password is wrong, return 401 Unauthorized
            return ResponseEntity.status(401).body("Invalid phone number or password");
        }
    }

    // --- Helper Classes (DTOs) ---

    // Structure of data coming IN for login
    public static class LoginRequest {
        private String phoneNumber;
        private String password;

        public String getPhoneNumber() { return phoneNumber; }
        public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    // Structure of data going OUT after login
    public static class LoginResponse {
        private String token;

        public LoginResponse(String token) {
            this.token = token;
        }

        public String getToken() { return token; }
    }
}