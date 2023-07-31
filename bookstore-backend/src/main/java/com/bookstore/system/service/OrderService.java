package com.bookstore.system.service;

import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.bookstore.system.model.CartBook;
import com.bookstore.system.model.CompletedOrder;
import com.bookstore.system.model.Customer;
import com.bookstore.system.repository.CartBookRepository;
import com.bookstore.system.repository.CompletedOrderRepository;
import com.bookstore.system.repository.CustomerRepository;
import com.bookstore.system.repository.PaymentCardRepository;
import com.bookstore.system.repository.PromotionRepository;

@Service
public class OrderService {
    @Autowired
    private CompletedOrderRepository completedOrderRepository;
    @Autowired
    private PromotionRepository promotionRepository;
    @Autowired
    private CartService cartService;
    @Autowired
    private CustomerRepository customerRepository;
    @Autowired
    private PaymentCardRepository paymentCardRepository;
    @Autowired
    private CartBookRepository cartBookRepository;

    public ResponseEntity<String> checkout(Customer customer, String card, String promoCode) {
        CompletedOrder newOrder = new CompletedOrder();
        newOrder.setOrderedDate(new Date());
        newOrder.setOrderStatus(CompletedOrder.ORDER_STATUS.PENDING);
        newOrder.setTotalPrice(cartService.cartTotal(customer.getCart()));
        Set<CartBook> toAdd = new HashSet<>();
        
        for (CartBook cartBook : customer.getCart().getCartBooks()) {
            CartBook temp = new CartBook();
            temp.setBook(cartBook.getBook());
            temp.setQuantity(cartBook.getQuantity());
            temp.setCompletedOrder(newOrder);
            toAdd.add(temp);
        }
        newOrder.setOrderedBooks(toAdd);
        newOrder.setCustomer(customer);
        newOrder.setPaymentCard(paymentCardRepository.findByCardNumber(card));
        newOrder.setAddress(customer.getAddress());
        try {
            newOrder.setPromotion(promotionRepository.findByCode(promoCode));
        } catch (Exception e) {
            // TODO: handle exception
        }
        cartService.emptyCart(customer);
        completedOrderRepository.save(newOrder);
        Set<CompletedOrder> orderList = customer.getCompletedOrders();
        orderList.add(newOrder);
        customerRepository.save(customer);
        return ResponseEntity.ok().body("Order Placed");
    }

    public List<CompletedOrder> getAllOrders() {
        return completedOrderRepository.findAll();
    }
}
