package com.talenttrack.dao;

import com.talenttrack.dto.ApplyRequest;
import com.talenttrack.dto.UpdateStageRequest;
import com.talenttrack.model.AuditLogItem;
import com.talenttrack.model.Candidate;
import com.talenttrack.model.CandidateScores;
import com.talenttrack.model.RoadmapItem;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.*;

@Repository
public class CandidateDao {

    private final JdbcTemplate jdbcTemplate;

    public CandidateDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private static final RowMapper<Candidate> CANDIDATE_ROW_MAPPER = new RowMapper<>() {
        @Override
        public Candidate mapRow(ResultSet rs, int rowNum) throws SQLException {
            Candidate c = new Candidate();
            c.setId(rs.getString("id"));
            c.setTrackingCode(rs.getString("tracking_code"));
            c.setName(rs.getString("name"));
            c.setInitials(rs.getString("initials"));
            c.setEmail(rs.getString("email"));
            c.setPhone(rs.getString("phone"));
            c.setPassword(rs.getString("password"));
            c.setAddress(rs.getString("address"));
            c.setRole(rs.getString("role"));
            c.setTier(rs.getString("tier"));
            c.setExperience(rs.getString("experience"));
            c.setResumeName(rs.getString("resume_name"));
            c.setResumeUrl(rs.getString("resume_url"));
            c.setReferralName(rs.getString("referral_name"));
            c.setStage(rs.getString("stage"));
            int step = rs.getInt("current_step");
            c.setCurrentStep(step > 0 ? step : 1);
            c.setStatus(rs.getString("status"));
            double ov = rs.getDouble("overall_score");
            if (!rs.wasNull()) {
                c.setScore(ov);
            }
            java.sql.Timestamp ts = rs.getTimestamp("created_at");
            if (ts != null) {
                c.setCreatedAt(new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'").format(ts));
            }
            return c;
        }
    };

    public List<Candidate> findAll() {
        String sql = "SELECT * FROM candidates ORDER BY created_at DESC";
        List<Candidate> list = jdbcTemplate.query(sql, CANDIDATE_ROW_MAPPER);
        for (Candidate c : list) {
            populateCandidateRelations(c);
        }
        return list;
    }

    public Optional<Candidate> findByIdOrTrackingOrEmail(String identifier) {
        if (identifier == null || identifier.trim().isEmpty()) {
            return Optional.empty();
        }
        String sql = "SELECT * FROM candidates WHERE id = ? OR tracking_code = ? OR LOWER(email) = LOWER(?) LIMIT 1";
        try {
            Candidate c = jdbcTemplate.queryForObject(sql, CANDIDATE_ROW_MAPPER, identifier, identifier, identifier);
            if (c != null) {
                populateCandidateRelations(c);
            }
            return Optional.ofNullable(c);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    private void populateCandidateRelations(Candidate c) {
        String candId = c.getId();

        // 1. Candidate Scores
        String scoreSql = "SELECT * FROM candidate_scores WHERE candidate_id = ? LIMIT 1";
        try {
            CandidateScores scores = jdbcTemplate.queryForObject(scoreSql, (rs, rowNum) -> {
                CandidateScores s = new CandidateScores();
                double cv = rs.getDouble("cv_screening");
                if (!rs.wasNull()) s.setCvScreening(cv);
                double ta = rs.getDouble("tech_assessment");
                if (!rs.wasNull()) s.setTechAssessment(ta);
                double ti = rs.getDouble("tech_interview");
                if (!rs.wasNull()) s.setTechInterview(ti);
                double hr = rs.getDouble("hr_round");
                if (!rs.wasNull()) s.setHrRound(hr);
                double ov = rs.getDouble("overall");
                if (!rs.wasNull()) s.setOverall(ov);
                return s;
            }, candId);
            if (scores != null) {
                c.setScores(scores);
            }
        } catch (EmptyResultDataAccessException ignored) {}

        // 2. Candidate Skills
        String skillsSql = "SELECT skill_name FROM candidate_skills WHERE candidate_id = ?";
        List<String> skills = jdbcTemplate.query(skillsSql, (rs, rowNum) -> rs.getString("skill_name"), candId);
        if (skills.isEmpty()) {
            skills.add("Core Software Engineering");
        }
        c.setSkills(skills);

        // 3. Candidate Roadmap
        String roadmapSql = "SELECT * FROM candidate_roadmap WHERE candidate_id = ? ORDER BY step_number ASC";
        List<RoadmapItem> roadmap = jdbcTemplate.query(roadmapSql, (rs, rowNum) -> {
            RoadmapItem item = new RoadmapItem();
            item.setStep(rs.getInt("step_number"));
            item.setTitle(rs.getString("title"));
            item.setEvaluator(rs.getString("evaluator"));
            item.setStatus(rs.getString("status"));
            item.setScore(rs.getString("score_label"));
            return item;
        }, candId);

        if (roadmap.isEmpty()) {
            roadmap = createDefaultRoadmap(c.getStatus());
        }
        c.setRoadmap(roadmap);

        // 4. Candidate Evaluation History
        String auditSql = "SELECT * FROM evaluation_audit_log WHERE candidate_id = ? ORDER BY created_at DESC";
        List<AuditLogItem> history = jdbcTemplate.query(auditSql, (rs, rowNum) -> {
            AuditLogItem item = new AuditLogItem();
            item.setId(rs.getInt("id"));
            item.setCandidateId(rs.getString("candidate_id"));
            item.setActionBy(rs.getString("action_by"));
            item.setActionRole(rs.getString("action_role"));
            item.setStage(rs.getString("stage"));
            item.setStatus(rs.getString("status"));
            double sg = rs.getDouble("score_given");
            if (!rs.wasNull()) item.setScoreGiven(sg);
            item.setNote(rs.getString("note"));
            java.sql.Timestamp ats = rs.getTimestamp("created_at");
            if (ats != null) {
                item.setDate(new SimpleDateFormat("yyyy-MM-dd HH:mm").format(ats));
            }
            return item;
        }, candId);
        c.setHistory(history);
    }

    private List<RoadmapItem> createDefaultRoadmap(String candStatus) {
        List<RoadmapItem> r = new ArrayList<>();
        r.add(new RoadmapItem(1, "CV Shortlisting", "Neha Gupta (HR Recruiter)", "In Progress", "Under Review"));
        r.add(new RoadmapItem(2, "Technical Round", "Vikram Malhotra (Tech Round Interviewer)", "Upcoming", "Pending"));
        r.add(new RoadmapItem(3, "Final HR Round", "Priya Kulkarni (Final HR Interviewer)", "Upcoming", "Pending"));
        r.add(new RoadmapItem(4, "Offer & Selection", "TalentTrack Leadership", "Upcoming", "Pending"));
        return r;
    }

    @Transactional
    public Candidate create(ApplyRequest req) {
        String candId = req.getId() != null && !req.getId().isEmpty() ? req.getId() : "cand-" + UUID.randomUUID().toString().substring(0, 8);
        String trackingCode = req.getTrackingCode() != null && !req.getTrackingCode().isEmpty() ? req.getTrackingCode() : "TT-2026-" + (1000 + new Random().nextInt(9000));

        String name = req.getName() != null ? req.getName().trim() : "Candidate";
        String[] parts = name.split("\\s+");
        StringBuilder initSb = new StringBuilder();
        for (String p : parts) {
            if (!p.isEmpty()) initSb.append(p.charAt(0));
        }
        String initials = initSb.length() > 2 ? initSb.substring(0, 2).toUpperCase() : initSb.toString().toUpperCase();

        String tier = req.getTier() != null ? req.getTier() : "Fresher";
        String role = req.getRole() != null ? req.getRole() : "Software Engineer";
        String email = req.getEmail() != null ? req.getEmail().trim() : "";
        String phone = req.getPhone() != null ? req.getPhone().trim() : "+91 90000 00000";
        String password = req.getPassword() != null && !req.getPassword().trim().isEmpty() ? req.getPassword().trim() : "Candidate@123";
        String experience = req.getExperience() != null ? req.getExperience() : "0 Yrs Exp";
        String resumeName = req.getResumeName() != null ? req.getResumeName() : name.replace(' ', '_') + "_Resume.pdf";
        String referralName = req.getReferralName();
        String address = req.getAddress() != null ? req.getAddress() : "Bengaluru, India";

        // Insert or Replace Candidate with default current_step = 1
        String sql = "REPLACE INTO candidates (id, tracking_code, name, initials, email, phone, password, address, role, tier, experience, resume_name, referral_name, stage, current_step, status, overall_score) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'CV Shortlisting', 1, 'Under Review', NULL)";
        jdbcTemplate.update(sql, candId, trackingCode, name, initials, email, phone, password, address, role, tier, experience, resumeName, referralName);

        // Candidate Scores default
        jdbcTemplate.update("REPLACE INTO candidate_scores (candidate_id, cv_screening, tech_assessment, tech_interview, hr_round, overall) VALUES (?, NULL, NULL, NULL, NULL, NULL)", candId);

        // Roadmap
        jdbcTemplate.update("DELETE FROM candidate_roadmap WHERE candidate_id = ?", candId);
        jdbcTemplate.update("INSERT INTO candidate_roadmap (candidate_id, step_number, title, evaluator, status, score_label) VALUES (?, 1, 'CV Shortlisting', 'Neha Gupta (HR Recruiter)', 'In Progress', 'Under Review')", candId);
        jdbcTemplate.update("INSERT INTO candidate_roadmap (candidate_id, step_number, title, evaluator, status, score_label) VALUES (?, 2, 'Technical Round', 'Vikram Malhotra (Tech Round Interviewer)', 'Upcoming', 'Pending')", candId);
        jdbcTemplate.update("INSERT INTO candidate_roadmap (candidate_id, step_number, title, evaluator, status, score_label) VALUES (?, 3, 'Final HR Round', 'Priya Kulkarni (Final HR Interviewer)', 'Upcoming', 'Pending')", candId);
        jdbcTemplate.update("INSERT INTO candidate_roadmap (candidate_id, step_number, title, evaluator, status, score_label) VALUES (?, 4, 'Offer & Selection', 'TalentTrack Leadership', 'Upcoming', 'Pending')", candId);

        // Skills
        jdbcTemplate.update("DELETE FROM candidate_skills WHERE candidate_id = ?", candId);
        List<String> skills = req.getSkills() != null && !req.getSkills().isEmpty() ? req.getSkills() : Arrays.asList("Software Engineering", "Problem Solving");
        for (String sk : skills) {
            jdbcTemplate.update("INSERT INTO candidate_skills (candidate_id, skill_name) VALUES (?, ?)", candId, sk);
        }

        // Initial Audit Log
        jdbcTemplate.update("INSERT INTO evaluation_audit_log (candidate_id, action_by, action_role, stage, status, score_given, note) " +
                            "VALUES (?, 'System Portal', 'Registration Portal', 'CV Shortlisting', 'Application Submitted', NULL, 'Candidate profile registered via Careers Portal')", candId);

        return findByIdOrTrackingOrEmail(candId).orElse(null);
    }

    @Transactional
    public Candidate updateStage(UpdateStageRequest req) {
        String candId = req.getCandidateId();
        Optional<Candidate> opt = findByIdOrTrackingOrEmail(candId);
        if (opt.isEmpty()) {
            return null;
        }
        Candidate existing = opt.get();
        String realId = existing.getId();

        String newStage = req.getStage() != null ? req.getStage() : existing.getStage();
        String newStatus = req.getStatus() != null ? req.getStatus() : existing.getStatus();
        Double newOverall = req.getScore() != null ? req.getScore() : existing.getScore();
        String actionBy = req.getActionBy() != null ? req.getActionBy() : "Recruiting Team";
        String note = req.getNote() != null ? req.getNote() : "";

        // Calculate current step number accurately
        int step = 1;
        if (req.getCurrentStep() != null && req.getCurrentStep() > 0) {
            step = req.getCurrentStep();
        } else if (newStage.toLowerCase().contains("offer") || "Selected".equalsIgnoreCase(newStatus) || newStage.contains("4")) {
            step = 4;
        } else if (newStage.toLowerCase().contains("hr") || newStage.contains("3")) {
            step = 3;
        } else if (newStage.toLowerCase().contains("tech") || newStage.contains("2")) {
            step = 2;
        }

        // Update Candidate Table including current_step!
        jdbcTemplate.update("UPDATE candidates SET stage = ?, status = ?, overall_score = ?, current_step = ? WHERE id = ?", newStage, newStatus, newOverall, step, realId);

        // Update Candidate Scores
        if (req.getScores() != null) {
            CandidateScores s = req.getScores();
            jdbcTemplate.update(
                "UPDATE candidate_scores SET " +
                "cv_screening = COALESCE(?, cv_screening), " +
                "tech_interview = COALESCE(?, tech_interview), " +
                "hr_round = COALESCE(?, hr_round), " +
                "overall = COALESCE(?, overall) " +
                "WHERE candidate_id = ?",
                s.getCvScreening(), s.getTechInterview(), s.getHrRound(), newOverall, realId
            );
        }

        // Update Roadmap Milestones depending on step
        if ("Rejected".equalsIgnoreCase(newStatus)) {
            jdbcTemplate.update("UPDATE candidate_roadmap SET status = 'Rejected', score_label = 'Not Cleared' WHERE candidate_id = ? AND step_number = ?", realId, step);
            jdbcTemplate.update("UPDATE candidate_roadmap SET status = 'Not Applicable', score_label = 'Not Applicable' WHERE candidate_id = ? AND step_number > ?", realId, step);
        } else if (step == 2 || newStage.toLowerCase().contains("tech")) {
            jdbcTemplate.update("UPDATE candidate_roadmap SET status = 'Completed', score_label = 'Cleared' WHERE candidate_id = ? AND step_number = 1", realId);
            jdbcTemplate.update("UPDATE candidate_roadmap SET status = 'In Progress', score_label = 'Active Interview' WHERE candidate_id = ? AND step_number = 2", realId);
        } else if (step == 3 || newStage.toLowerCase().contains("hr")) {
            jdbcTemplate.update("UPDATE candidate_roadmap SET status = 'Completed', score_label = 'Cleared' WHERE candidate_id = ? AND step_number <= 2", realId);
            jdbcTemplate.update("UPDATE candidate_roadmap SET status = 'In Progress', score_label = 'Leadership Debrief' WHERE candidate_id = ? AND step_number = 3", realId);
        } else if (step >= 4 || newStage.toLowerCase().contains("offer") || "Selected".equalsIgnoreCase(newStatus)) {
            jdbcTemplate.update("UPDATE candidate_roadmap SET status = 'Completed', score_label = 'Cleared' WHERE candidate_id = ? AND step_number <= 3", realId);
            jdbcTemplate.update("UPDATE candidate_roadmap SET status = 'Completed', score_label = 'Offer Extended' WHERE candidate_id = ? AND step_number = 4", realId);
        }

        // Insert Audit Log Entry
        jdbcTemplate.update(
            "INSERT INTO evaluation_audit_log (candidate_id, action_by, action_role, stage, status, score_given, note) " +
            "VALUES (?, ?, ?, ?, ?, ?, ?)",
            realId, actionBy, actionBy, newStage, newStatus, newOverall, note
        );

        return findByIdOrTrackingOrEmail(realId).orElse(null);
    }
}
