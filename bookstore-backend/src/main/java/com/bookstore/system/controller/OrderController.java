package com.bookstore.system.controller;

import com.bookstore.system.model.PaymentCard;
import com.bookstore.system.service.CustomerService;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;


@RestController
@CrossOrigin
public class OrderController {
    @Autowired
    private CustomerService customerService;

    @PostMapping("/api/checkout/:{email}")
    ResponseEntity<String> checkout(@PathVariable String email, @RequestParam("card") String lastFour, @RequestParam("promo") String promo) {
        return customerService.checkout(email, lastFour, promo);
    }
}
