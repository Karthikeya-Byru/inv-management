package com.inventoryapp.repository;

import com.inventoryapp.model.Sale;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SaleRepository extends JpaRepository<Sale, Long> {
    List<Sale> findTop5ByOrderBySaleDateDesc();
}