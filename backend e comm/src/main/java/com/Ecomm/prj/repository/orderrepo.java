package com.Ecomm.prj.repository;

import com.Ecomm.prj.Model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface orderrepo extends JpaRepository<Order,Integer> {
    List<Order> findByUser_Id(Long userId);
}
