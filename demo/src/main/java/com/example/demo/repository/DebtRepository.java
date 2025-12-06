package com.example.demo.repository;

import com.example.demo.model.Debt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.time.LocalDateTime;
import java.util.List;

public interface DebtRepository extends JpaRepository<Debt, Long> {
    List<Debt> findByDebtorId(Long debtorId);

    @Query("SELECT d FROM Debt d WHERE d.isPaid = false AND d.createdAt < :cutoffDate")
    List<Debt> findOverdueDebts(LocalDateTime cutoffDate);
}