
        package com.Ecomm.prj.Service;

import com.Ecomm.prj.Dto.BusinessInsightProduct;
import com.Ecomm.prj.Dto.BusinessProfitProduct;
import com.Ecomm.prj.Model.Merchant;
import com.Ecomm.prj.repository.MerchantRepo;
import com.Ecomm.prj.repository.OrderItemRepo;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class BusinessInsightsService {

    private final OrderItemRepo orderItemRepository;
    private final MerchantRepo merchantRepo;

    public BusinessInsightsService(
            OrderItemRepo orderItemRepository,
            MerchantRepo merchantRepo) {

        this.orderItemRepository = orderItemRepository;
        this.merchantRepo = merchantRepo;
    }


    // =========================================================
    // 1. BEST-SELLING PRODUCTS
    // =========================================================

    public List<BusinessInsightProduct> getBestSellingProducts(
            String merchantEmail) {

        // Find the merchant using the email
        // obtained from the JWT
        Merchant merchant =
                merchantRepo.findByUserEmail(merchantEmail)
                        .orElseThrow(() ->
                                new ResponseStatusException(
                                        HttpStatus.NOT_FOUND,
                                        "Merchant account not found"
                                )
                        );

        // Get merchant ID
        Long merchantId = merchant.getId();

        // Get best-selling products
        return orderItemRepository
                .findBestSellingProducts(merchantId);
    }


    // =========================================================
    // 2. MOST PROFITABLE PRODUCTS
    // =========================================================

    public List<BusinessProfitProduct> getMostProfitableProducts(
            String merchantEmail) {

        // Find the merchant using the email
        // obtained from the JWT
        Merchant merchant =
                merchantRepo.findByUserEmail(merchantEmail)
                        .orElseThrow(() ->
                                new ResponseStatusException(
                                        HttpStatus.NOT_FOUND,
                                        "Merchant account not found"
                                )
                        );

        // Get merchant ID
        Long merchantId = merchant.getId();

        // Get most profitable products
        return orderItemRepository
                .findMostProfitableProducts(merchantId);
    }
}

