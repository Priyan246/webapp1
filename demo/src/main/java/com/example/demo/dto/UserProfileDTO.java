package com.example.demo.dto;

import com.example.demo.model.User;

public class UserProfileDTO {
    private Long id;
    private String name;
    private String phone;
    private Double balance;
    private String uniqueId;
    private String avatar;

    public UserProfileDTO(User user) {
        this.name = user.getName();
        this.id = user.getId();
        this.phone = user.getPhoneNumber();
        this.balance = user.getBalance().doubleValue();
        this.uniqueId = user.getUniqueId();

        // ✅ FIXED LOGIC: Prefer the DB avatar (DiceBear), fall back to Initials if null
        if (user.getAvatar() != null && !user.getAvatar().isEmpty()) {
            this.avatar = user.getAvatar();
        } else {
            this.avatar = "https://ui-avatars.com/api/?background=BFAEE3&color=fff&name=" + user.getName();
        }
    }

    // Getters
    public Long getId() { return id; }
    public String getName() { return name; }
    public String getPhone() { return phone; }
    public Double getBalance() { return balance; }
    public String getUniqueId() { return uniqueId; }
    public String getAvatar() { return avatar; }
}