package com.Ecomm.prj.Service;

import com.Ecomm.prj.Model.Delivery;
import com.Ecomm.prj.Model.Merchant;
import com.Ecomm.prj.Model.Order;
import com.Ecomm.prj.repository.DeliveryRepository;
import com.Ecomm.prj.repository.orderrepo;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
public class DeliveryService {

    private final GeocodingService geocodingService;
    private final DeliveryRepository deliveryRepository;
    private final orderrepo orderRepository;

    public DeliveryService(
            GeocodingService geocodingService,
            DeliveryRepository deliveryRepository,
            orderrepo orderRepository) {

        this.geocodingService = geocodingService;
        this.deliveryRepository = deliveryRepository;
        this.orderRepository = orderRepository;
    }

    @Transactional
    public Delivery shipOrder(
            int orderId,
            Merchant merchant) {

        // 1. Find order
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() ->
                        new RuntimeException("Order not found"));

        // 2. Check merchant ownership
        boolean belongsToMerchant = order.getOrderItems()
                .stream()
                .allMatch(item ->
                        item.getProduct()
                                .getMerchant()
                                .getId()
                                .equals(merchant.getId())
                );

        if (!belongsToMerchant) {
            throw new RuntimeException(
                    "This order does not belong to this merchant"
            );
        }

        // 3. Only PROCESSING orders can be shipped
        if (!order.getStatus().equalsIgnoreCase("PROCESSING")) {
            throw new RuntimeException(
                    "Only processing orders can be shipped"
            );
        }

        // 4. Prevent duplicate delivery
        if (deliveryRepository.findByOrder_Id(orderId).isPresent()) {
            throw new RuntimeException(
                    "Delivery already exists for this order"
            );
        }

        // 5. Create delivery
        Delivery delivery = new Delivery();

        delivery.setOrder(order);

        // Merchant pickup address
        delivery.setPickupAddress(
                merchant.getAddress()
        );

        // Customer delivery address
        delivery.setDeliveryAddress(
                order.getAddress()
        );

        // 6. Geocode pickup address
        var pickupCoordinates =
                geocodingService.getCoordinates(
                        merchant.getAddress()
                );

        // 7. Geocode customer address
        var deliveryCoordinates =
                geocodingService.getCoordinates(
                        order.getAddress()
                );

        // 8. Save pickup coordinates
        delivery.setPickupLatitude(
                pickupCoordinates.getLatitude()
        );

        delivery.setPickupLongitude(
                pickupCoordinates.getLongitude()
        );

        // 9. Save delivery coordinates
        delivery.setDeliveryLatitude(
                deliveryCoordinates.getLatitude()
        );

        delivery.setDeliveryLongitude(
                deliveryCoordinates.getLongitude()
        );

        // 10. Initial delivery state
        delivery.setDeliveryStatus("READY");

        // Partner assigned later
        delivery.setDeliveryPartner(null);

        // Calculated during optimization
        delivery.setDeliveryCost(null);

        // Calculated after assignment
        delivery.setEstimatedDeliveryDate(null);

        // 11. Change order status
        order.setStatus("SHIPPED");

        orderRepository.save(order);

        // 12. Save delivery
        return deliveryRepository.save(delivery);
    }


    public List<Delivery> getPendingDeliveries(Long merchantId) {

        return deliveryRepository.findDeliveriesForMerchantByStatus(
                "READY",
                merchantId
        );
    }


    @Transactional
    public Delivery acceptAndAssignDelivery(
            Long deliveryId,
            String partnerName,
            BigDecimal deliveryCost,
            Integer estimatedDays,
            Merchant merchant) {

        // 1. Find delivery
        Delivery delivery = deliveryRepository.findById(deliveryId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Delivery not found"
                        )
                );

        // 2. Check merchant ownership
        boolean belongsToMerchant = delivery.getOrder()
                .getOrderItems()
                .stream()
                .allMatch(item ->
                        item.getProduct()
                                .getMerchant()
                                .getId()
                                .equals(merchant.getId())
                );

        if (!belongsToMerchant) {
            throw new RuntimeException(
                    "This delivery does not belong to this merchant"
            );
        }

        // 3. Delivery must still be READY
        if (!"READY".equalsIgnoreCase(
                delivery.getDeliveryStatus())) {

            throw new RuntimeException(
                    "This delivery has already been assigned"
            );
        }

        // 4. Validate partner
        if (partnerName == null ||
                partnerName.trim().isEmpty()) {

            throw new RuntimeException(
                    "Delivery partner is required"
            );
        }

        // 5. Validate cost
        if (deliveryCost == null ||
                deliveryCost.compareTo(BigDecimal.ZERO) < 0) {

            throw new RuntimeException(
                    "Invalid delivery cost"
            );
        }

        // 6. Validate estimated days
        if (estimatedDays == null ||
                estimatedDays <= 0) {

            throw new RuntimeException(
                    "Invalid estimated delivery time"
            );
        }

        // 7. Assign partner
        delivery.setDeliveryPartner(
                partnerName
        );

        // 8. Save delivery cost
        delivery.setDeliveryCost(
                deliveryCost
        );

        // 9. Calculate estimated delivery date
        delivery.setEstimatedDeliveryDate(
                LocalDate.now().plusDays(estimatedDays)
        );

        // 10. Change lifecycle
        delivery.setDeliveryStatus("ONGOING");

        // 11. Save
        return deliveryRepository.save(delivery);
    }
    public List<Delivery> getOngoingDeliveries(Long merchantId) {

        return deliveryRepository.findDeliveriesForMerchantByStatus(
                "ONGOING",
                merchantId
        );
    }


    public List<Delivery> getDeliveredDeliveries(Long merchantId) {

        return deliveryRepository.findDeliveriesForMerchantByStatus(
                "DELIVERED",
                merchantId
        );
    }
    @Transactional
    public Delivery markAsDelivered(
            int orderId,
            Merchant merchant) {

        // 1. Find delivery using order ID
        Delivery delivery = deliveryRepository.findByOrder_Id(orderId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Delivery not found for this order"
                        )
                );

        // 2. Check merchant ownership
        boolean belongsToMerchant = delivery.getOrder()
                .getOrderItems()
                .stream()
                .allMatch(item ->
                        item.getProduct()
                                .getMerchant()
                                .getId()
                                .equals(merchant.getId())
                );

        if (!belongsToMerchant) {
            throw new RuntimeException(
                    "This delivery does not belong to this merchant"
            );
        }

        // 3. Delivery must currently be ONGOING
        if (!"ONGOING".equalsIgnoreCase(
                delivery.getDeliveryStatus())) {

            throw new RuntimeException(
                    "Only ongoing deliveries can be marked as delivered"
            );
        }

        // 4. Update delivery status
        delivery.setDeliveryStatus("DELIVERED");

        // 5. Update order status
        Order order = delivery.getOrder();
        order.setStatus("DELIVERED");

        orderRepository.save(order);

        // 6. Save delivery
        return deliveryRepository.save(delivery);
    }
}