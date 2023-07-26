package com.bookstore.system.controller;

import com.bookstore.system.model.*;
import com.bookstore.system.service.CustomerService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
public class CustomerController {
    @Autowired
    private CustomerService customerService;

    @PostMapping("/api/signup")
    ResponseEntity<String> newCustomer(@Valid @RequestBody Customer newCustomer) {
        return customerService.newCustomer(newCustomer);
    }

    @GetMapping("/verify-account")
    public ResponseEntity<String> confirmEmail(@RequestParam("token") String verificationToken) {
        return customerService.confirmEmail(verificationToken);
    }

    @PostMapping("/api/reset")
    public ResponseEntity<String> resetAccount(@RequestParam("email") String email) {
        return customerService.resetAccount(email);
    }

    @PostMapping("/verify-reset")
    public ResponseEntity<String> confirmReset(@RequestParam("token") String verificationToken, @RequestParam("password") String password) {
        return customerService.confirmReset(verificationToken, password);
    }

    @PostMapping("/api/login")
    ResponseEntity<String> userLogin(@Valid @RequestBody Login login) {
        return customerService.userLogin(login);
    }

    @GetMapping("/api/profile/:{email}")
    public ResponseEntity<?> getCustomerProfile(@PathVariable String email) {
        return customerService.getCustomerProfile(email);
    }

    @PostMapping("/api/change-personal-info/:{email}")
    public ResponseEntity<String> changePersonalInfo(@PathVariable String email, @RequestParam String name, @RequestParam Integer phoneNumber) {
        return customerService.changePersonalInfo(email, name, phoneNumber);
    }

    @PostMapping("/api/change-address/:{email}")
    public ResponseEntity<String> changeAddress(@PathVariable String email, @Valid @RequestBody Address address) {
        return customerService.changeAddress(email, address);
    }

    @PostMapping("/api/change-password/:{email}")
    public ResponseEntity<String> changePassword(@PathVariable String email, @RequestParam String password) {
        return customerService.changePassword(email, password);
    }

    @PutMapping("/api/add-payment/:{email}")
    public ResponseEntity<String> setPayment(@PathVariable String email, @Valid @RequestBody PaymentCard paymentCard) {
        return customerService.setPayment(email, paymentCard);
    }

    @PostMapping("/api/del-payment/:{email}")
    public ResponseEntity<String> delPayment(@PathVariable String email, @Valid @RequestBody PaymentCard paymentCard) {
        return customerService.delPayment(email, paymentCard);
    }
}
