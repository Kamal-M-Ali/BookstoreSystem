package com.bookstore.system.service;

import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import com.bookstore.system.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bookstore.system.repository.CartBookRepository;
import com.bookstore.system.repository.CompletedOrderRepository;
import com.bookstore.system.repository.CustomerRepository;
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
    private PaymentCardService paymentCardService;

    private Double getTotalPrice(Set<CartBook> cartBooks) {
        Double total = 0.0;
        for (CartBook cartBook : cartBooks) {
            total += cartBook.getBook().getPrice();
        }
        System.out.println("TOTAL: " + total);
        return total;
    }

    private Double getTotalPrice(Set<CartBook> cartBooks, Promotion promo) {
        return getTotalPrice(cartBooks) * (100 - (promo.getPercentage()) / 100);
    }

    private void addBookToOrder(CompletedOrder order, CartBook toAdd) {
        Set<CartBook> orderedBooks = order.getOrderedBooks();

        CartBook cartBook = new CartBook();
        cartBook.setBook(toAdd.getBook());
        cartBook.setQuantity(toAdd.getQuantity());
        cartBook.setCompletedOrder(order);
        orderedBooks.add(cartBook);

        completedOrderRepository.save(order);
    }

    public void checkout(Customer customer, PaymentCard card, String promoCode) {
        CompletedOrder newOrder = new CompletedOrder();
        newOrder.setOrderedDate(new Date());
        newOrder.setOrderStatus(CompletedOrder.ORDER_STATUS.PENDING);

        Set<CartBook> cartBooks = customer.getCart().getCartBooks();
        Promotion promo = promotionRepository.findByCode(promoCode);

        if (promo != null) {
            newOrder.setTotalPrice(getTotalPrice(cartBooks, promo));
            newOrder.setPromotion(promo);
        } else
            newOrder.setTotalPrice(getTotalPrice(cartBooks));

        newOrder.setPaymentCard(card);
        newOrder.setAddress(customer.getAddress());
        newOrder.setCustomer(customer);

        newOrder.setOrderedBooks(new HashSet<>());
        for (CartBook cartBook : cartBooks) {
            addBookToOrder(newOrder, cartBook);
        }

        completedOrderRepository.save(newOrder);
        cartService.emptyCart(customer);
    }

    public List<CompletedOrder> getAllOrders() {
        return completedOrderRepository.findAll();
    }
}
