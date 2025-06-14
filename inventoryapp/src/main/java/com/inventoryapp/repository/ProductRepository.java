package com.inventoryapp.repository;

import java.util.List;
import com.inventoryapp.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByQuantityLessThanAndQuantityIsNotNull(int threshold);
}
