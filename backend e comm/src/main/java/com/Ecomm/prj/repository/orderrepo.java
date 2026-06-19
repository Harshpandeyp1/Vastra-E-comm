package com.Ecomm.prj.repository;

import com.Ecomm.prj.Model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface orderrepo extends JpaRepository<Order,Integer> {


}
