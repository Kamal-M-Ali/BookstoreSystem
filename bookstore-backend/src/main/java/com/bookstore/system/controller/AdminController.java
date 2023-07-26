package com.bookstore.system.controller;

import com.bookstore.system.model.Book;
import com.bookstore.system.model.Promotion;
import com.bookstore.system.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    @PutMapping("/api/admin/add-book/:{email}")
    public ResponseEntity<String> addBook(@PathVariable String email, @Valid @RequestBody Book newBook) {
        return adminService.addBook(email, newBook);
    }

    @PutMapping("/api/admin/add-promotion/:{email}")
    public ResponseEntity<String> addPromotion(@PathVariable String email, @Valid @RequestBody Promotion newPromotion) {
        return adminService.addPromotion(email, newPromotion);
    }
}
