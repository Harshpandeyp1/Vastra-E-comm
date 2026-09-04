package com.Ecomm.prj.Controller;

import com.Ecomm.prj.Model.Product;
import com.Ecomm.prj.Service.ProductService;
import com.Ecomm.prj.Dto.ProductCatalogResponse;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:5173")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public List<Product> getAllProducts() {
        return productService.getAllProducts();
    }

    @GetMapping("/{id}")
    public Product getProductById(@PathVariable Long id) {
        return productService.getProductById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));
    }

    @GetMapping("/category/{category}")
    public List<Product> getProductsByCategory(@PathVariable String category) {
        if (category == null || category.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Category is required");
        }
        return productService.getProductsByCategory(category.trim());
    }

    @GetMapping("/gender/{gender}")
    public List<Product> getProductsByGender(@PathVariable String gender) {
        if (gender == null || gender.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Gender is required");
        }
        return productService.getProductsByGender(gender.trim());
    }

    @GetMapping("/catalog")
    public ProductCatalogResponse getProductCatalog() {
        return productService.getProductCatalog();
    }

    @GetMapping("/search")
    public List<Product> searchProducts(
            @RequestParam String category,
            @RequestParam BigDecimal maxPrice) {

        return productService.getProductsByCategoryAndMaxPrice(
                category,
                maxPrice
        );
    }
}
