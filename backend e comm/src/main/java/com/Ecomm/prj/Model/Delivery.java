
        package com.Ecomm.prj.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "deliveries")
public class Delivery {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // One delivery belongs to one order
    @OneToOne
    @JoinColumn(name = "order_id", nullable = false, unique = true)
    private Order order;

    // Pickup location
    private String pickupAddress;
    private Double pickupLatitude;
    private Double pickupLongitude;

    // Customer destination
    private String deliveryAddress;
    private Double deliveryLatitude;
    private Double deliveryLongitude;

    private String deliveryStatus;

    private String deliveryPartner;

    private BigDecimal deliveryCost;

    private LocalDate estimatedDeliveryDate;
}

