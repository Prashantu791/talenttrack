package com.talenttrack.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.talenttrack.model.CandidateScores;

public class UpdateStageRequest {
    private String candidateId;
    private String stage;
    private String status;
    private String actionBy;
    private String note;
    private Double score;
    private CandidateScores scores;

    @JsonProperty("current_step")
    private Integer currentStep;

    public UpdateStageRequest() {}

    public String getCandidateId() { return candidateId; }
    public void setCandidateId(String candidateId) { this.candidateId = candidateId; }

    public String getStage() { return stage; }
    public void setStage(String stage) { this.stage = stage; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getActionBy() { return actionBy; }
    public void setActionBy(String actionBy) { this.actionBy = actionBy; }

    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }

    public Double getScore() { return score; }
    public void setScore(Double score) { this.score = score; }

    public CandidateScores getScores() { return scores; }
    public void setScores(CandidateScores scores) { this.scores = scores; }

    public Integer getCurrentStep() { return currentStep; }

    @JsonProperty("currentStep")
    public void setCurrentStepCamel(Integer currentStep) {
        this.currentStep = currentStep;
    }

    public void setCurrentStep(Integer currentStep) {
        this.currentStep = currentStep;
    }
}
