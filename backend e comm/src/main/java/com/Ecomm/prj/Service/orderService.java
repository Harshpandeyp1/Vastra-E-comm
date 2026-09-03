package com.Ecomm.prj.Service;

import com.Ecomm.prj.Dto.orderDto;
import com.Ecomm.prj.Model.*;
import com.Ecomm.prj.repository.CartRepo;
import com.Ecomm.prj.repository.UserRepo;
import com.Ecomm.prj.repository.orderrepo;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class orderService {

    private final orderrepo orderrepo;
    private final UserRepo userrepo;
    private final CartRepo cartRepo;

    public orderService(orderrepo orderrepo, UserRepo userrepo, CartRepo cartRepo) {
        this.orderrepo = orderrepo;
        this.userrepo = userrepo;
        this.cartRepo = cartRepo;
    }

    @Transactional
    public Order placeOrder(orderDto orderdto){
        if (orderdto == null) {
            throw new RuntimeException("Order request is required");
        }
        List<Cart> cartItems = cartRepo.findByUserId(orderdto.getUserId());
        if (cartItems.isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        User user = userrepo.findById((long) orderdto.getUserId())
                .orElseThrow(() -> new RuntimeException("user not found"));

        Order order = new Order();
        List<OrderItem> orderItems = new ArrayList<>();
        BigDecimal total = BigDecimal.ZERO;

        order.setUser(user);
        order.setOrderdate(LocalDate.now());
        order.setStatus("placed");
        order.setAddress(orderdto.getAddress());

        for (Cart item : cartItems) {
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(item.getProduct());
            orderItem.setQuantity(item.getQuantity());

            BigDecimal itemTotal = item.getProduct().getPrice()
                    .multiply(BigDecimal.valueOf(item.getQuantity()));
            orderItem.setPrice(itemTotal);
            orderItems.add(orderItem);
            total = total.add(itemTotal);
        }

        order.setOrderItems(orderItems);
        order.setTotalAmount(total);
        Order savedOrder = orderrepo.save(order);
        cartRepo.deleteAll(cartItems);
        System.out.println("[orderService] Order placed and cart cleared for userId = " + orderdto.getUserId());
        return savedOrder;
    }

    public List<Order> getOrdersByUserId(int userId) {
        User user = userrepo.findById((long) userId)
                .orElseThrow(() -> new RuntimeException("user not found"));

        return orderrepo.findByUser_Id(user.getId());
    }

    public List<Order> getOrdersByMerchantId(Long merchantId) {

        return orderrepo.findDistinctByOrderItems_Product_Merchant_Id(merchantId);
    }

    public Order confirmOrder(int orderId,Long merchantId){

        Order order = orderrepo.findOrderForMerchant(orderId)
                .orElseThrow(() ->
                        new RuntimeException("Order not found"));



        boolean belongsToMerchant=order.getOrderItems()
                .stream()
                .allMatch(item->
                        item.getProduct()
                                .getMerchant()
                                .getId()
                                .equals(merchantId));
        if (!belongsToMerchant)
        { throw new RuntimeException( "This order does not belong to this merchant" );
        }
        if (!order.getStatus().equalsIgnoreCase("placed"))
        { throw new RuntimeException( "Only placed orders can be confirmed" );
        }

        order.setStatus("CONFIRMED");
        return orderrepo.save(order);
    }

    @Transactional
    public Order startProcessing(int orderId, Long merchantId) {

        // 1. Find the order
        Order order = orderrepo.findById(orderId)
                .orElseThrow(() ->
                        new RuntimeException("Order not found"));

        // 2. Check that this order belongs to this merchant
        boolean belongsToMerchant = order.getOrderItems()
                .stream()
                .allMatch(item ->
                        item.getProduct()
                                .getMerchant()
                                .getId()
                                .equals(merchantId)
                );

        if (!belongsToMerchant) {
            throw new RuntimeException(
                    "This order does not belong to this merchant"
            );
        }

        // 3. Only CONFIRMED orders can start processing
        if (!order.getStatus().equalsIgnoreCase("CONFIRMED")) {
            throw new RuntimeException(
                    "Only confirmed orders can be processed"
            );
        }

        // 4. Change status
        order.setStatus("PROCESSING");

        // 5. Save to database
        return orderrepo.save(order);
    }




}
