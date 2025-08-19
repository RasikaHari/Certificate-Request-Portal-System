package com.examly.springapp.dto;

import java.util.List;

import lombok.*;

@Getter
@Setter
public class RequestsTrendResponse {
    private List<String> dates;
    private List<Long> pendingCounts;
    private List<Long> approvedCounts;
    private List<Long> rejectedCounts;
}
