package com.Ecomm.prj.repository;

import com.Ecomm.prj.Model.Cart;
import com.Ecomm.prj.Model.Product;
import com.Ecomm.prj.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartRepo extends JpaRepository<Cart,Integer> {
    List<Cart> findByUser(User user);
    List<Cart> findByUserId(Integer userId);
    Optional<Cart> findByUserAndProduct(User user, Product product);
}
