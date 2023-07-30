package com.bookstore.system.service;

import com.bookstore.system.model.*;
import com.bookstore.system.repository.PromotionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class PromotionService {
    @Autowired
    private PromotionRepository promotionRepository;

    private boolean promotionIsValid(Promotion promotion) {
        Date currDate = new Date();

        return currDate.after(promotion.getStart()) && currDate.before(promotion.getEnd());
    }

    public ResponseEntity<?> getPromo(String code) {
        Promotion promotion = promotionRepository.findByCode(code);

        if (promotion != null) {
            if (promotionIsValid(promotion))
                return ResponseEntity.ok().body(promotion);
            else
                return ResponseEntity.badRequest().body("Promotion has expired");
        }
        return ResponseEntity.badRequest().body("Promotion does not exist");
    } // end getPromo
}
