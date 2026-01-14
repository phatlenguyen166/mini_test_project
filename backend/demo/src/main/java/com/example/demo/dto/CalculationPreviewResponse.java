package com.example.demo.dto;

import java.math.BigDecimal;

public class CalculationPreviewResponse {

    private Long sendAmountJpy;
    private Long receiveAmountVnd;
    private Integer feeJpy;
    private BigDecimal rateJpyToVnd;
    private Long netAmountJpy; // sendAmountJpy - feeJpy (amount actually converted)

    public CalculationPreviewResponse() {}

    public CalculationPreviewResponse(Long sendAmountJpy, Long receiveAmountVnd, 
                                      Integer feeJpy, BigDecimal rateJpyToVnd, Long netAmountJpy) {
        this.sendAmountJpy = sendAmountJpy;
        this.receiveAmountVnd = receiveAmountVnd;
        this.feeJpy = feeJpy;
        this.rateJpyToVnd = rateJpyToVnd;
        this.netAmountJpy = netAmountJpy;
    }

    // Getters and Setters
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

    public Long getNetAmountJpy() {
        return netAmountJpy;
    }

    public void setNetAmountJpy(Long netAmountJpy) {
        this.netAmountJpy = netAmountJpy;
    }
}
