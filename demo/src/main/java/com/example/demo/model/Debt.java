package com.example.demo.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Data
public class Debt {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "creditor_id") // The person who is OWED money
    private User creditor;

    @ManyToOne
    @JoinColumn(name = "debtor_id") // The person who OWES money
    private User debtor;

    private BigDecimal amount;
    private LocalDateTime createdAt;
    private String description;
    private boolean isPaid = false;
}