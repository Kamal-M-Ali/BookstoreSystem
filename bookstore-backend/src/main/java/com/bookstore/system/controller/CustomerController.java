package com.bookstore.system.controller;

import com.bookstore.system.model.Cart;
import com.bookstore.system.model.Customer;
import com.bookstore.system.model.Login;
import com.bookstore.system.model.PaymentCard;
import com.bookstore.system.repository.CustomerRepository;
import com.bookstore.system.service.EmailService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;
import java.util.regex.Pattern;

@RestController
@CrossOrigin
public class CustomerController {
    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    EmailService emailService;

    @PostMapping("/api/signup")
    ResponseEntity<String> newCustomer(@Valid @RequestBody Customer newCustomer) {
        if (customerRepository.findByEmail(newCustomer.getEmail()) != null)
            return ResponseEntity.badRequest().body("Account already exists");

        // new customers must be verified via email
        newCustomer.setCustomerState(Customer.CUSTOMER_STATE.INACTIVE);

        // create a cart for the customer
        newCustomer.setCart(new Cart());

        // ensure password length > 6
        if (newCustomer.getPassword().length() < 6)
            return ResponseEntity.badRequest().body("Password too short");

        // encrypt their password
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        newCustomer.setPassword(passwordEncoder.encode(newCustomer.getPassword()));

        // encrypt their card number
        for (PaymentCard card : newCustomer.getPaymentCards())
        {
            if (!card.getCardNumber().matches("\\d+"))
                return ResponseEntity.badRequest().body("Card number invalid");

            card.setLastFour(
                    card.getCardNumber().substring(card.getCardNumber().length() - 4)
            );
            card.setCardNumber(passwordEncoder.encode(card.getCardNumber()));
        }

        // email validation
        // regex source: https://www.baeldung.com/java-email-validation-regex
        if (!Pattern.compile("^(?=.{1,64}@)[A-Za-z0-9_-]+(\\.[A-Za-z0-9_-]+)*@[^-][A-Za-z0-9-]+(\\.[A-Za-z0-9-]+)*(\\.[A-Za-z]{2,})$")
                .matcher(newCustomer.getEmail())
                .matches())
            return ResponseEntity.badRequest().body("Invalid email");

        // add verification token
        newCustomer.setConfirmationToken(UUID.randomUUID().toString());

        // send verification email
        SimpleMailMessage mailMessage = new SimpleMailMessage();
        mailMessage.setTo(newCustomer.getEmail());
        mailMessage.setSubject("Complete Registration!");
        mailMessage.setText("To confirm your account, please click here : "
                +"http://localhost:8080/verify-account?token="+newCustomer.getVerificationToken());
        emailService.sendEmail(mailMessage);

        // save customer in database
        customerRepository.save(newCustomer);

        // account creation success
        return ResponseEntity.ok().body("Account created");
    }

    @GetMapping("/verify-account")
    public ResponseEntity<String> confirmEmail(@RequestParam("token") String verificationToken) {
        Customer customer = customerRepository.findByVerificationToken(verificationToken);

        if(customer != null) {
            if (customer.getCustomerState() != Customer.CUSTOMER_STATE.ACTIVE) {
                customer.setCustomerState(Customer.CUSTOMER_STATE.ACTIVE);
                customerRepository.save(customer);
                return ResponseEntity.ok("<!DOCTYPE html>\n" +
                        "<html lang=\"en\">\n" +
                        "<head>\n" +
                        "    <meta charset=\"UTF-8\">\n" +
                        "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n" +
                        "    <title>Account Activated</title>\n" +
                        "</head>\n" +
                        "<body style=\"background-color: rgb(243, 243, 243);\">\n" +
                        "    <h1 style=\"font-size: 4em;text-align: center;padding-top: 2em;font-family: font-family:Arial, Helvetica, sans-serif;;\">\n" +
                        "        Your account has been successfully activated!\n" +
                        "    </h1>\n" +
                        "</body>\n" +
                        "</html>");
            } else
                return ResponseEntity.ok("<!DOCTYPE html>\n" +
                        "<html lang=\"en\">\n" +
                        "<head>\n" +
                        "    <meta charset=\"UTF-8\">\n" +
                        "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n" +
                        "    <title>Account Activated</title>\n" +
                        "</head>\n" +
                        "<body style=\"background-color: rgb(243, 243, 243);\">\n" +
                        "    <h1 style=\"font-size: 4em;text-align: center;padding-top: 2em;font-family: font-family:Arial, Helvetica, sans-serif;;\">\n" +
                        "        Your account has already been activated.\n" +
                        "    </h1>\n" +
                        "</body>\n" +
                        "</html>");
        }
        return ResponseEntity.badRequest().body("Account doesn't exist");
    }

    @PostMapping("/api/login")
    ResponseEntity<String> userLogin(@Valid @RequestBody Login login) {
        Customer customer = customerRepository.findByEmail(login.getEmail());

        if (customer != null) {
            BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
            boolean isMatch = passwordEncoder.matches(login.getPassword(), customer.getPassword());

            if (isMatch) {
                if(customer.getCustomerState() == Customer.CUSTOMER_STATE.ACTIVE)
                    return ResponseEntity.ok().body("Customer");
                if(customer.getCustomerState() == Customer.CUSTOMER_STATE.INACTIVE)
                    return ResponseEntity.status(403).body("Account not activated");
            }
        }
        return ResponseEntity.badRequest().body("Invalid Credentials");
    }
}
