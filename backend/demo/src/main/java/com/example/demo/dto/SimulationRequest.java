package com.example.demo.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class SimulationRequest {

    @NotNull(message = "Input mode is required")
    private InputMode inputMode;

    @Min(value = 100, message = "Minimum amount is 100 JPY")
    private Long sendAmountJpy;

    @Positive(message = "Receive amount must be positive")
    private Long receiveAmountVnd;

    public enum InputMode {
        JPY_INPUT,   // User enters JPY, system calculates VND
        VND_INPUT    // User enters VND, system calculates JPY
    }

    /**
     * Validate request based on input mode
     */
    public void validate() {
        if (inputMode == InputMode.JPY_INPUT) {
            if (sendAmountJpy == null) {
                throw new IllegalArgumentException("sendAmountJpy is required when inputMode is JPY_INPUT");
            }
            if (sendAmountJpy < 100) {
                throw new IllegalArgumentException("Minimum transfer amount is ¥100");
            }
        } else if (inputMode == InputMode.VND_INPUT) {
            if (receiveAmountVnd == null) {
                throw new IllegalArgumentException("receiveAmountVnd is required when inputMode is VND_INPUT");
            }
            if (receiveAmountVnd <= 0) {
                throw new IllegalArgumentException("Receive amount must be positive");
            }
        }
    }

    // Getters and Setters
    public InputMode getInputMode() {
        return inputMode;
    }

    public void setInputMode(InputMode inputMode) {
        this.inputMode = inputMode;
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
}
