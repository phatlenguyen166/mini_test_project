package com.example.demo.service;

import com.example.demo.dto.ExchangeRateResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;

@Service
public class ExchangeRateService {

    private static final Logger logger = LoggerFactory.getLogger(ExchangeRateService.class);

    private final RestTemplate restTemplate;

    @Value("${exchange.api.key}")
    private String apiKey;

    @Value("${exchange.api.base-url:https://v6.exchangerate-api.com/v6}")
    private String baseUrl;

    public ExchangeRateService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    /**
     * Fetch real-time exchange rate from JPY to VND
     * @return Exchange rate (1 JPY = ? VND)
     */
    public BigDecimal getJpyToVndRate() {
        String url = String.format("%s/%s/pair/JPY/VND", baseUrl, apiKey);
        
        try {
            ExchangeRateResponse response = restTemplate.getForObject(url, ExchangeRateResponse.class);
            
            if (response != null && response.isSuccess()) {
                logger.info("Fetched exchange rate: 1 JPY = {} VND", response.getConversionRate());
                return response.getConversionRate();
            } else {
                String errorType = response != null ? response.getErrorType() : "Unknown error";
                logger.error("Failed to fetch exchange rate: {}", errorType);
                throw new RuntimeException("Failed to fetch exchange rate: " + errorType);
            }
        } catch (Exception e) {
            logger.error("Error fetching exchange rate from API", e);
            throw new RuntimeException("Unable to fetch exchange rate. Please try again later.", e);
        }
    }

    /**
     * Fetch real-time exchange rate from VND to JPY
     * @return Exchange rate (1 VND = ? JPY)
     */
    public BigDecimal getVndToJpyRate() {
        String url = String.format("%s/%s/pair/VND/JPY", baseUrl, apiKey);
        
        try {
            ExchangeRateResponse response = restTemplate.getForObject(url, ExchangeRateResponse.class);
            
            if (response != null && response.isSuccess()) {
                logger.info("Fetched exchange rate: 1 VND = {} JPY", response.getConversionRate());
                return response.getConversionRate();
            } else {
                String errorType = response != null ? response.getErrorType() : "Unknown error";
                logger.error("Failed to fetch exchange rate: {}", errorType);
                throw new RuntimeException("Failed to fetch exchange rate: " + errorType);
            }
        } catch (Exception e) {
            logger.error("Error fetching exchange rate from API", e);
            throw new RuntimeException("Unable to fetch exchange rate. Please try again later.", e);
        }
    }
}
