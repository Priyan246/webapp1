package com.example.demo.dto;

import com.example.demo.model.User;

public class UserProfileDTO {
    private String name;
    private String phone;
    private Double balance;
    private String uniqueId;
    private String avatar;

    // Constructor: Converts Entity -> DTO
    public UserProfileDTO(User user) {
        this.name = user.getName();
        this.phone = user.getPhoneNumber();

        // specific logic: Convert BigDecimal to Double for JSON
        this.balance = user.getBalance().doubleValue();

        this.uniqueId = user.getUniqueId();

        // specific logic: Generate a fake avatar based on their name
        // This ensures the UI always has an image to show
        this.avatar = "https://ui-avatars.com/api/?background=BFAEE3&color=fff&name=" + user.getName();
    }

    // Getters are required for JSON
    public String getName() { return name; }
    public String getPhone() { return phone; }
    public Double getBalance() { return balance; }
    public String getUniqueId() { return uniqueId; }
    public String getAvatar() { return avatar; }
}