package com.example.demo;

import com.example.demo.model.Debt;
import com.example.demo.model.Transaction;
import com.example.demo.model.User;
import com.example.demo.repository.DebtRepository;
import com.example.demo.repository.TransactionRepository;
import com.example.demo.service.UserService;
import com.example.demo.util.CurrencyUtil;
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
            System.out.println("🔄 Starting Data Loader...");

            // 1. CREATE USERS (Alice, Bob, Charlie)
            // Giving them ₹5000 each so you can test transfers immediately
            User alice = createUser(userService, "111", "alice@test.com", "Alice", "5000.00");
            User bob = createUser(userService, "222", "bob@test.com", "Bob", "5000.00");
            User charlie = createUser(userService, "333", "charlie@test.com", "Charlie", "5000.00");

            if (alice != null && bob != null && charlie != null) {

                // 2. CREATE HISTORY (So Dashboard isn't empty)
                // Alice sent ₹100 to Bob yesterday
                createTransaction(transactionRepository, alice, bob, "100.00");
                // Bob sent ₹50 to Charlie today
                createTransaction(transactionRepository, bob, charlie, "50.00");
                System.out.println("✅ Created Past Transactions (Check History!)");

                // 3. CREATE DEBT SCENARIO (For 'Simplify' Algorithm)
                // Scenario: Alice owes Bob ₹50. Bob owes Charlie ₹50.
                // Algorithm should say: "Alice pays Charlie ₹50"
                createDebt(debtRepository, alice, bob, "50.00");
                createDebt(debtRepository, bob, charlie, "50.00");
                System.out.println("✅ Created Debt Loop: Alice->Bob->Charlie (Check Simplify!)");

                System.out.println("🚀 Backend Ready! Test Credentials: Phone '111', PIN '0000'");
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
            User saved = service.registerUser(u);
            System.out.println("👤 Created User: " + name + " (Phone: " + phone + ")");
            return saved;
        } catch (Exception e) {
            System.out.println("⚠️ User " + name + " already exists.");
            return null;
        }
    }

    // --- Helper to Create Past Transactions ---
    private void createTransaction(TransactionRepository repo, User sender, User receiver, String amount) {
        Transaction t = new Transaction();
        t.setSender(sender);
        t.setReceiver(receiver);
        t.setAmount(new BigDecimal(amount));
        t.setTimestamp(LocalDateTime.now().minusDays(1)); // Backdated
        t.setStatus("SUCCESS");
        repo.save(t);
    }

    // --- Helper to Create Debts ---
    private void createDebt(DebtRepository repo, User debtor, User creditor, String amount) {
        Debt d = new Debt();
        d.setDebtor(debtor);
        d.setCreditor(creditor);
        d.setAmount(new BigDecimal(amount));
        d.setCreatedAt(LocalDateTime.now());
        d.setPaid(false);
        repo.save(d);
    }
}