package com.example.demo.controller;

import com.example.demo.model.Transaction;
import com.example.demo.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/wallet")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    // 1. TOP-UP WALLET (New Feature)
    // POST http://localhost:8080/api/wallet/topup
    @PostMapping("/topup")
    public ResponseEntity<?> topUp(@RequestBody TopUpRequest request) {
        try {
            transactionService.topUpWallet(request.getUserId(), request.getAmount());
            return ResponseEntity.ok("Wallet funded successfully!");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 2. TRANSFER MONEY
    // POST http://localhost:8080/api/wallet/transfer
    @PostMapping("/transfer")
    public ResponseEntity<?> transferMoney(@RequestBody TransferRequest request) {
        try {
            Transaction transaction = transactionService.transferMoney(
                    request.getSenderId(),
                    request.getReceiverPhone(),
                    request.getAmount(),
                    request.getTransactionPin(),
                    request.getDescription() // Fixed typo here
            );
            return ResponseEntity.ok("Transfer successful! Transaction ID: " + transaction.getId());
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 3. SPLIT BILL
    // POST http://localhost:8080/api/wallet/split
    @PostMapping("/split")
    public ResponseEntity<?> splitBill(@RequestBody SplitBillRequest request) {
        try {
            transactionService.splitBill(
                    request.getPayerId(),
                    request.getTotalAmount(),
                    request.getFriendPhones(),
                    request.getDescription() // Added description here
            );
            return ResponseEntity.ok("Bill split request sent to friends!");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 4. SIMPLIFY DEBTS (Algorithm)
    // GET http://localhost:8080/api/wallet/simplify
    @GetMapping("/simplify")
    public ResponseEntity<List<String>> getSimplifiedDebtPlan() {
        return ResponseEntity.ok(transactionService.simplifyDebts());
    }

    // 5. TRANSACTION HISTORY
    // GET http://localhost:8080/api/wallet/history/{userId}
    @GetMapping("/history/{userId}")
    public ResponseEntity<List<Transaction>> getHistory(@PathVariable Long userId) {
        return ResponseEntity.ok(transactionService.getHistory(userId));
    }

    // --- DTO Helper Classes ---

    public static class TopUpRequest {
        private Long userId;
        private BigDecimal amount;

        public Long getUserId() { return userId; }
        public void setUserId(Long userId) { this.userId = userId; }
        public BigDecimal getAmount() { return amount; }
        public void setAmount(BigDecimal amount) { this.amount = amount; }
    }

    public static class SplitBillRequest {
        private Long payerId;
        private BigDecimal totalAmount;
        private List<String> friendPhones;
        private String description; // Added missing field

        public Long getPayerId() { return payerId; }
        public void setPayerId(Long payerId) { this.payerId = payerId; }
        public BigDecimal getTotalAmount() { return totalAmount; }
        public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }
        public List<String> getFriendPhones() { return friendPhones; }
        public void setFriendPhones(List<String> friendPhones) { this.friendPhones = friendPhones; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
    }

    public static class TransferRequest {
        private Long senderId;
        private String receiverPhone;
        private BigDecimal amount;
        private String transactionPin;
        private String description; // Fixed typo (was 'descrption')

        public Long getSenderId() { return senderId; }
        public void setSenderId(Long senderId) { this.senderId = senderId; }
        public String getReceiverPhone() { return receiverPhone; }
        public void setReceiverPhone(String receiverPhone) { this.receiverPhone = receiverPhone; }
        public BigDecimal getAmount() { return amount; }
        public void setAmount(BigDecimal amount) { this.amount = amount; }
        public String getTransactionPin() { return transactionPin; }
        public void setTransactionPin(String transactionPin) { this.transactionPin = transactionPin; }

        // Fixed Recursive Loop and Return Type
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
    }
}