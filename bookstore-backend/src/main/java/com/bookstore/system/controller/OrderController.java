package com.bookstore.system.controller;

import com.bookstore.system.model.Book;
import com.bookstore.system.model.CompletedOrder;
import com.bookstore.system.model.PaymentCard;
import com.bookstore.system.repository.CustomerRepository;
import com.bookstore.system.service.BookService;
import com.bookstore.system.service.OrderService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin
public class OrderController {
    @Autowired
    private OrderService orderService;
    @Autowired
    private CustomerRepository customerRepository;

    @PostMapping("/api/checkout/:{email}")
    ResponseEntity<String> checkout(@PathVariable String email, @RequestParam("card") String card, @RequestParam("promo") String promo) {
        return orderService.checkout(customerRepository.findByEmail(email), card, promo);
    }

    @GetMapping("/api/orders")
    List<CompletedOrder> getAllOrders() {
        return orderService.getAllOrders();
    }
}
