package com.bookstore.system.service;

import com.bookstore.system.model.Customer;
import com.bookstore.system.model.PaymentCard;
import com.bookstore.system.repository.CustomerRepository;
import com.bookstore.system.repository.PaymentCardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
public class PaymentCardService {
    @Autowired
    private CustomerRepository customerRepository;
    @Autowired
    private PaymentCardRepository paymentCardRepository;
    @Autowired
    private PasswordService passwordService;
    @Autowired
    private EmailService emailService;

    private boolean isValidCardNumber(String cardNumber) {
        return cardNumber.matches("\\d+");
    }

    public PaymentCard encryptCardNumber(PaymentCard paymentCard) {
        if (!isValidCardNumber(paymentCard.getCardNumber()))
            return null;

        paymentCard.setLastFour(
                paymentCard.getCardNumber().substring(paymentCard.getCardNumber().length() - 4)
        );
        paymentCard.setCardNumber(passwordService.encryptPassword(paymentCard.getCardNumber()));
        return paymentCard;
    }

    public Set<PaymentCard> encryptCardNumbers(Set<PaymentCard> paymentCards){
        boolean success = true;
        for (PaymentCard paymentCard : paymentCards) {
            success = (encryptCardNumber(paymentCard) != null);
            if (!success) break;
        }
        return success ? paymentCards : null;
    }

    public ResponseEntity<String> addPaymentCard(Customer customer, PaymentCard paymentCard) {
        Set<PaymentCard> paymentCards = customer.getPaymentCards();

        // customer can only have 3 cards
        if (paymentCards.size() == 3)
            return ResponseEntity.badRequest().body("Max payment cards attached to account.");

        // check card number string is only digits
        if (encryptCardNumber(paymentCard) == null)
            return ResponseEntity.badRequest().body("Card number invalid");

        // add and save the payment card
        paymentCard.setCustomer(customer);
        paymentCardRepository.save(paymentCard);

        emailService.sendEmail(customer.getEmail(),
                "[Bookstore System] Changes to your profile",
                "This is an email to inform you that your profile's payment information has been updated.");

        return ResponseEntity.ok().body("Added payment card");
    }

    public ResponseEntity<String> deletePaymentCard(Customer customer, PaymentCard paymentCard) {
        Set<PaymentCard> paymentCards = customer.getPaymentCards();
        PaymentCard card = paymentCardRepository.findById(paymentCard.getId())
                .orElseThrow();

        if (!card.getCustomer().equals(customer))
            return ResponseEntity.status(403).body("Cannot update another account.");

        paymentCards.remove(card);
        customerRepository.save(customer);

        emailService.sendEmail(customer.getEmail(),
                "[Bookstore System] Changes to your profile",
                "This is an email to inform you that your profile's payment information has been updated.");
        return ResponseEntity.ok().body("Deleted payment card");
    }
}
