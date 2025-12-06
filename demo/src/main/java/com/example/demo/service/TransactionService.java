package com.example.demo.service;

import com.example.demo.model.Debt;
import com.example.demo.model.Transaction;
import com.example.demo.model.User;
import com.example.demo.repository.DebtRepository;
import com.example.demo.repository.TransactionRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.util.CurrencyUtil; // Helper for ₹ formatting
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class TransactionService {

    @Autowired private UserRepository userRepository;
    @Autowired private TransactionRepository transactionRepository;
    @Autowired private DebtRepository debtRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    // --- FEATURE 1: CORE MONEY TRANSFER ---
    @Transactional
    public Transaction transferMoney(Long senderId, String receiverPhone, BigDecimal amount, String rawPin) {
        // 1. Safety Check: Prevent negative transfers (ICG Requirement)
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Transfer amount must be positive");
        }

        // 2. Find Sender
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new RuntimeException("Sender not found"));

        // 3. Validate PIN
        if (!passwordEncoder.matches(rawPin, sender.getTransactionPinHash())) {
            throw new RuntimeException("Invalid PIN");
        }

        // 4. Check Balance
        if (sender.getBalance().compareTo(amount) < 0) {
            throw new RuntimeException("Insufficient funds");
        }

        // 5. Find Receiver
        User receiver = userRepository.findByPhoneNumber(receiverPhone)
                .orElseThrow(() -> new RuntimeException("Receiver not found"));

        // 6. Move Money
        sender.setBalance(sender.getBalance().subtract(amount));
        receiver.setBalance(receiver.getBalance().add(amount));

        userRepository.save(sender);
        userRepository.save(receiver);

        // 7. Save Transaction Record
        Transaction transaction = new Transaction();
        transaction.setSender(sender);
        transaction.setReceiver(receiver);
        transaction.setAmount(amount);
        transaction.setTimestamp(LocalDateTime.now());
        transaction.setStatus("SUCCESS");

        return transactionRepository.save(transaction);
    }

    // --- FEATURE 2: SPLIT BILL ---
    public void splitBill(Long payerId, BigDecimal totalAmount, List<String> friendPhones) {
        User payer = userRepository.findById(payerId)
                .orElseThrow(() -> new RuntimeException("Payer not found"));

        // Calculate split (Total / (Friends + Payer))
        BigDecimal splitAmount = totalAmount.divide(
                BigDecimal.valueOf(friendPhones.size() + 1),
                2,
                java.math.RoundingMode.HALF_UP
        );

        for (String phone : friendPhones) {
            User friend = userRepository.findByPhoneNumber(phone)
                    .orElseThrow(() -> new RuntimeException("Friend not found: " + phone));

            Debt debt = new Debt();
            debt.setCreditor(payer);
            debt.setDebtor(friend);
            debt.setAmount(splitAmount);
            debt.setCreatedAt(LocalDateTime.now());
            debt.setPaid(false);

            debtRepository.save(debt);
        }
    }

    // --- FEATURE 3: DEBT SIMPLIFICATION (CASH FLOW MINIMIZATION) ---
    public List<String> simplifyDebts() {
        // 1. Fetch all unpaid debts
        List<Debt> allDebts = debtRepository.findAll();
        Map<User, BigDecimal> netBalance = new HashMap<>();

        // 2. Calculate Net Flow
        for (Debt d : allDebts) {
            if (!d.isPaid()) {
                User payer = d.getDebtor();
                User receiver = d.getCreditor();
                BigDecimal amount = d.getAmount();

                netBalance.put(payer, netBalance.getOrDefault(payer, BigDecimal.ZERO).subtract(amount));
                netBalance.put(receiver, netBalance.getOrDefault(receiver, BigDecimal.ZERO).add(amount));
            }
        }

        // 3. Separate into "Givers" and "Receivers"
        PriorityQueue<UserBalance> givers = new PriorityQueue<>((a, b) -> a.amount.compareTo(b.amount));
        PriorityQueue<UserBalance> receivers = new PriorityQueue<>((a, b) -> b.amount.compareTo(a.amount));

        for (Map.Entry<User, BigDecimal> entry : netBalance.entrySet()) {
            if (entry.getValue().compareTo(BigDecimal.ZERO) < 0) {
                givers.offer(new UserBalance(entry.getKey(), entry.getValue()));
            } else if (entry.getValue().compareTo(BigDecimal.ZERO) > 0) {
                receivers.offer(new UserBalance(entry.getKey(), entry.getValue()));
            }
        }

        // 4. Greedy Matching Algorithm
        List<String> simplifiedPlan = new ArrayList<>();

        while (!givers.isEmpty() && !receivers.isEmpty()) {
            UserBalance giver = givers.poll();
            UserBalance receiver = receivers.poll();

            BigDecimal amountToSettle = giver.amount.abs().min(receiver.amount);

            simplifiedPlan.add(giver.user.getPhoneNumber() + " pays " +
                    receiver.user.getPhoneNumber() + " : " +
                    CurrencyUtil.format(amountToSettle));

            giver.amount = giver.amount.add(amountToSettle);
            receiver.amount = receiver.amount.subtract(amountToSettle);

            if (giver.amount.abs().compareTo(new BigDecimal("0.01")) > 0) givers.offer(giver);
            if (receiver.amount.abs().compareTo(new BigDecimal("0.01")) > 0) receivers.offer(receiver);
        }

        if (simplifiedPlan.isEmpty()) {
            simplifiedPlan.add("All debts are settled! No payments needed.");
        }

        return simplifiedPlan;
    }

    // --- FEATURE 4: TRANSACTION HISTORY ---
    public List<Transaction> getHistory(Long userId) {
        return transactionRepository.findBySenderIdOrReceiverId(userId, userId);
    }

    // Helper class for Priority Queue
    private static class UserBalance {
        User user;
        BigDecimal amount;

        public UserBalance(User user, BigDecimal amount) {
            this.user = user;
            this.amount = amount;
        }
    }
}