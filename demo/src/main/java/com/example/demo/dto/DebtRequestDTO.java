package com.example.demo.dto;

public class DebtRequestDTO {
    private Long creditorId; // Who PAID (You)
    private String debtorName; // Who OWES (Friend)
    private Double amount;
    private String description;

    // Getters and Setters
    public Long getCreditorId() { return creditorId; }
    public void setCreditorId(Long creditorId) { this.creditorId = creditorId; }
    public String getDebtorName() { return debtorName; }
    public void setDebtorName(String debtorName) { this.debtorName = debtorName; }
    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}