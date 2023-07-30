package com.bookstore.system.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

import java.util.Set;

@Entity
@Table(name="customers")
public class Customer extends User {
    public enum CUSTOMER_STATE {
            ACTIVE,
            INACTIVE,
            SUSPENDED
    }

    private CUSTOMER_STATE customerState;
    @OneToOne(cascade = CascadeType.ALL)
    @NotNull(message = "Must add an address")
    @Valid
    private Address address;

    @JsonManagedReference(value = "paymentCards")
    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true)
    @NotNull(message = "Must add a payment card")
    @Valid
    private Set<PaymentCard> paymentCards;

    @OneToOne(cascade = CascadeType.ALL)
    private Cart cart;

    @JsonManagedReference(value = "completedOrders")
    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true)
    private Set<CompletedOrder> completedOrders;

    public CUSTOMER_STATE getCustomerState() {
        return customerState;
    }

    public void setCustomerState(CUSTOMER_STATE customerState) {
        this.customerState = customerState;
    }

    public Address getAddress() {
        return address;
    }

    public void setAddress(Address address) {
        this.address = address;
    }

    public Set<PaymentCard> getPaymentCards() {
        return paymentCards;
    }

    public void setPaymentCards(Set<PaymentCard> paymentCards) {
        this.paymentCards = paymentCards;
    }

    public Cart getCart() {
        return cart;
    }

    public void setCart(Cart cart) {
        this.cart = cart;
    }

    public Set<CompletedOrder> getCompletedOrders() {
        return completedOrders;
    }

    public void setCompletedOrders(Set<CompletedOrder> completedOrders) {
        this.completedOrders = completedOrders;
    }
}
