package com.bookstore.system.service;

import com.bookstore.system.model.*;
import com.bookstore.system.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class CustomerService {
    @Autowired
    private CustomerRepository customerRepository;
    @Autowired
    private PaymentCardService paymentCardService;
    @Autowired
    private PasswordService passwordService;
    @Autowired
    private EmailService emailService;
    @Autowired
    private JwtService jwtService;
    @Autowired
    private AuthenticationManager authenticationManager;

    public ResponseEntity<String> newCustomer(Customer newCustomer) {
        if (customerRepository.findByEmail(newCustomer.getEmail()) != null)
            return ResponseEntity.badRequest().body("Account already exists");

        // new customers must be verified via email
        newCustomer.setCustomerState(Customer.CUSTOMER_STATE.INACTIVE);

        // create a cart for the customer
        newCustomer.setCart(new Cart());

        // set password
        if (!passwordService.isValidPassword(newCustomer.getPassword()))
            return ResponseEntity.badRequest().body("Password invalid");
        newCustomer.setPassword(
                passwordService.encryptPassword(newCustomer.getPassword())
        );

        // payment method validation + encryption
        if (paymentCardService.encryptCardNumbers(newCustomer.getPaymentCards()) == null) {
            return ResponseEntity.badRequest().body("Card details invalid");
        }

        // email validation
        if (!emailService.validateEmail(newCustomer.getEmail()))
            return ResponseEntity.badRequest().body("Invalid email");

        // add verification token
        newCustomer.setConfirmationToken(UUID.randomUUID().toString());

        // send verification email
        emailService.sendEmail(newCustomer.getEmail(),
                "Complete Registration!",
                "To confirm your account, please click here : "
                        +"http://localhost:8080/verify-account?token="+newCustomer.getVerificationToken());

        // save customer in database
        customerRepository.save(newCustomer);
        String jwtToken = jwtService.generateToken(newCustomer);

        // account creation success
        return ResponseEntity.ok().body("Account creation success");
    }

    public ResponseEntity<String> userLogin(Login login) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        login.getEmail(),
                        login.getPassword()
                )
        );

        Customer customer = customerRepository.findByEmail(login.getEmail());

        if (customer != null) {
            // if here then user is authenticated and exists
            switch (customer.getCustomerState()) {
                case ACTIVE -> {
                    return ResponseEntity.ok().body(jwtService.generateToken(customer));
                }
                case INACTIVE -> {
                    return ResponseEntity.status(401).body("Account not activated");
                }
                case SUSPENDED -> {
                    return ResponseEntity.status(401).body("Account has been suspended");
                }
            }
        }
        return ResponseEntity.badRequest().body("Invalid Credentials");
    }

    public ResponseEntity<String> confirmEmail(String verificationToken) {
        Customer customer = customerRepository.findByVerificationToken(verificationToken);

        if (customer != null) {
            boolean isActive = (customer.getCustomerState() == Customer.CUSTOMER_STATE.ACTIVE);
            if (!isActive) {
                customer.setCustomerState(Customer.CUSTOMER_STATE.ACTIVE);
                customerRepository.save(customer);
            }
            return ResponseEntity.ok("<!DOCTYPE html>\n" +
                    "<html lang=\"en\">\n" +
                    "<head>\n" +
                    "    <meta charset=\"UTF-8\">\n" +
                    "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n" +
                    "    <title>Account Activated</title>\n" +
                    "</head>\n" +
                    "<body style=\"background-color: rgb(243, 243, 243);\">\n" +
                    "    <h1 style=\"font-size: 4em;text-align: center;padding-top: 2em;font-family: font-family:Arial, Helvetica, sans-serif;;\">\n" +
                    (isActive ?
                            "        Your account has been successfully activated!\n"
                            :
                            "        Your account has already been activated.\n") +
                    "    </h1>\n" +
                    "</body>\n" +
                    "</html>");
        }
        return ResponseEntity.badRequest().body("Account doesn't exist");
    }

    public ResponseEntity<String> resetAccount(String email) {
        Customer customer = customerRepository.findByEmail(email);

        if(customer != null) {
            customer.setConfirmationToken(UUID.randomUUID().toString());
            customerRepository.save(customer);

            emailService.sendEmail(customer.getEmail(),
                    "Reset your password",
                    "To reset your password, please click here : "
                            +"http://localhost:3000/ResetPassword/"+customer.getVerificationToken());
            return ResponseEntity.ok().body("Request Received");
        }
        return ResponseEntity.badRequest().body("Account not found");
    }

    public ResponseEntity<String> confirmReset(String verificationToken, String password) {
        Customer customer = customerRepository.findByVerificationToken(verificationToken);

        if(customer != null && passwordService.isValidPassword(password)) {
            customer.setPassword(passwordService.encryptPassword(password));
            customerRepository.save(customer);

            emailService.sendEmail(customer.getEmail(),
                    "Your password has been changed",
                    "Your password has successfully been changed"
            );
            return ResponseEntity.ok().body("Password changed");
        }
        return ResponseEntity.badRequest().body("Error setting new password");
    }

    public ResponseEntity<?> getCustomerProfile(String email) {
        Customer customer = customerRepository.findByEmail(email);

        if (customer != null)
            return ResponseEntity.ok().body(customer);
        return ResponseEntity.badRequest().body("Invalid Credentials");
    }

    public ResponseEntity<String> changePersonalInfo(String email, String name, Integer phoneNumber) {
        Customer customer = customerRepository.findByEmail(email);

        if (customer != null) {
            customer.setName(name);
            customer.setPhoneNumber(phoneNumber);
            customerRepository.save(customer);

            emailService.sendEmail(customer.getEmail(),
                    "[Bookstore System] Changes to your profile",
                    "This is an email to inform you that your personal info has been changed.");

            return ResponseEntity.ok().body("Updated password");
        }
        return ResponseEntity.badRequest().body("Could not find account.");
    }

    public ResponseEntity<String> changeAddress(String email, Address address) {
        Customer customer = customerRepository.findByEmail(email);

        if (customer != null) {
            customer.setAddress(address);
            customerRepository.save(customer);

            emailService.sendEmail(customer.getEmail(),
                    "[Bookstore System] Changes to your profile",
                    "This is an email to inform you that your profile's address has been updated.");

            return ResponseEntity.ok().body("Updated address");
        }
        return ResponseEntity.badRequest().body("Could not find account.");
    }

    public ResponseEntity<String> changePassword(String email, String password) {
        if (!passwordService.isValidPassword(password))
            return ResponseEntity.badRequest().body("Invalid password");

        Customer customer = customerRepository.findByEmail(email);

        if (customer != null) {
            customer.setPassword(passwordService.encryptPassword(password));
            customerRepository.save(customer);

            emailService.sendEmail(customer.getEmail(),
                    "[Bookstore System] Changes to your profile",
                    "This is an email to inform you that your password has been changed.");

            return ResponseEntity.ok().body("Updated password");
        }
        return ResponseEntity.badRequest().body("Could not find account.");
    }

    public ResponseEntity<String> setPayment(String email, PaymentCard paymentCard) {
        Customer customer = customerRepository.findByEmail(email);

        if (customer != null) {
            return paymentCardService.addPaymentCard(customer, paymentCard);
        }
        return ResponseEntity.badRequest().body("Could not find account.");
    }

    public ResponseEntity<String> delPayment(String email, PaymentCard paymentCard) {
        Customer customer = customerRepository.findByEmail(email);

        if (customer != null) {
            return paymentCardService.deletePaymentCard(customer, paymentCard);
        }
        return ResponseEntity.badRequest().body("Could not find account.");
    }

    public ResponseEntity<?> getAllOrders(String email) {
        Customer customer = customerRepository.findByEmail(email);

        if (customer != null) {
            return ResponseEntity.ok().body(customer.getCompletedOrders());
        }
        return ResponseEntity.badRequest().body("Could not find account.");
    }
}
