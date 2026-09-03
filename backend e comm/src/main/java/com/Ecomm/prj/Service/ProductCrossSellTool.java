package com.Ecomm.prj.Service;

import com.Ecomm.prj.Model.Product;
import com.Ecomm.prj.repository.ProductRepository;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ProductCrossSellTool {

    private final ProductRepository productRepository;

    public ProductCrossSellTool(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Tool(description = """
            Find complementary products for a selected Vastra product.

            Use this after the customer has shown interest in a specific
            product and may benefit from another product.

            The result must contain only real products from the Vastra database.

            Do not invent products or prices.
            """)
    public List<Product> findComplementaryProducts(Long productId) {

        Product selectedProduct = productRepository.findById(productId)
                .orElse(null);

        if (selectedProduct == null) {
            return List.of();
        }

        String gender = selectedProduct.getGender();

        if (gender == null || gender.isBlank()) {
            return productRepository.findTop6ByOrderByIdDesc();
        }

        return productRepository
                .findTop6ByGenderIgnoreCaseAndIdNot(
                        gender,
                        productId
                );
    }
}