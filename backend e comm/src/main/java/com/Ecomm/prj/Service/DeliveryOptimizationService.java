 package com.Ecomm.prj.Service;

import com.Ecomm.prj.Dto.DeliveryOptimizationResponse;
import com.Ecomm.prj.Dto.DeliveryPartnerOption;
import com.Ecomm.prj.Model.Delivery;
import com.Ecomm.prj.Model.DeliveryPartner;
import com.Ecomm.prj.Model.Merchant;
import com.Ecomm.prj.repository.DeliveryPartnerRepository;
import com.Ecomm.prj.repository.DeliveryRepository;
import com.Ecomm.prj.repository.MerchantRepo;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
public class DeliveryOptimizationService {

    private final DeliveryRepository deliveryRepository;
    private final DeliveryPartnerRepository deliveryPartnerRepository;
    private final DistanceService distanceService;
    private final MerchantRepo merchantRepo;
    private final DeliveryAIExplanationService deliveryAIExplanationService;

    public DeliveryOptimizationService(
            DeliveryRepository deliveryRepository,
            DeliveryPartnerRepository deliveryPartnerRepository,
            DistanceService distanceService,
            MerchantRepo merchantRepo,
            DeliveryAIExplanationService deliveryAIExplanationService) {

        this.deliveryRepository = deliveryRepository;
        this.deliveryPartnerRepository = deliveryPartnerRepository;
        this.distanceService = distanceService;
        this.merchantRepo = merchantRepo;
        this.deliveryAIExplanationService = deliveryAIExplanationService;
    }

    @Transactional
    public DeliveryOptimizationResponse optimizeDelivery(
            Long deliveryId) {

        // =========================================================
        // 1. GET LOGGED-IN MERCHANT
        // =========================================================

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        if (authentication == null ||
                !authentication.isAuthenticated()) {

            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Merchant is not authenticated"
            );
        }

        String email = authentication.getName();

        Merchant merchant =
                merchantRepo.findByUserEmail(email)
                        .orElseThrow(() ->
                                new ResponseStatusException(
                                        HttpStatus.NOT_FOUND,
                                        "Merchant account not found"
                                ));

        Long merchantId = merchant.getId();


        // =========================================================
        // 2. FIND DELIVERY
        // =========================================================

        Delivery delivery =
                deliveryRepository
                        .findDeliveryForOptimization(deliveryId)
                        .orElseThrow(() ->
                                new ResponseStatusException(
                                        HttpStatus.NOT_FOUND,
                                        "Delivery not found"
                                ));


        // =========================================================
        // 3. CHECK MERCHANT OWNERSHIP
        // =========================================================

        boolean belongsToMerchant =
                delivery.getOrder()
                        .getOrderItems()
                        .stream()
                        .allMatch(item ->
                                item.getProduct()
                                        .getMerchant()
                                        .getId()
                                        .equals(merchantId)
                        );

