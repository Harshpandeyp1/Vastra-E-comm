package com.Ecomm.prj.Controller;

import com.Ecomm.prj.Model.Wishlist;
import com.Ecomm.prj.Service.WishlistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/wishlist")
@CrossOrigin(origins = "http://localhost:5173")
public class WishlistController {
    @Autowired
    private WishlistService wishlistService;

    @PostMapping("/{userId}/{productId}")
    public Wishlist addToWishlist(
            @PathVariable Long userId,
            @PathVariable Long productId) {

        return wishlistService
                .addToWishlist(userId, productId);
    }
    @GetMapping("/{userId}")
    public List<Wishlist> getWishlist(
            @PathVariable Long userId) {

        return wishlistService.getWishlist(userId);
    }
    @DeleteMapping("/{wishlistId}")
    public void removeWishlist(
            @PathVariable Long wishlistId) {

        wishlistService.removeWishlist(wishlistId);
    }
}
