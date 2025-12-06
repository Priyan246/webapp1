package com.example.demo.util;

import java.math.BigDecimal;
import java.text.NumberFormat;
import java.util.Locale;

public class CurrencyUtil {

    // Create a formatter specifically for India (English)
    private static final NumberFormat rupeeFormat = NumberFormat.getCurrencyInstance(new Locale("en", "IN"));

    // Static method so you can call it from anywhere without 'new CurrencyUtil()'
    public static String format(BigDecimal amount) {
        if (amount == null) return "₹0.00";
        return rupeeFormat.format(amount);
    }
}