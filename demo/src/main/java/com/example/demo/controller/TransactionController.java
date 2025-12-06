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

    // 1. TRANSFER MONEY
    // POST http://localhost:8080/api/wallet/transfer
    @PostMapping("/transfer")
    public ResponseEntity<?> transferMoney(@RequestBody TransferRequest request) {
        try {
            Transaction transaction = transactionService.transferMoney(
                    request.getSenderId(),
                    request.getReceiverPhone(),
                    request.getAmount(),
                    request.getTransactionPin()
            );
            return ResponseEntity.ok("Transfer successful! Transaction ID: " + transaction.getId());
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 2. SPLIT BILL
    // POST http://localhost:8080/api/wallet/split
    @PostMapping("/split")
    public ResponseEntity<?> splitBill(@RequestBody SplitBillRequest request) {
        try {
            transactionService.splitBill(
                    request.getPayerId(),
                    request.getTotalAmount(),
                    request.getFriendPhones()
            );
            return ResponseEntity.ok("Bill split request sent to friends!");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 3. SIMPLIFY DEBTS (Algorithm)
    // GET http://localhost:8080/api/wallet/simplify
    @GetMapping("/simplify")
    public ResponseEntity<List<String>> getSimplifiedDebtPlan() {
        return ResponseEntity.ok(transactionService.simplifyDebts());
    }

    // 4. TRANSACTION HISTORY
    // GET http://localhost:8080/api/wallet/history/{userId}
    @GetMapping("/history/{userId}")
    public ResponseEntity<List<Transaction>> getHistory(@PathVariable Long userId) {
        return ResponseEntity.ok(transactionService.getHistory(userId));
    }

    // --- DTO Helper Classes ---

    public static class SplitBillRequest {
        private Long payerId;
        private BigDecimal totalAmount;
        private List<String> friendPhones;

        public Long getPayerId() { return payerId; }
        public void setPayerId(Long payerId) { this.payerId = payerId; }
        public BigDecimal getTotalAmount() { return totalAmount; }
        public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }
        public List<String> getFriendPhones() { return friendPhones; }
        public void setFriendPhones(List<String> friendPhones) { this.friendPhones = friendPhones; }
    }

    public static class TransferRequest {
        private Long senderId;
        private String receiverPhone;
        private BigDecimal amount;
        private String transactionPin;

        public Long getSenderId() { return senderId; }
        public void setSenderId(Long senderId) { this.senderId = senderId; }
        public String getReceiverPhone() { return receiverPhone; }
        public void setReceiverPhone(String receiverPhone) { this.receiverPhone = receiverPhone; }
        public BigDecimal getAmount() { return amount; }
        public void setAmount(BigDecimal amount) { this.amount = amount; }
        public String getTransactionPin() { return transactionPin; }
        public void setTransactionPin(String transactionPin) { this.transactionPin = transactionPin; }
    }
}