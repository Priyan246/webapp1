package com.example.demo;

import jakarta.annotation.PostConstruct; // ✅ Added this import
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.scheduling.annotation.EnableScheduling;

import java.util.Properties;
import java.util.TimeZone;

@SpringBootApplication
@EnableScheduling
public class DemoApplication {

    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }

    // ✅ CORRECT PLACEMENT: Outside of main()
    @PostConstruct
    public void init() {
        // Forces Java to use the standard "Asia/Kolkata" timezone
        // instead of the deprecated "Asia/Calcutta" that crashes Postgres
        TimeZone.setDefault(TimeZone.getTimeZone("Asia/Kolkata"));
        System.out.println(" Timezone set to Asia/Kolkata");
    }

    // FIX: Create a "Dummy" Mail Sender so the app starts without a real password
    @Bean
    public JavaMailSender javaMailSender() {
        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
        mailSender.setHost("localhost"); // Fake server
        mailSender.setPort(1025);

        mailSender.setUsername("fake-user");
        mailSender.setPassword("fake-pass");

        Properties props = mailSender.getJavaMailProperties();
        props.put("mail.transport.protocol", "smtp");
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.debug", "true");

        return mailSender;
    }
}