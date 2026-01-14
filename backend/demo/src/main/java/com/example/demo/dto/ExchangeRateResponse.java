package com.example.demo.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.math.BigDecimal;

@JsonIgnoreProperties(ignoreUnknown = true)
public class ExchangeRateResponse {

    private String result;
    private String baseCode;
    private String targetCode;
    private BigDecimal conversionRate;

    // For error response
    private String errorType;

    public String getResult() {
        return result;
    }

    public void setResult(String result) {
        this.result = result;
    }

    public String getBaseCode() {
        return baseCode;
    }

    public void setBaseCode(String baseCode) {
        this.baseCode = baseCode;
    }

    public String getTargetCode() {
        return targetCode;
    }

    public void setTargetCode(String targetCode) {
        this.targetCode = targetCode;
    }

    public BigDecimal getConversionRate() {
        return conversionRate;
    }

    public void setConversionRate(BigDecimal conversionRate) {
        this.conversionRate = conversionRate;
    }

    public String getErrorType() {
        return errorType;
    }

    public void setErrorType(String errorType) {
        this.errorType = errorType;
    }

    public boolean isSuccess() {
        return "success".equalsIgnoreCase(result);
    }
}
