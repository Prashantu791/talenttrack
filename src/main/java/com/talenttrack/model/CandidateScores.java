package com.talenttrack.model;

import com.fasterxml.jackson.annotation.JsonProperty;

public class CandidateScores {
    @JsonProperty("cv_screening")
    private Double cvScreening;

    @JsonProperty("tech_assessment")
    private Double techAssessment;

    @JsonProperty("tech_interview")
    private Double techInterview;

    @JsonProperty("hr_round")
    private Double hrRound;

    @JsonProperty("overall")
    private Double overall;

    public CandidateScores() {}

    public Double getCvScreening() { return cvScreening; }
    public void setCvScreening(Double cvScreening) { this.cvScreening = cvScreening; }

    public Double getTechAssessment() { return techAssessment; }
    public void setTechAssessment(Double techAssessment) { this.techAssessment = techAssessment; }

    public Double getTechInterview() { return techInterview; }
    public void setTechInterview(Double techInterview) { this.techInterview = techInterview; }

    public Double getHrRound() { return hrRound; }
    public void setHrRound(Double hrRound) { this.hrRound = hrRound; }

    public Double getOverall() { return overall; }
    public void setOverall(Double overall) { this.overall = overall; }
}
