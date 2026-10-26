package com.talenttrack.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.ArrayList;
import java.util.List;

public class Candidate {
    private String id;

    @JsonProperty("tracking_code")
    private String trackingCode;

    private String name;
    private String initials;
    private String email;
    private String phone;
    private String password;
    private String address;
    private String role;
    private String tier;
    private String experience;

    @JsonProperty("resume_name")
    private String resumeName;

    @JsonProperty("resume_url")
    private String resumeUrl;

    @JsonProperty("referral_name")
    private String referralName;

    private String stage;

    @JsonProperty("current_step")
    private Integer currentStep = 1;

    private String status = "In Progress";
    private Double score;

    private CandidateScores scores = new CandidateScores();
    private List<String> skills = new ArrayList<>();
    private List<RoadmapItem> roadmap = new ArrayList<>();
    private List<AuditLogItem> history = new ArrayList<>();

    @JsonProperty("created_at")
    private String createdAt;

    public Candidate() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTrackingCode() { return trackingCode; }
    public void setTrackingCode(String trackingCode) { this.trackingCode = trackingCode; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getInitials() { return initials; }
    public void setInitials(String initials) { this.initials = initials; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getTier() { return tier; }
    public void setTier(String tier) { this.tier = tier; }

    public String getExperience() { return experience; }
    public void setExperience(String experience) { this.experience = experience; }

    public String getResumeName() { return resumeName; }
    public void setResumeName(String resumeName) { this.resumeName = resumeName; }

    public String getResumeUrl() { return resumeUrl; }
    public void setResumeUrl(String resumeUrl) { this.resumeUrl = resumeUrl; }

    public String getReferralName() { return referralName; }
    public void setReferralName(String referralName) { this.referralName = referralName; }

    public String getStage() { return stage; }
    public void setStage(String stage) { this.stage = stage; }

    public Integer getCurrentStep() { return currentStep; }
    public void setCurrentStep(Integer currentStep) { this.currentStep = currentStep; }

    @JsonProperty("currentStep")
    public Integer getCurrentStepCamel() { return currentStep; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Double getScore() { return score; }
    public void setScore(Double score) { this.score = score; }

    public CandidateScores getScores() { return scores; }
    public void setScores(CandidateScores scores) { this.scores = scores; }

    public List<String> getSkills() { return skills; }
    public void setSkills(List<String> skills) { this.skills = skills; }

    public List<RoadmapItem> getRoadmap() { return roadmap; }
    public void setRoadmap(List<RoadmapItem> roadmap) { this.roadmap = roadmap; }

    public List<AuditLogItem> getHistory() { return history; }
    public void setHistory(List<AuditLogItem> history) { this.history = history; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
}
