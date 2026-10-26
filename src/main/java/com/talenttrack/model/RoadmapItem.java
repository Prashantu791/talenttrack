package com.talenttrack.model;

import com.fasterxml.jackson.annotation.JsonProperty;

public class RoadmapItem {
    private Integer step;
    private String title;
    private String evaluator;
    private String status;
    private String score;
    private String mode;
    private String date;

    public RoadmapItem() {}

    public RoadmapItem(Integer step, String title, String evaluator, String status, String score) {
        this.step = step;
        this.title = title;
        this.evaluator = evaluator;
        this.status = status;
        this.score = score;
    }

    public Integer getStep() { return step; }
    public void setStep(Integer step) { this.step = step; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getEvaluator() { return evaluator; }
    public void setEvaluator(String evaluator) { this.evaluator = evaluator; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getScore() { return score; }
    public void setScore(String score) { this.score = score; }

    public String getMode() { return mode; }
    public void setMode(String mode) { this.mode = mode; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }
}
