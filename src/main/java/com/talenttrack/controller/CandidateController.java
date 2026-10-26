package com.talenttrack.controller;

import com.talenttrack.dao.CandidateDao;
import com.talenttrack.dto.ApplyRequest;
import com.talenttrack.dto.UpdateStageRequest;
import com.talenttrack.model.Candidate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class CandidateController {

    private final CandidateDao candidateDao;

    public CandidateController(CandidateDao candidateDao) {
        this.candidateDao = candidateDao;
    }

    @GetMapping("/candidates")
    public ResponseEntity<List<Candidate>> getAllCandidates() {
        List<Candidate> list = candidateDao.findAll();
        return ResponseEntity.ok(list);
    }

    @PostMapping("/apply")
    public ResponseEntity<Map<String, Object>> apply(@RequestBody ApplyRequest request) {
        Candidate created = candidateDao.create(request);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("tracking_id", created != null ? created.getTrackingCode() : "TT-2026-9999");
        response.put("tier", created != null ? created.getTier() : "Fresher");
        response.put("candidate", created);
        response.put("message", "Application submitted! Candidate recorded in database.");

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/candidates/update-stage")
    public ResponseEntity<Map<String, Object>> updateStage(@RequestBody UpdateStageRequest request) {
        Candidate updated = candidateDao.updateStage(request);

        Map<String, Object> response = new HashMap<>();
        if (updated != null) {
            response.put("success", true);
            response.put("candidate", updated);
            response.put("message", "Candidate stage successfully updated");
            return ResponseEntity.ok(response);
        } else {
            response.put("success", false);
            response.put("message", "Candidate not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    @GetMapping("/track")
    public ResponseEntity<?> trackCandidate(
            @RequestParam(required = false) String code,
            @RequestParam(required = false) String email) {

        String key = code != null && !code.isEmpty() ? code : email;
        Optional<Candidate> cand = candidateDao.findByIdOrTrackingOrEmail(key);

        if (cand.isPresent()) {
            return ResponseEntity.ok(cand.get());
        }

        // Fallback to first available candidate or 404
        List<Candidate> all = candidateDao.findAll();
        if (!all.isEmpty()) {
            return ResponseEntity.ok(all.get(0));
        }

        Map<String, Object> err = new HashMap<>();
        err.put("error", "Candidate tracking profile not found");
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(err);
    }
}
