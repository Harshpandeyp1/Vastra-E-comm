package com.Ecomm.prj.Controller;

import com.Ecomm.prj.Dto.CartDto;
import com.Ecomm.prj.Model.Cart;
import com.Ecomm.prj.Service.cartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.util.List;
@RestController
@RequestMapping("/cart")
@CrossOrigin(origins = "http://localhost:5173")
public class CartController {

    @Autowired
    private cartService cartService;

    @PostMapping("/add")
    public Cart addToCart(@RequestBody CartDto dto) {
        if (dto == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Request body is required");
        }
        return cartService.addToCart(dto);
    }

    @GetMapping("/{userId}")
    public List<Cart> getCartByUser(@PathVariable int userId) {
        return cartService.getCartByUser(userId);
    }

    @DeleteMapping("/{cartId}")
    public void removeCart(@PathVariable int cartId) {
        cartService.removeCart(cartId);
    }

    @PutMapping("/{cartId}/{quantity}")
    public Cart updateQuantity(
            @PathVariable int cartId,
            @PathVariable int quantity) {

        return cartService.updateQuantity(cartId, quantity);
    }
}
