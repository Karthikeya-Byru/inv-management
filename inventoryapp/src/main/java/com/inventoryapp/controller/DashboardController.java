package com.inventoryapp.controller;

import com.inventoryapp.model.Sale;
import com.inventoryapp.model.Product;
import com.inventoryapp.repository.SaleRepository;
import com.inventoryapp.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private SaleRepository saleRepository;

    @Autowired
    private ProductRepository productRepository;

    @GetMapping
    public Map<String, Object> getDashboardData() {
        Map<String, Object> response = new HashMap<>();

        // Total sales count
        long totalSales = saleRepository.count();

        // Total revenue
        double totalRevenue = saleRepository.findAll().stream()
                .mapToDouble(Sale::getTotalAmount).sum();

        // Total products
        long totalProducts = productRepository.count();

        // Recent sales (last 5)
        List<Sale> recentSales = saleRepository.findTop5ByOrderBySaleDateDesc();

        // 🟩 Sales chart data: group by sale date and sum totals
        Map<String, Double> salesByDate = saleRepository.findAll().stream()
                .collect(Collectors.groupingBy(
                        sale -> sale.getSaleDate().toLocalDate().toString(),
                        Collectors.summingDouble(Sale::getTotalAmount)
                ));

        // Convert to list of maps for frontend
        List<Map<String, Object>> salesChart = salesByDate.entrySet().stream()
                .map(entry -> {
                    Map<String, Object> chartPoint = new HashMap<>();
                    chartPoint.put("date", entry.getKey());
                    chartPoint.put("total", entry.getValue());
                    return chartPoint;
                })
                .sorted(Comparator.comparing(m -> m.get("date").toString()))
                .collect(Collectors.toList());

        // Add everything to response
        response.put("totalSales", totalSales);
        response.put("totalRevenue", totalRevenue);
        response.put("totalProducts", totalProducts);
        response.put("recentSales", recentSales);
        response.put("salesChart", salesChart); // ✅ This enables your frontend chart

        return response;
    }
}