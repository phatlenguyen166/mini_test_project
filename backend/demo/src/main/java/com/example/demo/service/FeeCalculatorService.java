package com.example.demo.service;

import org.springframework.stereotype.Service;

@Service
public class FeeCalculatorService {

    /**
     * Calculate transfer fee based on the amount in JPY
     * 
     * Fee structure:
     * ¥100 - ¥10,000     → ¥100
     * ¥10,001 - ¥50,000  → ¥400
     * ¥50,001 - ¥100,000 → ¥700
     * > ¥100,000         → ¥1000
     * 
     * @param amountJpy The amount in JPY
     * @return The fee in JPY
     */
    public int calculateFee(long amountJpy) {
        if (amountJpy < 100) {
            throw new IllegalArgumentException("Minimum transfer amount is ¥100");
        }
        
        if (amountJpy <= 10_000) {
            return 100;
        } else if (amountJpy <= 50_000) {
            return 400;
        } else if (amountJpy <= 100_000) {
            return 700;
        } else {
            return 1000;
        }
    }

    /**
     * Get fee description for display
     * @return Fee structure as a formatted string
     */
    public String getFeeStructure() {
        return """
            Fee Structure:
            ¥100 - ¥10,000     → ¥100
            ¥10,001 - ¥50,000  → ¥400
            ¥50,001 - ¥100,000 → ¥700
            > ¥100,000         → ¥1,000
            """;
    }
}
