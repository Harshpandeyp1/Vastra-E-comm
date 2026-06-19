package com.Ecomm.prj.Service;

import com.Ecomm.prj.Model.Product;
import com.Ecomm.prj.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {
    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public List<Product> getProductsByCategory(String category) {
        return productRepository.findByCategory(category);
    }

    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }
}
