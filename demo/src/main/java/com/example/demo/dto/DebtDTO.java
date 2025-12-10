package com.example.demo.dto;

import com.example.demo.model.Debt;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;

public class DebtDTO {
    private Long id;
    private String friend;     // We extract just the name (e.g., "Bob")
    private Double amount;
    private String reason;     // Maps to 'description'
    private String date;       // Formatted String (e.g., "2025-11-01")
    private String status;     // Calculated: "overdue" or "pending"

    // Constructor that converts Entity -> DTO
    public DebtDTO(Debt debt, Long currentUserId) {
        this.id = debt.getId();
        this.amount = debt.getAmount().doubleValue();
        this.reason = debt.getDescription();

        // Format the date for React
        this.date = debt.getCreatedAt().format(DateTimeFormatter.ISO_LOCAL_DATE);

        // Logic 1: Determine who the "Friend" is
        // If I am the creditor, the friend is the debtor.
        // If I am the debtor, the friend is the creditor.
        if (debt.getCreditor().getId().equals(currentUserId)) {
            this.friend = debt.getDebtor().getName(); // Assuming User has .getName()
        } else {
            this.friend = debt.getCreditor().getName();
        }

        // Logic 2: Calculate "Overdue" Status (Your 10-day rule)
        long daysBetween = ChronoUnit.DAYS.between(debt.getCreatedAt(), LocalDate.now().atStartOfDay());
        if (daysBetween >= 10 && !debt.isPaid()) {
            this.status = "overdue";
        } else {
            this.status = "pending";
        }
    }

    // Getters are required for JSON
    public Long getId() { return id; }
    public String getFriend() { return friend; }
    public Double getAmount() { return amount; }
    public String getReason() { return reason; }
    public String getDate() { return date; }
    public String getStatus() { return status; }
}