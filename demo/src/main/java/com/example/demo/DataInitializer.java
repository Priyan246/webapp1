package com.example.demo;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.math.BigDecimal;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;

    public DataInitializer(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        // Create Alice (You)
        if (userRepository.findByPhoneNumber("111").isEmpty()) {
            User alice = new User();
            alice.setName("Alice");
            alice.setPhoneNumber("111");
            alice.setBalance(BigDecimal.valueOf(5000)); // Start with money
            alice.setAvatar("https://api.dicebear.com/7.x/avataaars/svg?seed=Alice");
            userRepository.save(alice);
            System.out.println("✅ User 'Alice' created (Phone: 111)");
        }

        // Create Bob (Friend)
        if (userRepository.findByPhoneNumber("222").isEmpty()) {
            User bob = new User();
            bob.setName("Bob");
            bob.setPhoneNumber("222"); // <--- SEND MONEY TO THIS NUMBER
            bob.setBalance(BigDecimal.valueOf(1000));
            bob.setAvatar("https://api.dicebear.com/7.x/avataaars/svg?seed=Bob");
            userRepository.save(bob);
            System.out.println("✅ User 'Bob' created (Phone: 222)");
        }
    }
}
