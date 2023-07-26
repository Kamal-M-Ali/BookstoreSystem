package com.bookstore.system.controller;

import com.bookstore.system.exception.BookNotFoundException;
import com.bookstore.system.model.Book;
import com.bookstore.system.service.BookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@CrossOrigin
public class BookController {
    @Autowired
    private BookService bookService;

    @GetMapping("/api/book/:{id}")
    Book getBook(@PathVariable Integer id) {
        return bookService.getBook(id);
    }

    @GetMapping("/api/books")
    List<Book> getAllBooks() {
        return bookService.getAllBooks();
    }
}
