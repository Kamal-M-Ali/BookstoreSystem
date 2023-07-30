package com.bookstore.system.controller;

import com.bookstore.system.model.*;
import com.bookstore.system.service.PromotionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@CrossOrigin
public class PromotionController {
    @Autowired
    private PromotionService PromotionService;

    @GetMapping("/getPromo")
    public ResponseEntity<?> getPromo(@RequestParam("code") String code) {
        return PromotionService.getPromo(code);
    }

}
