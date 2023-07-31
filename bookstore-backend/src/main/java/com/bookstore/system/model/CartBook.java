package com.bookstore.system.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

@Entity
public class CartBook {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @ManyToOne
    private Book book;
    private int quantity;
    @JsonBackReference(value = "orderedBooks")
    @ManyToOne
    @JoinColumn(name = "completedOrder_id")
    private CompletedOrder completedOrder;
    @JsonBackReference(value = "cartBooks")
    @ManyToOne
    @JoinColumn(name = "cart_id")
    private Cart cart;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public Book getBook() {
        return book;
    }

    public void setBook(Book book) {
        this.book = book;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public CompletedOrder getCompletedOrder() {
        return completedOrder;
    }

    public void setCompletedOrder(CompletedOrder completedOrder) {
        this.completedOrder = completedOrder;
    }

    public Cart getCart() {
        return cart;
    }

    public void setCart(Cart cart) {
        this.cart = cart;
    }
}
