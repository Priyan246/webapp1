package com.example.demo.controller;

import com.example.demo.dto.DebtDTO;
import com.example.demo.dto.DebtRequestDTO;
import com.example.demo.dto.UserProfileDTO;
import com.example.demo.model.Debt;
import com.example.demo.model.User;
import com.example.demo.model.Transaction;
import com.example.demo.repository.DebtRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.repository.TransactionRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173") // Allows React to talk to Java
public class OweMeNotController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DebtRepository debtRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    // 1. LOGIN ENDPOINT
    @GetMapping("/login")
    public UserProfileDTO login(@RequestParam String phone) {
        User user = userRepository.findByPhoneNumber(phone)
                .orElseThrow(() -> new RuntimeException("User not found with phone: " + phone));
        return new UserProfileDTO(user);
    }

    // 2. GET DEBTS ENDPOINT
    @GetMapping("/debts")
    public List<DebtDTO> getDebts(@RequestParam Long userId) {
        List<Debt> debts = debtRepository.findByCreditorIdOrDebtorId(userId, userId);
        return debts.stream()
                .map(debt -> new DebtDTO(debt, userId))
                .collect(Collectors.toList());
    }

    // 3. CREATE DEBT (SPLIT BILL)
    @PostMapping("/debts")
    public DebtDTO createDebt(@RequestBody DebtRequestDTO request) {
        User creditor = userRepository.findById(request.getCreditorId())
                .orElseThrow(() -> new RuntimeException("Creditor not found"));

        // Simplified friend lookup by name for demo
        User debtor = userRepository.findAll().stream()
                .filter(u -> u.getName().equalsIgnoreCase(request.getDebtorName()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Friend not found: " + request.getDebtorName()));

        Debt debt = new Debt();
        debt.setCreditor(creditor);
        debt.setDebtor(debtor);
        debt.setAmount(java.math.BigDecimal.valueOf(request.getAmount()));
        debt.setDescription(request.getDescription());
        debt.setCreatedAt(java.time.LocalDateTime.now());

        Debt savedDebt = debtRepository.save(debt);
        return new DebtDTO(savedDebt, creditor.getId());
    }

    // 4. SETTLE DEBT (PAY BACK)
    @PostMapping("/settle/{debtId}")
    public DebtDTO settleDebt(@PathVariable Long debtId) {
        Debt debt = debtRepository.findById(debtId)
                .orElseThrow(() -> new RuntimeException("Debt not found"));

        if (debt.isPaid()) {
            throw new RuntimeException("Debt is already paid!");
        }

        User debtor = debt.getDebtor();   // The one who owes money
        User creditor = debt.getCreditor(); // The one getting paid

        // Check Balance
        if (debtor.getBalance().compareTo(debt.getAmount()) < 0) {
            throw new RuntimeException("Insufficient balance! Please Top Up.");
        }

        // Move Money
        debtor.setBalance(debtor.getBalance().subtract(debt.getAmount()));
        creditor.setBalance(creditor.getBalance().add(debt.getAmount()));

        userRepository.save(debtor);
        userRepository.save(creditor);

        // Mark Debt as Paid
        debt.setPaid(true);
        Debt savedDebt = debtRepository.save(debt);

        // Record Transaction
        Transaction t = new Transaction();
        t.setSender(debtor);
        t.setReceiver(creditor);
        t.setAmount(debt.getAmount());
        t.setDescription("Settlement: " + debt.getDescription());
        t.setTimestamp(java.time.LocalDateTime.now());
        t.setStatus("SUCCESS");
        transactionRepository.save(t);

        return new DebtDTO(savedDebt, creditor.getId());
    }

    // 5. ADD MONEY (TOP UP) - ✅ NEW ENDPOINT
    @PostMapping("/user/addMoney")
    public java.util.Map<String, Object> addMoney(@RequestBody java.util.Map<String, Object> payload) {
        Long userId = Long.valueOf(payload.get("userId").toString());
        Double amount = Double.valueOf(payload.get("amount").toString());

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Update Balance
        user.setBalance(user.getBalance().add(java.math.BigDecimal.valueOf(amount)));
        User updatedUser = userRepository.save(user);

        // ✅ FIX: Return a simple Map instead of DTO object to prevent serialization errors
        java.util.Map<String, Object> response = new java.util.HashMap<>();
        response.put("message", "Money added successfully");
        response.put("balance", updatedUser.getBalance());
        return response;
    }
    // 6. SEND MONEY (P2P Transfer) - ✅ NEW
    @PostMapping("/send")
    public java.util.Map<String, Object> sendMoney(@RequestBody java.util.Map<String, Object> payload) {
        Long senderId = Long.valueOf(payload.get("senderId").toString());
        String receiverPhone = payload.get("receiverPhone").toString();
        Double amount = Double.valueOf(payload.get("amount").toString());
        String note = payload.getOrDefault("note", "Transfer").toString();

        // 1. Find Sender
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new RuntimeException("Sender not found"));

        // 2. Find Receiver (By Phone Number)
        User receiver = userRepository.findByPhoneNumber(receiverPhone)
                .orElseThrow(() -> new RuntimeException("Receiver not found with phone: " + receiverPhone));

        // 3. Prevent self-transfer
        if (sender.getId().equals(receiver.getId())) {
            throw new RuntimeException("You cannot send money to yourself!");
        }

        // 4. Check Balance
        if (sender.getBalance().compareTo(java.math.BigDecimal.valueOf(amount)) < 0) {
            throw new RuntimeException("Insufficient wallet balance.");
        }

        // 5. Perform Transfer
        sender.setBalance(sender.getBalance().subtract(java.math.BigDecimal.valueOf(amount)));
        receiver.setBalance(receiver.getBalance().add(java.math.BigDecimal.valueOf(amount)));

        userRepository.save(sender);
        userRepository.save(receiver);

        // 6. Record Transaction
        Transaction t = new Transaction();
        t.setSender(sender);
        t.setReceiver(receiver);
        t.setAmount(java.math.BigDecimal.valueOf(amount));
        t.setDescription("Sent to " + receiver.getName() + ": " + note);
        t.setTimestamp(java.time.LocalDateTime.now());
        t.setStatus("SUCCESS");
        transactionRepository.save(t);

        // 7. Return success & new balance
        java.util.Map<String, Object> response = new java.util.HashMap<>();
        response.put("message", "Sent successfully to " + receiver.getName());
        response.put("balance", sender.getBalance());
        return response;
    }
}