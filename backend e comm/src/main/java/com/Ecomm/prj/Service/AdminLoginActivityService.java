
package com.Ecomm.prj.Service;

import com.Ecomm.prj.Model.LoginActivity;
import com.Ecomm.prj.repository.LoginActivityRepo;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AdminLoginActivityService {

    private final LoginActivityRepo loginActivityRepo;

    public AdminLoginActivityService(LoginActivityRepo loginActivityRepo) {
        this.loginActivityRepo = loginActivityRepo;
    }

    public List<LoginActivity> getRecentActivity(int hours) {

        LocalDateTime fromTime =
                LocalDateTime.now().minusHours(hours);

        return loginActivityRepo
                .findByTimestampAfterOrderByTimestampDesc(fromTime);
    }

    public long getTotalAttempts(int hours) {

        LocalDateTime fromTime =
                LocalDateTime.now().minusHours(hours);

        return loginActivityRepo.countByTimestampAfter(fromTime);
    }

    public long getSuccessfulAttempts(int hours) {

        LocalDateTime fromTime =
                LocalDateTime.now().minusHours(hours);

        return loginActivityRepo.countByTimestampAfterAndStatus(
                fromTime,
                "SUCCESS"
        );
    }

    public long getFailedAttempts(int hours) {

        LocalDateTime fromTime =
                LocalDateTime.now().minusHours(hours);

        return loginActivityRepo.countByTimestampAfterAndStatus(
                fromTime,
                "FAILED"
        );
    }
}