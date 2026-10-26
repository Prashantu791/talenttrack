package com.talenttrack.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/feedback")
public class FeedbackController {

    private final JdbcTemplate jdbcTemplate;

    public FeedbackController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> submitFeedback(@RequestBody Map<String, Object> body) {
        String candidateName = (String) body.get("candidate_name");
        String stage = body.get("stage") != null ? (String) body.get("stage") : "Evaluation Round";
        String evaluator = body.get("evaluator") != null ? (String) body.get("evaluator") : "Interviewer";
        Double rating = body.get("rating") != null ? Double.valueOf(body.get("rating").toString()) : 8.5;
        String decision = body.get("decision") != null ? (String) body.get("decision") : "Recommended";
        String quote = (String) body.get("quote");

        try {
            // Update candidate overall score if candidate exists
            jdbcTemplate.update("UPDATE candidates SET overall_score = ? WHERE name = ? OR id = ?", rating, candidateName, candidateName);

            // Insert into evaluation audit log
            jdbcTemplate.update(
                "INSERT INTO evaluation_audit_log (candidate_id, action_by, action_role, stage, status, score_given, note) " +
                "SELECT id, ?, 'Interviewer', ?, ?, ?, ? FROM candidates WHERE name = ? OR id = ? LIMIT 1",
                evaluator, stage, decision, rating, quote != null ? quote : decision, candidateName, candidateName
            );
        } catch (Exception ignored) {}

        Map<String, Object> response = new HashMap<>(body);
        response.put("id", "fb-" + UUID.randomUUID().toString().substring(0, 8));
        response.put("success", true);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
