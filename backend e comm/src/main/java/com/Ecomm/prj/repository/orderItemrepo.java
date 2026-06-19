package com.Ecomm.prj.repository;

import com.Ecomm.prj.Model.Order;
import com.Ecomm.prj.Model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface orderItemrepo extends JpaRepository<OrderItem,Integer> {
}
