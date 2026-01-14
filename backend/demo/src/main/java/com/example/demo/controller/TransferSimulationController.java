package com.example.demo.controller;

import com.example.demo.dto.CalculationPreviewResponse;
import com.example.demo.dto.SimulationRequest;
import com.example.demo.dto.SimulationResponse;
import com.example.demo.service.FeeCalculatorService;
import com.example.demo.service.TransferSimulationService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/transfer")
@CrossOrigin(origins = "*")
public class TransferSimulationController {

    private final TransferSimulationService transferService;
    private final FeeCalculatorService feeCalculatorService;

    public TransferSimulationController(TransferSimulationService transferService,
                                        FeeCalculatorService feeCalculatorService) {
        this.transferService = transferService;
        this.feeCalculatorService = feeCalculatorService;
    }

    /**
     * Preview calculation without saving
     * POST /api/transfer/preview
     */
    @PostMapping("/preview")
    public ResponseEntity<CalculationPreviewResponse> previewTransfer(
            @Valid @RequestBody SimulationRequest request) {
        CalculationPreviewResponse preview = transferService.previewCalculation(request);
        return ResponseEntity.ok(preview);
    }

    /**
     * Create a new transfer simulation (saves to history)
     * POST /api/transfer/simulate
     */
    @PostMapping("/simulate")
    public ResponseEntity<SimulationResponse> createSimulation(
            @Valid @RequestBody SimulationRequest request,
            HttpServletRequest httpRequest) {
        String clientIp = getClientIp(httpRequest);
        String userAgent = httpRequest.getHeader("User-Agent");
        
        SimulationResponse response = transferService.createSimulation(request, clientIp, userAgent);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Get all transfer simulations (public history)
     * GET /api/transfer/history
     */
    @GetMapping("/history")
    public ResponseEntity<List<SimulationResponse>> getHistory() {
        List<SimulationResponse> history = transferService.getAllSimulations();
        return ResponseEntity.ok(history);
    }

    /**
     * Get a specific simulation by ID
     * GET /api/transfer/history/{id}
     */
    @GetMapping("/history/{id}")
    public ResponseEntity<SimulationResponse> getSimulationById(@PathVariable Long id) {
        SimulationResponse simulation = transferService.getSimulationById(id);
        return ResponseEntity.ok(simulation);
    }

    /**
     * Get current exchange rate
     * GET /api/transfer/exchange-rate
     */
    @GetMapping("/exchange-rate")
    public ResponseEntity<Map<String, Object>> getExchangeRate() {
        BigDecimal rate = transferService.getCurrentExchangeRate();
        return ResponseEntity.ok(Map.of(
                "base", "JPY",
                "target", "VND",
                "rate", rate,
                "description", "1 JPY = " + rate + " VND"
        ));
    }

    /**
     * Get fee structure
     * GET /api/transfer/fee-structure
     */
    @GetMapping("/fee-structure")
    public ResponseEntity<Map<String, Object>> getFeeStructure() {
        return ResponseEntity.ok(Map.of(
                "currency", "JPY",
                "tiers", List.of(
                        Map.of("minAmount", 100, "maxAmount", 10000, "fee", 100),
                        Map.of("minAmount", 10001, "maxAmount", 50000, "fee", 400),
                        Map.of("minAmount", 50001, "maxAmount", 100000, "fee", 700),
                        Map.of("minAmount", 100001, "maxAmount", "unlimited", "fee", 1000)
                )
        ));
    }

    /**
     * Calculate fee for a specific amount
     * GET /api/transfer/calculate-fee?amount={amountJpy}
     */
    @GetMapping("/calculate-fee")
    public ResponseEntity<Map<String, Object>> calculateFee(@RequestParam Long amount) {
        int fee = feeCalculatorService.calculateFee(amount);
        return ResponseEntity.ok(Map.of(
                "amount", amount,
                "fee", fee,
                "currency", "JPY"
        ));
    }

    private String getClientIp(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
