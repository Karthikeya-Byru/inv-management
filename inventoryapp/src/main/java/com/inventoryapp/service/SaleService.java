package com.inventoryapp.service;

import com.inventoryapp.model.Sale;
import com.inventoryapp.model.SaleItem;
import com.inventoryapp.repository.ProductRepository;
import com.inventoryapp.repository.SaleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class SaleService {
    @Autowired
    private SaleRepository saleRepository;
    public List<Sale> getAllSales() {
        return saleRepository.findAll();
    }
    @Autowired
    private ProductRepository productRepository;

    public Sale saveSale(Sale sale) {
        sale.setSaleDate(LocalDateTime.now());

        double total = 0;
        for (SaleItem item : sale.getItems()) {
            item.setSale(sale); // Set parent
            total += item.getPrice() * item.getQuantity();
        }

        sale.setTotalAmount(total);
        return saleRepository.save(sale);
    }

    public void deleteSaleById(Long id) {
        saleRepository.deleteById(id);
    }
}