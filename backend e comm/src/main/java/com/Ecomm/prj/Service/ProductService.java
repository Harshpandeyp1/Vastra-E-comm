package com.Ecomm.prj.Service;

import com.Ecomm.prj.Model.Merchant;
import com.Ecomm.prj.Model.Product;
import com.Ecomm.prj.repository.MerchantRepo;
import com.Ecomm.prj.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final MerchantRepo merchantRepo;

    public ProductService(ProductRepository productRepository,
                          MerchantRepo merchantRepo) {
        this.productRepository = productRepository;
        this.merchantRepo = merchantRepo;
    }

    // =========================
    // CUSTOMER METHODS
    // =========================

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public List<Product> getProductsByCategory(String category) {
        return productRepository.findByCategory(category);
    }

    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }


    // =========================
    // MERCHANT METHODS
    // =========================

    public List<Product> getMerchantProducts(Long merchantId) {
        return productRepository.findByMerchantId(merchantId);
    }


    public Product createProduct(
            Long merchantId,
            String name,
            String imageUrl,
            Double price,
            String category) {

        Merchant merchant = merchantRepo.findById(merchantId)
                .orElseThrow(() ->
                        new RuntimeException("Merchant not found"));

        Product product = new Product();

        product.setName(name);
        product.setImageUrl(imageUrl);
        product.setPrice(price);
        product.setCategory(category);
        product.setMerchant(merchant);

        return productRepository.save(product);
    }


    public Product updateProduct(
            Long merchantId,
            Long productId,
            String name,
            String imageUrl,
            Double price,
            String category) {

        Product product = findMerchantProductOrThrow(merchantId, productId);

        product.setName(name);
        product.setImageUrl(imageUrl);
        product.setPrice(price);
        product.setCategory(category);

        return productRepository.save(product);
    }


    public void deleteProduct(
            Long merchantId,
            Long productId) {

        Product product = findMerchantProductOrThrow(merchantId, productId);

        productRepository.delete(product);
    }

    private Product findMerchantProductOrThrow(Long merchantId, Long productId) {
        List<Product> products = productRepository.findByMerchantIdAndId(merchantId, productId);
        if (products.isEmpty()) {
            throw new RuntimeException("Product not found or does not belong to this merchant");
        }
        return products.get(0);
    }
}
