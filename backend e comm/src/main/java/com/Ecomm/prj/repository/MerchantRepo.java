        package com.Ecomm.prj.repository;

import com.Ecomm.prj.Model.Merchant;
import com.Ecomm.prj.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MerchantRepo extends JpaRepository<Merchant, Long> {

    Optional<Merchant> findByUser(User user);

    Optional<Merchant> findByUserId(Long userId);

    Optional<Merchant> findByUserEmail(String email);
}

