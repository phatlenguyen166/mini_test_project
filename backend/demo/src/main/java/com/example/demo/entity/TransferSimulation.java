package com.example.demo.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "transfer_simulations")
public class TransferSimulation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "send_amount_jpy", nullable = false)
    private Long sendAmountJpy;

    @Column(name = "receive_amount_vnd", nullable = false)
    private Long receiveAmountVnd;

    @Column(name = "fee_jpy", nullable = false)
    private Integer feeJpy;

    @Column(name = "rate_jpy_to_vnd", nullable = false, precision = 18, scale = 8)
    private BigDecimal rateJpyToVnd;

    @Enumerated(EnumType.STRING)
    @Column(name = "input_mode", nullable = false)
    private InputMode inputMode = InputMode.BOTH;

    @Column(name = "client_ip", length = 45)
    private String clientIp;

    @Column(name = "user_agent", length = 255)
    private String userAgent;

    public enum InputMode {
        JPY_INPUT, VND_INPUT, BOTH
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    // Constructors
    public TransferSimulation() {}

    public TransferSimulation(Long sendAmountJpy, Long receiveAmountVnd, Integer feeJpy, 
                              BigDecimal rateJpyToVnd, InputMode inputMode) {
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

    public InputMode getInputMode() {
        return inputMode;
    }

    public void setInputMode(InputMode inputMode) {
        this.inputMode = inputMode;
    }

    public String getClientIp() {
        return clientIp;
    }

    public void setClientIp(String clientIp) {
        this.clientIp = clientIp;
    }

    public String getUserAgent() {
        return userAgent;
    }

    public void setUserAgent(String userAgent) {
        this.userAgent = userAgent;
    }
}
