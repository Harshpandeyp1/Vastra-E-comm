package com.Ecomm.prj.Controller;

import com.Ecomm.prj.Dto.orderDto;
import com.Ecomm.prj.Model.Order;
import com.Ecomm.prj.Service.orderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.jaxb.SpringDataJaxb;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/order")
@CrossOrigin(origins = "http://localhost:5173")
public class orderController {
    @Autowired
    private orderService orderService;

    @PostMapping("/place")
   public Order placeOrder( @RequestBody orderDto orderDto) {
        return orderService.placeOrder(orderDto);

    }

    @GetMapping("/user/{userId}")
    public java.util.List<Order> getOrdersByUser(@PathVariable int userId) {
        return orderService.getOrdersByUserId(userId);
    }

}
