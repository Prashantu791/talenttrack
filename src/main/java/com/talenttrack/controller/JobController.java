package com.talenttrack.controller;

import com.talenttrack.dao.JobDao;
import com.talenttrack.model.Job;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    private final JobDao jobDao;

    public JobController(JobDao jobDao) {
        this.jobDao = jobDao;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getJobs() {
        List<Job> jobs = jobDao.findAll();

        Map<String, Object> company = new HashMap<>();
        company.put("name", "TalentTrack");
        company.put("headquarters", "TalentTrack Tech Park, Tower B, 4th Floor, Bellandur Outer Ring Road, Bengaluru, Karnataka 560103");
        company.put("campus_contact", "+91 80 4910 8800");
        company.put("visitor_gate", "Gate 2 (Visitor Security Desk & Badging)");
        company.put("total_openings", jobs.size());

        int fresherCount = 0;
        int midCount = 0;
        int seniorCount = 0;
        for (Job j : jobs) {
            if ("Fresher".equalsIgnoreCase(j.getTier())) fresherCount++;
            else if ("Mid-Level".equalsIgnoreCase(j.getTier())) midCount++;
            else seniorCount++;
        }
        company.put("fresher_openings", fresherCount);
        company.put("mid_openings", midCount);
        company.put("senior_openings", seniorCount);

        Map<String, Object> response = new HashMap<>();
        response.put("company", company);
        response.put("total_openings", jobs.size());
        response.put("fresher_count", fresherCount);
        response.put("mid_count", midCount);
        response.put("senior_count", seniorCount);
        response.put("jobs", jobs);

        return ResponseEntity.ok(response);
    }
}
