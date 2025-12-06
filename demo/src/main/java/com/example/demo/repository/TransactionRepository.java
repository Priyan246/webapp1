package com.example.demo.repository;

import com.example.demo.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    // Finds all transactions where the user was either the sender OR receiver
    List<Transaction> findBySenderIdOrReceiverId(Long senderId, Long receiverId);
}
