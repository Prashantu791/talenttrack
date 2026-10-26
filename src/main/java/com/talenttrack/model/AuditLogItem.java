package com.talenttrack.model;

import com.fasterxml.jackson.annotation.JsonProperty;

public class AuditLogItem {
    private Integer id;

    @JsonProperty("candidate_id")
    private String candidateId;

    @JsonProperty("action_by")
    private String actionBy;

    @JsonProperty("action_role")
    private String actionRole;

    private String stage;
    private String status;

    @JsonProperty("score_given")
    private Double scoreGiven;

    private String note;
    private String date;

    public AuditLogItem() {}

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getCandidateId() { return candidateId; }
    public void setCandidateId(String candidateId) { this.candidateId = candidateId; }

    public String getActionBy() { return actionBy; }
    public void setActionBy(String actionBy) { this.actionBy = actionBy; }

    public String getActionRole() { return actionRole; }
    public void setActionRole(String actionRole) { this.actionRole = actionRole; }

    public String getStage() { return stage; }
    public void setStage(String stage) { this.stage = stage; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Double getScoreGiven() { return scoreGiven; }
    public void setScoreGiven(Double scoreGiven) { this.scoreGiven = scoreGiven; }

    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }
}
