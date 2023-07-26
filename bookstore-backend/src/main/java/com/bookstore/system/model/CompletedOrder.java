package com.bookstore.system.model;

import jakarta.persistence.*;

import java.util.Date;
import java.util.Set;

@Entity
public class CompletedOrder {
    enum ORDER_STATUS {
        RETURNED,
        CANCELED,
        PENDING,
        SHIPPED,
        ARRIVED
    }
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int orderId;
    private Date orderedDate;
    private ORDER_STATUS orderStatus;
    private int totalPrice;
    @ManyToOne
    @JoinColumn(name = "customer_id")
    private Customer customer;
    @OneToMany(mappedBy = "completedOrder")
    private Set<CartBook> orderedBooks;
    @OneToOne(cascade = CascadeType.ALL)
    private PaymentCard paymentCard;
    @OneToOne(cascade = CascadeType.ALL)
    private Address address;
    @OneToOne(cascade = CascadeType.ALL)
    private Promotion promotion = null;


    public int getOrderId() {
        return orderId;
    }

    public void setOrderId(int orderId) {
        this.orderId = orderId;
    }

    public Date getOrderedDate() {
        return orderedDate;
    }

    public void setOrderedDate(Date orderedDate) {
        this.orderedDate = orderedDate;
    }

    public ORDER_STATUS getOrderStatus() {
        return orderStatus;
    }

    public void setOrderStatus(ORDER_STATUS orderStatus) {
        this.orderStatus = orderStatus;
    }

    public int getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(int totalPrice) {
        this.totalPrice = totalPrice;
    }

    public Set<CartBook> getOrderedBooks() {
        return orderedBooks;
    }

    public void setOrderedBooks(Set<CartBook> orderedBooks) {
        this.orderedBooks = orderedBooks;
    }

    public PaymentCard getPaymentCard() {
        return paymentCard;
    }

    public void setPaymentCard(PaymentCard paymentCard) {
        this.paymentCard = paymentCard;
    }

    public Address getAddress() {
        return address;
    }

    public void setAddress(Address address) {
        this.address = address;
    }

    public Customer getCustomer() {
        return customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    public Promotion getPromotion() {
        return promotion;
    }

    public void setPromotion(Promotion promotion) {
        this.promotion = promotion;
    }
}
