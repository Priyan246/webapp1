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

            // --- 1. CREATE USERS (With new Name/UniqueId fields) ---
            User alice = createUser(userService, "111", "alice@test.com", "Alice", "@Alice_Wonder", "10000.00");
            User bob = createUser(userService, "222", "bob@test.com", "Bob", "@Bob_Builder", "500.00");
            User charlie = createUser(userService, "333", "charlie@test.com", "Charlie", "@Charlie_Angle", "100.00");

            if (alice != null && bob != null && charlie != null) {

                // --- 2. CREATE TRANSACTIONS ---
                createTransaction(transactionRepository, alice, bob, "500.00", "Weekend Trip to Goa");
                createTransaction(transactionRepository, bob, charlie, "200.00", "Dinner at Taj");
                System.out.println("✅ History Created.");

                // --- 3. CREATE DEBTS ---
                // Bob owes Alice 100 (Overdue logic test)
                Debt debt1 = createDebt(debtRepository, bob, alice, "100.00", "Team Lunch Split");
                // Manually backdate this debt to make it "Overdue" (Older than 10 days)
                debt1.setCreatedAt(LocalDateTime.now().minusDays(15));
                debtRepository.save(debt1);

                createDebt(debtRepository, charlie, alice, "100.00", "Team Lunch Split");

                System.out.println("✅ Budget Splitter Test Data Created.");
                System.out.println("🚀 SYSTEM READY! Login with Phone: '111'");
            }
        };
    }

    // --- Helper to Create User ---
    private User createUser(UserService service, String phone, String email, String name, String uniqueId, String balance) {
        try {
            User u = new User();
            u.setPhoneNumber(phone);
            u.setEmail(email);
            u.setName(name);          // ✅ NEW: Required field
            u.setUniqueId(uniqueId);  // ✅ NEW: Required field
            u.setPasswordHash("pass");
            u.setTransactionPinHash("0000");
            u.setBalance(new BigDecimal(balance));
            return service.registerUser(u);
        } catch (Exception e) {
            // Print the ACTUAL error so we know why it failed
            System.out.println("⚠️ Failed to create user " + name + ": " + e.getMessage());
            return null;
        }
    }

    private void createTransaction(TransactionRepository repo, User sender, User receiver, String amount, String description) {
        Transaction t = new Transaction();
        t.setSender(sender);
        t.setReceiver(receiver);
        t.setAmount(new BigDecimal(amount));
        t.setDescription(description);
        t.setTimestamp(LocalDateTime.now().minusDays(1));
        t.setStatus("SUCCESS");
        repo.save(t);
    }

    private Debt createDebt(DebtRepository repo, User debtor, User creditor, String amount, String description) {
        Debt d = new Debt();
        d.setDebtor(debtor);
        d.setCreditor(creditor);
        d.setAmount(new BigDecimal(amount));
        d.setDescription(description);
        d.setCreatedAt(LocalDateTime.now());
        d.setPaid(false);
        return repo.save(d);
    }
}