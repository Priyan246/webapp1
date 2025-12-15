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
        // 1. Create Alice (You)
        if (userRepository.findByPhoneNumber("111").isEmpty()) {
            User alice = new User();
            alice.setName("Alice");
            alice.setPhoneNumber("111");
            alice.setBalance(BigDecimal.valueOf(5000));
            alice.setAvatar("https://api.dicebear.com/7.x/avataaars/svg?seed=Alice");
            userRepository.save(alice);
            System.out.println("✅ User 'Alice' created (Phone: 111)");
        }

        // 2. Create Bob (Friend 1)
        if (userRepository.findByPhoneNumber("222").isEmpty()) {
            User bob = new User();
            bob.setName("Bob");
            bob.setPhoneNumber("222");
            bob.setBalance(BigDecimal.valueOf(1000));
            bob.setAvatar("https://api.dicebear.com/7.x/avataaars/svg?seed=Bob");
            userRepository.save(bob);
            System.out.println("✅ User 'Bob' created (Phone: 222)");
        }

        // --- NEW USERS ADDED BELOW ---

        // 3. Create Charlie (Friend 2)
        if (userRepository.findByPhoneNumber("333").isEmpty()) {
            User charlie = new User();
            charlie.setName("Charlie"); // Matches the frontend name
            charlie.setPhoneNumber("333");
            charlie.setBalance(BigDecimal.valueOf(1500));
            charlie.setAvatar("https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie");
            userRepository.save(charlie);
            System.out.println("✅ User 'Charlie' created (Phone: 333)");
        }

        // 4. Create David (Friend 3)
        if (userRepository.findByPhoneNumber("444").isEmpty()) {
            User david = new User();
            david.setName("David"); // Matches the frontend name
            david.setPhoneNumber("444");
            david.setBalance(BigDecimal.valueOf(500));
            david.setAvatar("https://api.dicebear.com/7.x/avataaars/svg?seed=David");
            userRepository.save(david);
            System.out.println("✅ User 'David' created (Phone: 444)");
        }
    }
}