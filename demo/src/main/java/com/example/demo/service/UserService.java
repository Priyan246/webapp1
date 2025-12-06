package com.example.demo.service;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
public class UserService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    @Lazy // Prevents circular dependency issues during startup
    private PasswordEncoder passwordEncoder;

    // LOGIN LOGIC: Tells Spring Security how to find a user
    @Override
    public UserDetails loadUserByUsername(String phoneNumber) throws UsernameNotFoundException {
        // 1. Find user by Phone Number (since that's your login ID)
        User user = userRepository.findByPhoneNumber(phoneNumber)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with phone: " + phoneNumber));

        // 2. Return a Spring Security "User" object
        return new org.springframework.security.core.userdetails.User(
                user.getPhoneNumber(),
                user.getPasswordHash(),
                new ArrayList<>() // Authorities (Roles) - empty for now
        );
    }

    // REGISTRATION LOGIC: Securely saves a new user
    public User registerUser(User user) {
        // 1. Check if phone already exists
        if (userRepository.existsByPhoneNumber(user.getPhoneNumber())) {
            throw new RuntimeException("Phone number already registered");
        }

        // 2. Encrypt the Password (for Login)
        user.setPasswordHash(passwordEncoder.encode(user.getPasswordHash()));

        // 3. Encrypt the PIN (for Transactions)
        // We reuse the password encoder because it's secure (BCrypt)
        user.setTransactionPinHash(passwordEncoder.encode(user.getTransactionPinHash()));

        // 4. Save to DB
        return userRepository.save(user);
    }
}