package com.bookstore.system.service;

import com.bookstore.system.model.*;
import com.bookstore.system.repository.PromotionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.UUID;

@Service
public class PromotionService {
    @Autowired
    private PromotionRepository promotionRepository;

    private boolean checkValid(Promotion promotion) {
        Integer percentOff = promotion.getPercentage();
        Date startDate = promotion.getStart();
        Date endDate = promotion.getEnd();
        Date currDate = new Date();
        Integer currDay = currDate.getDate();
        Integer currMonth = currDate.getMonth() + 1;
        Integer currYear = currDate.getYear();
        Integer startYear = startDate.getYear();
        Integer endYear = endDate.getYear();
        Integer startMonth = startDate.getMonth() + 1;
        Integer endMonth = endDate.getMonth() + 1;
        Integer startDay = startDate.getDate();
        Integer endDay = endDate.getDate();

        if (startYear > currYear || endYear < currYear) {
            return false;
        } else if (startYear == currYear) {
            if (startMonth > currMonth) {
                return false;
            } else if (startMonth == currMonth) {
                if (startDay > currDay) {
                    return false;
                } // end if day
            } // end if month
        } else if (endYear == currYear) {
            if (endMonth < currMonth) {
                return false;
            } else if (endMonth == currMonth) {
                if (endDay < currDay) {
                    return false;
                } // end if day
            } // end if month
        } // end if year
        return true;
    }

    public ResponseEntity<?> getPromo(String code) {
        Promotion promotion = promotionRepository.findByCode(code);

        if (promotion != null) {
            if (checkValid(promotion))
                return ResponseEntity.ok().body(promotion);
        }
        /*
            Integer percentOff = promotion.getPercentage();
            Date startDate = promotion.getStart();
            Date endDate = promotion.getEnd();
            Date currDate = new Date();
            Integer currDay = currDate.getDate();
            Integer currMonth = currDate.getMonth() + 1;
            Integer currYear = currDate.getYear();
            Integer startYear = startDate.getYear();
            Integer endYear = endDate.getYear();
            Integer startMonth = startDate.getMonth() + 1;
            Integer endMonth = endDate.getMonth() + 1;
            Integer startDay = startDate.getDate();
            Integer endDay = endDate.getDate();

            if (startYear > currYear || endYear < currYear) {
                return ResponseEntity.badRequest().body("Promotion is out of date");
            } else if (startYear == currYear) {
                if (startMonth > currMonth) {
                    return ResponseEntity.badRequest().body("Promotion is out of date");
                } else if (startMonth == currMonth) {
                    if (startDay > currDay) {
                        return ResponseEntity.badRequest().body("Promotion is out of date");
                    } // end if day
                } // end if month
            } else if (endYear == currYear) {
                if (endMonth < currMonth) {
                    return ResponseEntity.badRequest().body("Promotion is out of date");
                } else if (endMonth == currMonth) {
                    if (endDay < currDay) {
                        return ResponseEntity.badRequest().body("Promotion is out of date");
                    } // end if day
                } // end if month
            } // end if year
            return ResponseEntity.ok().body(promotion);

        } // end if
         */
        return ResponseEntity.badRequest().body("Promotion does not exist");
    } // end getPromo
}
