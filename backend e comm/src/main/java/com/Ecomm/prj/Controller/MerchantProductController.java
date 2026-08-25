package com.Ecomm.prj.Controller;

import com.Ecomm.prj.Model.Merchant;
import com.Ecomm.prj.Model.Product;
import com.Ecomm.prj.Model.User;
import com.Ecomm.prj.Service.ProductService;
import com.Ecomm.prj.Dto.ProductRequest;
import com.Ecomm.prj.repository.MerchantRepo;
import com.Ecomm.prj.repository.UserRepo;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/merchant/products")
@CrossOrigin(origins = "http://localhost:5173")
public class MerchantProductController {

    private final ProductService productService;
    private final UserRepo userRepo;
    private final MerchantRepo merchantRepo;

    public MerchantProductController(
            ProductService productService,
            UserRepo userRepo,
            MerchantRepo merchantRepo) {

        this.productService = productService;
        this.userRepo = userRepo;
        this.merchantRepo = merchantRepo;
    }

    // ==========================================
    // GET ALL PRODUCTS OF LOGGED-IN MERCHANT
    // ==========================================

    @GetMapping
    public ResponseEntity<List<Product>> getMyProducts(
            Authentication authentication) {

        Merchant merchant = getMerchant(authentication);

        List<Product> products =
                productService.getMerchantProducts(merchant.getId());

        return ResponseEntity.ok(products);
    }


    // ==========================================
    // CREATE PRODUCT
    // ==========================================

    @PostMapping
    public ResponseEntity<Product> createProduct(
            @RequestBody ProductRequest request,
            Authentication authentication) {

        Merchant merchant = getMerchant(authentication);

        Product product = productService.createProduct(
                merchant.getId(),
                request.getName(),
                request.getImageUrl(),
                request.getPrice(),
                request.getCategory()
        );

        return ResponseEntity.ok(product);
    }


    // ==========================================
    // UPDATE PRODUCT
    // ==========================================

    @PutMapping("/{productId}")
    public ResponseEntity<Product> updateProduct(
            @PathVariable Long productId,
            @RequestBody ProductRequest request,
            Authentication authentication) {

        Merchant merchant = getMerchant(authentication);

        Product product = productService.updateProduct(
                merchant.getId(),
                productId,
                request.getName(),
                request.getImageUrl(),
                request.getPrice(),
                request.getCategory()
        );

        return ResponseEntity.ok(product);
    }


    // ==========================================
    // DELETE PRODUCT
    // ==========================================

    @DeleteMapping("/{productId}")
    public ResponseEntity<String> deleteProduct(
            @PathVariable Long productId,
            Authentication authentication) {

        Merchant merchant = getMerchant(authentication);

        productService.deleteProduct(
                merchant.getId(),
                productId
        );

        return ResponseEntity.ok("Product deleted successfully");
    }


    // ==========================================
    // FIND LOGGED-IN MERCHANT
    // ==========================================

    private Merchant getMerchant(Authentication authentication) {

        String email = authentication.getName();

        User user = userRepo.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        return merchantRepo.findByUserId(user.getId())
                .orElseThrow(() ->
                        new RuntimeException("Merchant profile not found"));
    }
}