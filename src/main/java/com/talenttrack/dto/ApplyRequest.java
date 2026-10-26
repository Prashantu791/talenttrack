package com.talenttrack.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.ArrayList;
import java.util.List;

public class ApplyRequest {
    private String id;
    private String name;
    private String email;
    private String phone;
    private String role;
    private String tier;
    private String experience;
    private String address;
    private String password;

    @JsonProperty("resume_name")
    private String resumeName;

    @JsonProperty("referral_name")
    private String referralName;

    @JsonProperty("tracking_code")
    private String trackingCode;

    private List<String> skills = new ArrayList<>();

    public ApplyRequest() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getTier() { return tier; }
    public void setTier(String tier) { this.tier = tier; }

    public String getExperience() { return experience; }
    public void setExperience(String experience) { this.experience = experience; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getResumeName() { return resumeName; }
    public void setResumeName(String resumeName) { this.resumeName = resumeName; }

    public String getReferralName() { return referralName; }
    public void setReferralName(String referralName) { this.referralName = referralName; }

    public String getTrackingCode() { return trackingCode; }
    public void setTrackingCode(String trackingCode) { this.trackingCode = trackingCode; }

    public List<String> getSkills() { return skills; }
    public void setSkills(List<String> skills) { this.skills = skills; }
}
