package com.example.demo.service;

import com.example.demo.model.Debt;
import com.example.demo.repository.DebtRepository;
import com.example.demo.util.CurrencyUtil; // IMPORT THE TOOL
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationService {

    @Autowired private DebtRepository debtRepository;
    @Autowired private JavaMailSender mailSender;

    // Runs every day at 9:00 AM
    @Scheduled(cron = "0 0 9 * * ?")
    public void checkOverdueDebts() {
        LocalDateTime tenDaysAgo = LocalDateTime.now().minusDays(10);
        List<Debt> overdueDebts = debtRepository.findOverdueDebts(tenDaysAgo);

        for (Debt debt : overdueDebts) {
            sendReminderEmail(debt);
        }
    }

    private void sendReminderEmail(Debt debt) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("your-email@gmail.com");
        message.setTo(debt.getDebtor().getEmail());
        message.setSubject("PayMyBuddy: You have an overdue debt!");

        // USE THE TOOL HERE
        String formattedAmount = CurrencyUtil.format(debt.getAmount());

        message.setText("Hi " + debt.getDebtor().getPhoneNumber() + ",\n\n" +
                "You still owe " + formattedAmount + " to " +
                debt.getCreditor().getPhoneNumber() + ".\n" +
                "This debt is over 10 days old. Please settle it soon!\n\n" +
                "- The PayMyBuddy Team");

        try {
            mailSender.send(message);
            System.out.println("📧 Email sent to: " + debt.getDebtor().getEmail());
        } catch (Exception e) {
            System.err.println("❌ Failed to send email: " + e.getMessage());
        }
    }
}