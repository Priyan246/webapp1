package com.example.demo.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Data // Generates Getters, Setters, ToString, etc. automatically
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(unique = true) // Removed nullable=false so we can auto-generate it
    private String uniqueId;

    @Column(unique = true, nullable = false)
    private String phoneNumber;

    // Made email optional since your login uses Phone, not Email
    private String email;

    private String passwordHash;
    private String transactionPinHash;

    // Default balance to 0 to avoid null pointer exceptions
    private BigDecimal balance = BigDecimal.ZERO;

    // ✅ FIX: This was missing, causing the "cannot find symbol" error
    private String avatar;

    // ✅ AUTOMATION: Generates a unique ID (e.g., @Alice1234) before saving
    @PrePersist
    public void generateUniqueId() {
        if (this.uniqueId == null) {
            String cleanName = name != null ? name.toLowerCase().replaceAll("\\s+", "") : "user";
            String uuidPart = UUID.randomUUID().toString().substring(0, 4);
            this.uniqueId = "@" + cleanName + uuidPart;
        }
    }
}