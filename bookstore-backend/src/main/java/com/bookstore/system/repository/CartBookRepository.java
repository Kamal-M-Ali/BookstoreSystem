package com.bookstore.system.repository;

import com.bookstore.system.model.CartBook;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartBookRepository extends JpaRepository<CartBook, Integer> {
}
