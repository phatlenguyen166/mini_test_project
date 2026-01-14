package com.example.demo.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class SimulationResponse {

    private Long id;
    private LocalDateTime createdAt;
    private Long sendAmountJpy;
    private Long receiveAmountVnd;
    private Integer feeJpy;
    private BigDecimal rateJpyToVnd;
    private String inputMode;

    // Constructors
    public SimulationResponse() {}

    public SimulationResponse(Long id, LocalDateTime createdAt, Long sendAmountJpy, 
                              Long receiveAmountVnd, Integer feeJpy, 
                              BigDecimal rateJpyToVnd, String inputMode) {
        this.id = id;
        this.createdAt = createdAt;
        this.sendAmountJpy = sendAmountJpy;
        this.receiveAmountVnd = receiveAmountVnd;
        this.feeJpy = feeJpy;
        this.rateJpyToVnd = rateJpyToVnd;
        this.inputMode = inputMode;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public Long getSendAmountJpy() {
        return sendAmountJpy;
    }

    public void setSendAmountJpy(Long sendAmountJpy) {
        this.sendAmountJpy = sendAmountJpy;
    }

    public Long getReceiveAmountVnd() {
        return receiveAmountVnd;
    }

    public void setReceiveAmountVnd(Long receiveAmountVnd) {
        this.receiveAmountVnd = receiveAmountVnd;
    }

    public Integer getFeeJpy() {
        return feeJpy;
    }

    public void setFeeJpy(Integer feeJpy) {
        this.feeJpy = feeJpy;
    }

    public BigDecimal getRateJpyToVnd() {
        return rateJpyToVnd;
    }

    public void setRateJpyToVnd(BigDecimal rateJpyToVnd) {
        this.rateJpyToVnd = rateJpyToVnd;
    }

    public String getInputMode() {
        return inputMode;
    }

    public void setInputMode(String inputMode) {
        this.inputMode = inputMode;
    }
}
