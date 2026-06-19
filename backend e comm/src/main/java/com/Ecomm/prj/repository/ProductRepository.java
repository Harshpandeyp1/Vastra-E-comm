package com.Ecomm.prj.repository;

import com.Ecomm.prj.Model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByCategory(String category);

    List<Product> findTop6ByOrderByIdDesc();
}
