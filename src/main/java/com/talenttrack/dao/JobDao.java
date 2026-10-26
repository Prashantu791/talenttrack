package com.talenttrack.dao;

import com.talenttrack.model.Job;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.*;

@Repository
public class JobDao {

    private final JdbcTemplate jdbcTemplate;

    public JobDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private static final RowMapper<Job> ROW_MAPPER = new RowMapper<>() {
        @Override
        public Job mapRow(ResultSet rs, int rowNum) throws SQLException {
            Job j = new Job();
            j.setId(rs.getString("id"));
            j.setTitle(rs.getString("title"));
            j.setTier(rs.getString("tier"));
            j.setDepartment(rs.getString("department"));
            j.setExperience(rs.getString("experience"));
            j.setLocation(rs.getString("location"));
            j.setSalary(rs.getString("salary"));
            j.setDescription(rs.getString("description"));
            return j;
        }
    };

    public List<Job> findAll() {
        String sql = "SELECT * FROM jobs ORDER BY id ASC";
        List<Job> list = jdbcTemplate.query(sql, ROW_MAPPER);
        for (Job job : list) {
            populateJobDetails(job);
        }
        return list;
    }

    public int countTotal() {
        Integer cnt = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM jobs", Integer.class);
        return cnt != null ? cnt : 0;
    }

    public int countByTier(String tier) {
        Integer cnt = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM jobs WHERE tier = ?", Integer.class, tier);
        return cnt != null ? cnt : 0;
    }

    private void populateJobDetails(Job job) {
        // Provide standard enriched skill tags & rounds matching TalentTrack curriculum
        List<String> skills = new ArrayList<>();
        String t = job.getTier() != null ? job.getTier() : "Fresher";

        if ("Fresher".equalsIgnoreCase(t)) {
            skills.addAll(Arrays.asList("Data Structures", "Java / Python", "SQL", "Problem Solving"));
        } else if ("Mid-Level".equalsIgnoreCase(t)) {
            skills.addAll(Arrays.asList("Microservices", "REST APIs", "Cloud Architecture", "Docker", "Database Optimization"));
        } else {
            skills.addAll(Arrays.asList("Distributed Systems", "High Scalability", "System Architecture", "Leadership", "Multi-Cloud"));
        }
        job.setSkills(skills);

        Map<String, Object> elig = new HashMap<>();
        elig.put("education", "B.Tech / BE in CS, IT, ECE or MCA / Equivalent");
        elig.put("min_cgpa", "Fresher".equalsIgnoreCase(t) ? "7.0 or 70%" : "Relevant industry experience");
        elig.put("skills", skills);
        job.setEligibility(elig);

        List<Map<String, Object>> rounds = new ArrayList<>();
        rounds.add(createRound(1, "CV & Academic Shortlisting", "Online / Automated"));
        rounds.add(createRound(2, "Online Coding & Aptitude Test", "Online Evaluation"));
        rounds.add(createRound(3, "Virtual Technical Screening", "Google Meet / Video"));
        rounds.add(createRound(4, "In-Office Technical & HR Discussion", "TalentTrack Bengaluru HQ"));
        job.setInterviewProcess(rounds);
    }

    private Map<String, Object> createRound(int rNum, String rName, String rMode) {
        Map<String, Object> m = new HashMap<>();
        m.put("round", rNum);
        m.put("name", rName);
        m.put("mode", rMode);
        return m;
    }
}
