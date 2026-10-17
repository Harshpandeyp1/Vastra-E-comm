package com.Ecomm.prj.Controller;

import com.Ecomm.prj.Dto.AdminLoginActivityResponse;
import com.Ecomm.prj.Model.LoginActivity;
import com.Ecomm.prj.Service.AdminLoginActivityService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminLoginActivityService activityService;

    public AdminController(AdminLoginActivityService activityService) {
        this.activityService = activityService;
    }

    @GetMapping("/dashboard")
    public String dashboard() {
        return "Welcome to Admin Dashboard";
    }

    @GetMapping("/login-activity")
    public AdminLoginActivityResponse getLoginActivity(
            @RequestParam(defaultValue = "6") int hours
    ) {

        // Keep the requested range reasonable
        if (hours <= 0) {
            hours = 6;
        }

        if (hours > 24) {
            hours = 24;
        }

        List<LoginActivity> activities =
                activityService.getRecentActivity(hours);

        long total =
                activityService.getTotalAttempts(hours);

        long successful =
                activityService.getSuccessfulAttempts(hours);

        long failed =
                activityService.getFailedAttempts(hours);

        return new AdminLoginActivityResponse(
                total,
                successful,
                failed,
                activities
        );
    }
}