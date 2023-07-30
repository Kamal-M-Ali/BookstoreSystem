package com.bookstore.system.service;

import com.bookstore.system.model.*;
import com.bookstore.system.repository.PromotionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class PromotionService {
    @Autowired
    private PromotionRepository promotionRepository;

    public ResponseEntity<?> getPromo(String code) {
        Promotion promotion = promotionRepository.findByCode(code);

        if (promotion != null)
            return ResponseEntity.ok().body(promotion);
        return ResponseEntity.badRequest().body("Promotion does not exist");
    }

}
