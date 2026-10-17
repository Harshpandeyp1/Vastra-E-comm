package com.Ecomm.prj.Dto;

import com.Ecomm.prj.Model.LoginActivity;

import java.util.List;

public class AdminLoginActivityResponse {

    private long totalAttempts;
    private long successfulAttempts;
    private long failedAttempts;
    private List<LoginActivity> activities;

    public AdminLoginActivityResponse(
            long totalAttempts,
            long successfulAttempts,
            long failedAttempts,
            List<LoginActivity> activities
    ) {
        this.totalAttempts = totalAttempts;
        this.successfulAttempts = successfulAttempts;
        this.failedAttempts = failedAttempts;
        this.activities = activities;
    }

    public long getTotalAttempts() {
        return totalAttempts;
    }

    public long getSuccessfulAttempts() {
        return successfulAttempts;
    }

    public long getFailedAttempts() {
        return failedAttempts;
    }

    public List<LoginActivity> getActivities() {
        return activities;
    }
}