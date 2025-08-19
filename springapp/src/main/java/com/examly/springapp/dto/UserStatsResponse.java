package com.examly.springapp.dto;

import java.util.List;

import lombok.*;

@Getter
@Setter
public class UserStatsResponse {
    private int requestedCount;
    private int pendingCount;
    private int approvedCount;
    private int downloadedCount;
    private long totalStudents;
    private long totalStaff; 
    private long approvedToday;
    private long rejectedToday;

    private List<Activity> recentActivity;
    private List<Activity> allActivity; 

     @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Activity {
        private String type;        
        private String description; 
        private String date;        
    }
}
