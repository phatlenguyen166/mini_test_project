package com.example.demo.repository;

import com.example.demo.entity.TransferSimulation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransferSimulationRepository extends JpaRepository<TransferSimulation, Long> {
    
    List<TransferSimulation> findAllByOrderByCreatedAtDesc();
}
