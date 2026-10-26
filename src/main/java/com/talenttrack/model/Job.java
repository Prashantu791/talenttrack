package com.talenttrack.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class Job {
    private String id;
    private String title;
    private String tier;
    private String department;
    private String experience;
    private String location;
    private String salary;
    private String description;
    private Integer openings = 1;
    private List<String> skills = new ArrayList<>();
    private Map<String, Object> eligibility;

    @JsonProperty("interview_process")
    private List<Map<String, Object>> interviewProcess = new ArrayList<>();

    public Job() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getTier() { return tier; }
    public void setTier(String tier) { this.tier = tier; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getExperience() { return experience; }
    public void setExperience(String experience) { this.experience = experience; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getSalary() { return salary; }
    public void setSalary(String salary) { this.salary = salary; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Integer getOpenings() { return openings; }
    public void setOpenings(Integer openings) { this.openings = openings; }

    public List<String> getSkills() { return skills; }
    public void setSkills(List<String> skills) { this.skills = skills; }

    public Map<String, Object> getEligibility() { return eligibility; }
    public void setEligibility(Map<String, Object> eligibility) { this.eligibility = eligibility; }

    public List<Map<String, Object>> getInterviewProcess() { return interviewProcess; }
    public void setInterviewProcess(List<Map<String, Object>> interviewProcess) { this.interviewProcess = interviewProcess; }
}
