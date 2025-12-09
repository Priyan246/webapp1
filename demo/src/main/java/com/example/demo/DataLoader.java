package com.example.demo;

import com.example.demo.model.Debt;
import com.example.demo.model.Transaction;
import com.example.demo.model.User;
import com.example.demo.repository.DebtRepository;
import com.example.demo.repository.TransactionRepository;
import com.example.demo.service.UserService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Configuration
public class DataLoader {

    @Bean
    CommandLineRunner initDatabase(
            UserService userService,
            DebtRepository debtRepository,
            TransactionRepository transactionRepository) {

        return args -> {
            System.out.println("🔄 Starting Master Data Loader...");

            // --- 1. TEST LOGIN & WALLET (Top-Up) ---
            // We give them money immediately to simulate a "Top Up" having happened.
            User alice = createUser(userService, "111", "alice@test.com", "Alice", "10000.00");
            User bob = createUser(userService, "222", "bob@test.com", "Bob", "500.00");
            User charlie = createUser(userService, "333", "charlie@test.com", "Charlie", "100.00");

            if (alice != null && bob != null && charlie != null) {

                // --- 2. TEST HISTORY (With Descriptions) ---
                // Simulating past activity so the dashboard looks alive.
                createTransaction(transactionRepository, alice, bob, "500.00", "Weekend Trip to Goa");
                createTransaction(transactionRepository, bob, charlie, "200.00", "Dinner at Taj");
                System.out.println("✅ History Created: Checked 'Description' field.");

                // --- 3. TEST BUDGET SPLITTER ---
                // Scenario: Alice paid ₹300 for 'Team Lunch' split with Bob & Charlie.
                // Math: ₹300 / 3 people = ₹100 each.
                // Result: Bob owes Alice ₹100, Charlie owes Alice ₹100.
                createDebt(debtRepository, bob, alice, "100.00", "Team Lunch Split");
                createDebt(debtRepository, charlie, alice, "100.00", "Team Lunch Split");
                System.out.println("✅ Budget Splitter Test Data Created.");

                // --- 4. TEST DEBT SETTLER (Transaction Minimization) ---
                // Scenario: Circular Debt Loop.
                // Alice owes Bob ₹50.
                // Bob owes Charlie ₹50.
                // ALGORITHM EXPECTATION: Alice should pay Charlie ₹50 directly (Skipping Bob).
                createDebt(debtRepository, alice, bob, "50.00", "Borrowed for Cab");
                createDebt(debtRepository, bob, charlie, "50.00", "Borrowed for Snacks");
                System.out.println("✅ Debt Loop Created (Alice->Bob->Charlie). Check /simplify endpoint!");

                System.out.println("🚀 SYSTEM READY! Login with Phone: '111', Pass: 'pass', PIN: '0000'");
            }
        };
    }

    // --- Helper to Create User ---
    private User createUser(UserService service, String phone, String email, String name, String balance) {
        try {
            User u = new User();
            u.setPhoneNumber(phone);
            u.setEmail(email);
            u.setPasswordHash("pass"); // Login Password
            u.setTransactionPinHash("0000"); // Transaction PIN
            u.setBalance(new BigDecimal(balance));
            return service.registerUser(u);
        } catch (Exception e) {
            System.out.println("⚠️ User " + name + " already exists. Skipping.");
            return null;
        }
    }

    // --- Helper to Create Transactions ---
    private void createTransaction(TransactionRepository repo, User sender, User receiver, String amount, String description) {
        Transaction t = new Transaction();
        t.setSender(sender);
        t.setReceiver(receiver);
        t.setAmount(new BigDecimal(amount));
        t.setDescription(description); // Stores "Goa Trip", etc.
        t.setTimestamp(LocalDateTime.now().minusDays(1)); // Happened yesterday
        t.setStatus("SUCCESS");
        repo.save(t);
    }

    // --- Helper to Create Debts ---
    private void createDebt(DebtRepository repo, User debtor, User creditor, String amount, String description) {
        Debt d = new Debt();
        d.setDebtor(debtor);
        d.setCreditor(creditor);
        d.setAmount(new BigDecimal(amount));
        d.setDescription(description); // Stores "Team Lunch", etc.
        d.setCreatedAt(LocalDateTime.now());
        d.setPaid(false);
        repo.save(d);
    }
}