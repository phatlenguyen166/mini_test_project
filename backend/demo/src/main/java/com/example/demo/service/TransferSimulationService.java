package com.example.demo.service;

import com.example.demo.dto.CalculationPreviewResponse;
import com.example.demo.dto.SimulationRequest;
import com.example.demo.dto.SimulationResponse;
import com.example.demo.entity.TransferSimulation;
import com.example.demo.repository.TransferSimulationRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TransferSimulationService {

    private static final Logger logger = LoggerFactory.getLogger(TransferSimulationService.class);

    private final TransferSimulationRepository repository;
    private final ExchangeRateService exchangeRateService;
    private final FeeCalculatorService feeCalculatorService;

    public TransferSimulationService(TransferSimulationRepository repository,
                                     ExchangeRateService exchangeRateService,
                                     FeeCalculatorService feeCalculatorService) {
        this.repository = repository;
        this.exchangeRateService = exchangeRateService;
        this.feeCalculatorService = feeCalculatorService;
    }

    /**
     * Preview calculation without saving
     */
    public CalculationPreviewResponse previewCalculation(SimulationRequest request) {
        // Validate request based on input mode
        request.validate();
        
        BigDecimal jpyToVndRate = exchangeRateService.getJpyToVndRate();
        
        long sendAmountJpy;
        long receiveAmountVnd;
        int feeJpy;
        long netAmountJpy;

        if (request.getInputMode() == SimulationRequest.InputMode.JPY_INPUT) {
            // User enters JPY amount
            sendAmountJpy = request.getSendAmountJpy();
            feeJpy = feeCalculatorService.calculateFee(sendAmountJpy);
            netAmountJpy = sendAmountJpy - feeJpy;
            
            // Convert net JPY to VND
            receiveAmountVnd = BigDecimal.valueOf(netAmountJpy)
                    .multiply(jpyToVndRate)
                    .setScale(0, RoundingMode.DOWN)
                    .longValue();
        } else {
            // User enters VND amount they want recipient to receive
            receiveAmountVnd = request.getReceiveAmountVnd();
            
            // Calculate how much JPY is needed (before fee)
            BigDecimal vndToJpyRate = exchangeRateService.getVndToJpyRate();
            netAmountJpy = BigDecimal.valueOf(receiveAmountVnd)
                    .multiply(vndToJpyRate)
                    .setScale(0, RoundingMode.UP)
                    .longValue();
            
            // Estimate initial fee and iterate to find correct total
            feeJpy = feeCalculatorService.calculateFee(netAmountJpy + 100); // Initial estimate
            sendAmountJpy = netAmountJpy + feeJpy;
            
            // Recalculate fee based on total amount
            int newFee = feeCalculatorService.calculateFee(sendAmountJpy);
            while (newFee != feeJpy) {
                feeJpy = newFee;
                sendAmountJpy = netAmountJpy + feeJpy;
                newFee = feeCalculatorService.calculateFee(sendAmountJpy);
            }
        }

        return new CalculationPreviewResponse(sendAmountJpy, receiveAmountVnd, feeJpy, jpyToVndRate, netAmountJpy);
    }

    /**
     * Create and save a new transfer simulation
     */
    @Transactional
    public SimulationResponse createSimulation(SimulationRequest request, String clientIp, String userAgent) {
        CalculationPreviewResponse preview = previewCalculation(request);
        
        TransferSimulation simulation = new TransferSimulation();
        simulation.setSendAmountJpy(preview.getSendAmountJpy());
        simulation.setReceiveAmountVnd(preview.getReceiveAmountVnd());
        simulation.setFeeJpy(preview.getFeeJpy());
        simulation.setRateJpyToVnd(preview.getRateJpyToVnd());
        simulation.setInputMode(mapInputMode(request.getInputMode()));
        simulation.setClientIp(clientIp);
        simulation.setUserAgent(truncateUserAgent(userAgent));

        TransferSimulation saved = repository.save(simulation);
        logger.info("Created simulation ID: {}, JPY: {}, VND: {}, Fee: {}", 
                saved.getId(), saved.getSendAmountJpy(), saved.getReceiveAmountVnd(), saved.getFeeJpy());

        return mapToResponse(saved);
    }

    /**
     * Get all simulations ordered by creation date (newest first)
     */
    public List<SimulationResponse> getAllSimulations() {
        return repository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get a specific simulation by ID
     */
    public SimulationResponse getSimulationById(Long id) {
        return repository.findById(id)
                .map(this::mapToResponse)
                .orElseThrow(() -> new RuntimeException("Simulation not found with ID: " + id));
    }

    /**
     * Get current exchange rate
     */
    public BigDecimal getCurrentExchangeRate() {
        return exchangeRateService.getJpyToVndRate();
    }

    private TransferSimulation.InputMode mapInputMode(SimulationRequest.InputMode mode) {
        return switch (mode) {
            case JPY_INPUT -> TransferSimulation.InputMode.JPY_INPUT;
            case VND_INPUT -> TransferSimulation.InputMode.VND_INPUT;
        };
    }

    private SimulationResponse mapToResponse(TransferSimulation simulation) {
        return new SimulationResponse(
                simulation.getId(),
                simulation.getCreatedAt(),
                simulation.getSendAmountJpy(),
                simulation.getReceiveAmountVnd(),
                simulation.getFeeJpy(),
                simulation.getRateJpyToVnd(),
                simulation.getInputMode().name()
        );
    }

    private String truncateUserAgent(String userAgent) {
        if (userAgent == null) return null;
        return userAgent.length() > 255 ? userAgent.substring(0, 255) : userAgent;
    }
}
