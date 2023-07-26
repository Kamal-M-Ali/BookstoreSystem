package com.bookstore.system.controller;

import com.bookstore.system.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.bookstore.system.model.Admin;
import com.bookstore.system.model.Login;

import jakarta.validation.Valid;

@RestController
@CrossOrigin
public class AdminController {
    @Autowired
    private AdminService adminService;

    @PostMapping("/api/login/admin")
    ResponseEntity<String> adminLogin(@Valid @RequestBody Login login) {
        return adminService.adminLogin(login);
    }

    @GetMapping("/api/admin-menu")
    public ResponseEntity<String> doesAdminExist(@RequestParam("email") String email) {
        return adminService.doesAdminExist(email);
    }

    @PostMapping("/api/signup/admin")
    ResponseEntity<String> newAdmin(@Valid @RequestBody Admin newAdmin) {
        return adminService.newAdmin(newAdmin);
    }
}
