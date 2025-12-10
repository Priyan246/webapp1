package com.example.demo.controller;

import com.example.demo.dto.DebtDTO;
import com.example.demo.dto.UserProfileDTO;
import com.example.demo.model.Debt;
import com.example.demo.model.User;
import com.example.demo.repository.DebtRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173") // <--- Critical: Allows React to talk to Java
public class OweMeNotController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DebtRepository debtRepository;

    // 1. LOGIN ENDPOINT
    // React calls: fetch(`http://localhost:8080/api/login?phone=${phone}`)
    @GetMapping("/login")
    public UserProfileDTO login(@RequestParam String phone) {
        // Find user in DB by phone
        User user = userRepository.findByPhoneNumber(phone)
                .orElseThrow(() -> new RuntimeException("User not found with phone: " + phone));

        // Convert Entity -> DTO and return
        return new UserProfileDTO(user);
    }

    // 2. GET DEBTS ENDPOINT
    // React calls: fetch(`http://localhost:8080/api/debts?userId=${userId}`)
    @GetMapping("/debts")
    public List<DebtDTO> getDebts(@RequestParam Long userId) {
        // 1. Fetch all debts involving this user (either as payer or receiver)
        List<Debt> debts = debtRepository.findByCreditorIdOrDebtorId(userId, userId);

        // 2. Convert List<Debt> -> List<DebtDTO>
        return debts.stream()
                .map(debt -> new DebtDTO(debt, userId)) // Pass userId so DTO knows who "The Friend" is
                .collect(Collectors.toList());
    }
}
