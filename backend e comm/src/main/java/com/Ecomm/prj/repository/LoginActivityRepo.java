package com.Ecomm.prj.repository;

import com.Ecomm.prj.Model.LoginActivity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface LoginActivityRepo extends JpaRepository<LoginActivity, Long> {

    List<LoginActivity> findByTimestampAfterOrderByTimestampDesc(
            LocalDateTime time
    );

    long countByTimestampAfter(LocalDateTime time);

    long countByTimestampAfterAndStatus(
            LocalDateTime time,
            String status
    );
}