package com.Ecomm.prj.repository;

import com.Ecomm.prj.Model.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WishlistRepo extends JpaRepository<Wishlist,Long> {
    List<Wishlist>findByUserId(Long userId);
}
