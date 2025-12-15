package com.example.demo.controller;

import com.example.demo.model.Transaction;
import com.example.demo.model.User;
import com.example.demo.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/wallet")
@CrossOrigin(origins = "http://localhost:5173") // Ensure React can access this
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    // 1. TOP-UP WALLET
    @PostMapping("/topup")
    public ResponseEntity<?> topUp(@RequestBody TopUpRequest request) {
        try {
            User updatedUser = transactionService.topUpWallet(request.getUserId(), request.getAmount());
            // ✅ Return new balance so UI updates instantly
            return ResponseEntity.ok(Map.of(
                    "message", "Wallet funded successfully!",
                    "balance", updatedUser.getBalance()
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 2. DEDUCT MONEY (PAY BILL) - ✅ NEW ENDPOINT
    @PostMapping("/deduct")
    public ResponseEntity<?> deductMoney(@RequestBody DeductRequest request) {
        try {
            User updatedUser = transactionService.deductMoney(
                    request.getUserId(),
                    request.getAmount(),
                    request.getDescription()
            );

            // ✅ Return new balance
            return ResponseEntity.ok(Map.of(
                    "message", "Payment successful!",
                    "balance", updatedUser.getBalance()
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 3. TRANSFER MONEY
    @PostMapping("/transfer")
    public ResponseEntity<?> transferMoney(@RequestBody TransferRequest request) {
        try {
            Transaction transaction = transactionService.transferMoney(
                    request.getSenderId(),
                    request.getReceiverPhone(),
                    request.getAmount(),
                    request.getTransactionPin(),
                    request.getDescription()
            );
            return ResponseEntity.ok("Transfer successful! Transaction ID: " + transaction.getId());
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 4. SPLIT BILL
    @PostMapping("/split")
    public ResponseEntity<?> splitBill(@RequestBody SplitBillRequest request) {
        try {
            transactionService.splitBill(
                    request.getPayerId(),
                    request.getTotalAmount(),
                    request.getFriendPhones(),
                    request.getDescription()
            );
            return ResponseEntity.ok("Bill split request sent to friends!");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 5. SIMPLIFY DEBTS
    @GetMapping("/simplify")
    public ResponseEntity<List<String>> getSimplifiedDebtPlan() {
        return ResponseEntity.ok(transactionService.simplifyDebts());
    }

    // 6. TRANSACTION HISTORY
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

    // ✅ NEW DTO FOR DEDUCT
    public static class DeductRequest {
        private Long userId;
        private BigDecimal amount;
        private String description;

        public Long getUserId() { return userId; }
        public void setUserId(Long userId) { this.userId = userId; }
        public BigDecimal getAmount() { return amount; }
        public void setAmount(BigDecimal amount) { this.amount = amount; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
    }

    public static class SplitBillRequest {
        private Long payerId;
        private BigDecimal totalAmount;
        private List<String> friendPhones;
        private String description;

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
        private String description;

        public Long getSenderId() { return senderId; }
        public void setSenderId(Long senderId) { this.senderId = senderId; }
        public String getReceiverPhone() { return receiverPhone; }
        public void setReceiverPhone(String receiverPhone) { this.receiverPhone = receiverPhone; }
        public BigDecimal getAmount() { return amount; }
        public void setAmount(BigDecimal amount) { this.amount = amount; }
        public String getTransactionPin() { return transactionPin; }
        public void setTransactionPin(String transactionPin) { this.transactionPin = transactionPin; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
    }
}