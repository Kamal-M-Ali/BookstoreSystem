package com.bookstore.system.service;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class PasswordService {
    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();


    public boolean isValidPassword(String password) {
        return password.length() > 6;
    }

    public String encryptPassword(String password) {
        return passwordEncoder.encode(password);
    }
}
