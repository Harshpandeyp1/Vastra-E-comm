package com.Ecomm.prj.Service;

import com.Ecomm.prj.Model.Product;
import com.Ecomm.prj.Model.User;
import com.Ecomm.prj.Model.Wishlist;
import com.Ecomm.prj.repository.ProductRepository;
import com.Ecomm.prj.repository.UserRepo;
import com.Ecomm.prj.repository.WishlistRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WishlistService {
    @Autowired
    private WishlistRepo repo;

    @Autowired
    private UserRepo userrepo;

    @Autowired
    private ProductRepository productrepo;

    public Wishlist addToWishlist(Long userId,Long productId){
        User user=userrepo.findById(userId).orElseThrow();

        Product product=productrepo.findById(productId).orElseThrow();

        Wishlist wishlist=new Wishlist();

        wishlist.setUser(user);
        wishlist.setProduct(product);

        return repo.save(wishlist);
    }
    public List<Wishlist> getWishlist(Long userId) {

        return repo.findByUserId(userId);
    }
    public void removeWishlist(Long wishlistId) {

        repo.deleteById(wishlistId);
    }
}
