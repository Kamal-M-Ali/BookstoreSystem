package com.bookstore.system.service;

import com.bookstore.system.model.*;
import com.bookstore.system.repository.BookRepository;
import com.bookstore.system.repository.CartRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
public class CartService {
    @Autowired
    private CartRepository cartRepository;
    @Autowired
    private BookRepository bookRepository;

    public void addToCart(Cart cart, Book book) {
        Set<CartBook> cartBooks = cart.getCartBooks();

        for (CartBook cartBook : cartBooks) {
            if (cartBook.getBook().getId() == book.getId()) {
                cartBook.setQuantity(cartBook.getQuantity() + 1);
                cartRepository.save(cart);
                return;
            }
        }

        // if out here then couldnt find it already in cart
        CartBook cartBook = new CartBook();
        cartBook.setQuantity(1);
        cartBook.setBook(book);
        cartBook.setCart(cart);

        cartBooks.add(cartBook);
        cartRepository.save(cart);
    }

    public void delFromCart(Cart cart, Book book) {
        Set<CartBook> cartBooks = cart.getCartBooks();

        for (CartBook cartBook : cartBooks) {
            if (cartBook.getBook().getId() == book.getId()) {
                cartBook.setQuantity(cartBook.getQuantity() - 1);

                if (cartBook.getQuantity() <= 0)
                    cartBooks.remove(cartBook);

                cartRepository.save(cart);
                return;
            }
        }
    }

    public void mergeCart(Customer customer, Integer[] bookIds) {
        Cart currentCart = customer.getCart();

        for (Integer bookId : bookIds) {
            Book book = bookRepository.findById(bookId)
                    .orElseThrow();
            addToCart(currentCart, book);
        }
    }

    public void emptyCart(Customer customer) {
        Cart cart = customer.getCart();
        cart.getCartBooks().clear();

        cartRepository.save(cart);
    }
}