        if (!belongsToMerchant) {

            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "This delivery does not belong to this merchant"
            );
        }


        // =========================================================
        // 4. GET DELIVERY COORDINATES
        // =========================================================

        Double pickupLatitude =
                delivery.getPickupLatitude();

        Double pickupLongitude =
                delivery.getPickupLongitude();

        Double deliveryLatitude =
                delivery.getDeliveryLatitude();

        Double deliveryLongitude =
                delivery.getDeliveryLongitude();


        // =========================================================
        // 5. VALIDATE COORDINATES
        // =========================================================

        if (pickupLatitude == null ||
                pickupLongitude == null ||
                deliveryLatitude == null ||
                deliveryLongitude == null) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Delivery coordinates are not available"
            );
        }


        // =========================================================
        // 6. CALCULATE DISTANCE
        // =========================================================

        double distance =
                distanceService.calculateDistance(
                        pickupLatitude,
                        pickupLongitude,
                        deliveryLatitude,
                        deliveryLongitude
                );


        // =========================================================
        // 7. GET AVAILABLE DELIVERY PARTNERS
        // =========================================================

        List<DeliveryPartner> partners =
                deliveryPartnerRepository
                        .findByAvailableTrue();

        if (partners.isEmpty()) {

            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "No delivery partners are currently available"
            );
        }


        // =========================================================
        // 8. GET ORDER VALUE
        // =========================================================

        BigDecimal orderValue =
                delivery.getOrder().getTotalAmount();


        // =========================================================
        // 9. CALCULATE TOTAL PRODUCT COST
        // =========================================================

        BigDecimal productCost =
                BigDecimal.ZERO;

        for (var item :
                delivery.getOrder().getOrderItems()) {

            if (item.getProduct().getCostPrice() == null) {

                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Cost price is missing for product: "
                                + item.getProduct().getName()
                );
            }

            BigDecimal itemCost =
                    item.getProduct()
                            .getCostPrice()
                            .multiply(
                                    BigDecimal.valueOf(
                                            item.getQuantity()
                                    )
                            );

            productCost =
                    productCost.add(itemCost);
        }

        productCost =
                productCost.setScale(
                        2,
                        RoundingMode.HALF_UP
                );


        // =========================================================
        // 10. GROSS PROFIT BEFORE DELIVERY
        // =========================================================

        BigDecimal grossProfit =
                orderValue
                        .subtract(productCost)
                        .setScale(
                                2,
                                RoundingMode.HALF_UP
                        );


        // =========================================================
        // 11. EVALUATE EVERY DELIVERY PARTNER
        // =========================================================

        List<DeliveryPartnerCalculation> calculations =
                new ArrayList<>();

        for (DeliveryPartner partner : partners) {

            // -----------------------------------------------------
            // DELIVERY COST
            // -----------------------------------------------------

            BigDecimal distanceCost =
                    partner.getCostPerKm()
                            .multiply(
                                    BigDecimal.valueOf(distance)
                            );

            BigDecimal totalCost =
                    partner.getBaseCost()
                            .add(distanceCost)
                            .setScale(
                                    2,
                                    RoundingMode.HALF_UP
                            );


            // -----------------------------------------------------
            // MERCHANT PROFIT AFTER DELIVERY
            // -----------------------------------------------------

            BigDecimal merchantProfit =
                    grossProfit
                            .subtract(totalCost)
                            .setScale(
                                    2,
                                    RoundingMode.HALF_UP
                            );

            calculations.add(
                    new DeliveryPartnerCalculation(
                            partner,
                            totalCost,
                            merchantProfit
                    )
            );
        }


        // =========================================================
        // 12. FIND MIN/MAX VALUES FOR NORMALIZATION
        // =========================================================

        BigDecimal highestProfit =
                calculations.stream()
                        .map(
                                DeliveryPartnerCalculation
                                        ::merchantProfit
                        )
                        .max(BigDecimal::compareTo)
                        .orElse(BigDecimal.ZERO);

        BigDecimal lowestCost =
                calculations.stream()
                        .map(
                                DeliveryPartnerCalculation
                                        ::totalCost
                        )
                        .min(BigDecimal::compareTo)
                        .orElse(BigDecimal.ZERO);

        int fastestDays =
                calculations.stream()
                        .mapToInt(
                                calculation ->
                                        calculation.partner()
                                                .getEstimatedDays()
                        )
                        .min()
                        .orElse(1);


        // =========================================================
        // 13. CREATE NORMALIZED OPTIONS
        // =========================================================

        List<DeliveryPartnerOption> options =
                new ArrayList<>();

        for (DeliveryPartnerCalculation calculation :
                calculations) {

            DeliveryPartner partner =
                    calculation.partner();

            BigDecimal totalCost =
                    calculation.totalCost();

            BigDecimal merchantProfit =
                    calculation.merchantProfit();


            // -----------------------------------------------------
            // PROFIT SCORE
            // -----------------------------------------------------

            double profitScore;

            if (highestProfit.compareTo(BigDecimal.ZERO) > 0) {

                if (merchantProfit.compareTo(BigDecimal.ZERO) <= 0) {

                    profitScore = 0.0;

                } else {

                    profitScore =
                            merchantProfit.doubleValue()
                                    / highestProfit.doubleValue()
                                    * 100.0;
                }

            } else {

                // If every partner causes a loss,
                // the least-loss partner gets the highest score.

                double worstLoss =
                        calculations.stream()
                                .map(
                                        DeliveryPartnerCalculation
                                                ::merchantProfit
                                )
                                .min(BigDecimal::compareTo)
                                .orElse(BigDecimal.ZERO)
                                .doubleValue();

                if (worstLoss ==
                        highestProfit.doubleValue()) {

                    profitScore = 100.0;

                } else {

                    double range =
                            highestProfit.doubleValue()
                                    - worstLoss;

                    profitScore =
                            (merchantProfit.doubleValue()
                                    - worstLoss)
                                    / range
                                    * 100.0;
                }
            }


            // -----------------------------------------------------
            // COST SCORE
            // -----------------------------------------------------

            double costScore;

            if (totalCost.compareTo(lowestCost) == 0) {

                costScore = 100.0;

            } else {

                double highestCost =
                        calculations.stream()
                                .map(
                                        DeliveryPartnerCalculation
                                                ::totalCost
                                )
                                .max(BigDecimal::compareTo)
                                .orElse(totalCost)
                                .doubleValue();

                double costRange =
                        highestCost
                                - lowestCost.doubleValue();

                if (costRange == 0) {

                    costScore = 100.0;

                } else {

                    costScore =
                            (highestCost
                                    - totalCost.doubleValue())
                                    / costRange
                                    * 100.0;
                }
            }


            // -----------------------------------------------------
            // SPEED SCORE
            // -----------------------------------------------------

            double speedScore;

            if (partner.getEstimatedDays() == fastestDays) {

                speedScore = 100.0;

            } else {

                int slowestDays =
                        calculations.stream()
                                .mapToInt(
                                        item ->
                                                item.partner()
                                                        .getEstimatedDays()
                                )
                                .max()
                                .orElse(fastestDays);

                if (slowestDays == fastestDays) {

                    speedScore = 100.0;

                } else {

                    speedScore =
                            ((double) slowestDays
                                    - partner.getEstimatedDays())
                                    / (slowestDays - fastestDays)
                                    * 100.0;
                }
            }


            // -----------------------------------------------------
            // RELIABILITY SCORE
            // -----------------------------------------------------

            double reliabilityScore =
                    partner.getReliabilityScore();


            // -----------------------------------------------------
            // FINAL OPTIMIZATION SCORE
            //
            // Profit       = 50%
            // Cost         = 20%
            // Speed        = 10%
            // Reliability  = 20%
            // -----------------------------------------------------

            double optimizationScore =
                    (profitScore * 0.50)
                            + (costScore * 0.20)
                            + (speedScore * 0.10)
                            + (reliabilityScore * 0.20);


            // -----------------------------------------------------
            // CREATE OPTION
            // -----------------------------------------------------

            DeliveryPartnerOption option =
                    new DeliveryPartnerOption(
                            partner.getName(),
                            totalCost,
                            partner.getEstimatedDays(),
                            partner.getReliabilityScore(),
                            optimizationScore,
                            merchantProfit
                    );

            options.add(option);
        }


        // =========================================================
        // 14. SELECT BEST PARTNER
        // =========================================================

        List<DeliveryPartnerOption> profitablePartners =
                options.stream()
                        .filter(option ->
                                option.getMerchantProfit()
                                        .compareTo(
                                                BigDecimal.ZERO
                                        ) >= 0
                        )
                        .toList();

        DeliveryPartnerOption bestPartner;


        if (!profitablePartners.isEmpty()) {

            /*
             * At least one delivery partner
             * keeps the order profitable.
             *
             * Choose the partner with
             * the highest optimization score.
             */

            bestPartner =
                    profitablePartners.stream()
                            .max(
                                    Comparator.comparing(
                                            DeliveryPartnerOption
                                                    ::getOptimizationScore
                                    )
                            )
                            .orElseThrow();

        } else {

            /*
             * If every partner causes a loss,
             * choose the partner producing
             * the smallest loss.
             */

            bestPartner =
                    options.stream()
                            .max(
                                    Comparator.comparing(
                                            DeliveryPartnerOption
                                                    ::getMerchantProfit
                                    )
                            )
                            .orElseThrow();
        }


        // =========================================================
        // 15. RISK WARNING
        // =========================================================

        String riskWarning;

        if (bestPartner.getMerchantProfit()
                .compareTo(BigDecimal.ZERO) < 0) {

            riskWarning =
                    "High Risk: This order is unprofitable after "
                            + "product and delivery costs. "
                            + "The recommended partner minimizes "
                            + "the merchant loss, but assigning this "
                            + "delivery will still result in a loss "
                            + "of ₹"
                            + bestPartner
                            .getMerchantProfit()
                            .abs();

        } else {

            riskWarning =
                    "Low Risk: The recommended delivery partner "
                            + "keeps the order profitable after "
                            + "product and delivery costs.";
        }


        // =========================================================
        // 16. CALCULATE MERCHANT SAVING
        // =========================================================

        BigDecimal merchantSaving =
                BigDecimal.ZERO;

        for (DeliveryPartnerOption option : options) {

            if (!option.getPartnerName()
                    .equals(bestPartner.getPartnerName())) {

                BigDecimal saving =
                        option.getEstimatedCost()
                                .subtract(
                                        bestPartner
                                                .getEstimatedCost()
                                );

                if (saving.compareTo(
                        merchantSaving) > 0) {

                    merchantSaving = saving;
                }
            }
        }

        merchantSaving =
                merchantSaving.setScale(
                        2,
                        RoundingMode.HALF_UP
                );


        // =========================================================
        // 17. PROFIT IMPACT
        // =========================================================

        BigDecimal profitImpact =
                bestPartner.getMerchantProfit();


        // =========================================================
        // 18. BACKEND REASON
        // =========================================================

        String reason;

        if (profitablePartners.isEmpty()) {

            reason =
                    "No profitable delivery partner is currently "
                            + "available for this order. "
                            + "Recommended "
                            + bestPartner.getPartnerName()
                            + " because it minimizes the estimated "
                            + "merchant loss. "
                            + "Calculated distance: "
                            + String.format(
                            "%.2f",
                            distance
                    )
                            + " km. "
                            + "Estimated merchant loss after delivery: ₹"
                            + bestPartner
                            .getMerchantProfit()
                            .abs();

        } else {

            reason =
                    "Recommended "
                            + bestPartner.getPartnerName()
                            + " because it provides the best balance "
                            + "of merchant profit, delivery cost, speed, "
                            + "and reliability. "
                            + "Calculated distance: "
                            + String.format(
                            "%.2f",
                            distance
                    )
                            + " km. "
                            + "Estimated merchant profit after delivery: ₹"
                            + bestPartner.getMerchantProfit();
        }


        // =========================================================
        // 19. CREATE RESPONSE
        // =========================================================

        DeliveryOptimizationResponse response =
                new DeliveryOptimizationResponse(
                        deliveryId,
                        bestPartner.getPartnerName(),
                        bestPartner.getEstimatedCost(),
                        bestPartner.getEstimatedDays(),
                        bestPartner.getReliabilityScore(),
                        orderValue,
                        merchantSaving,
                        profitImpact,
                        reason,
                        riskWarning,
                        null,
                        options
                );


        // =========================================================
        // 20. SPRING AI EXPLANATION
        // =========================================================

        String aiExplanation =
                deliveryAIExplanationService
                        .generateExplanation(response);

        response.setAiExplanation(
                aiExplanation
        );


        // =========================================================
        // 21. RETURN RESPONSE
        // =========================================================

        return response;
    }


    // =============================================================
    // INTERNAL CALCULATION RECORD
    // =============================================================

    private record DeliveryPartnerCalculation(
            DeliveryPartner partner,
            BigDecimal totalCost,
            BigDecimal merchantProfit
    ) {
    }
}

