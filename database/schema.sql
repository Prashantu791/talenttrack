-- ==============================================================================
-- TalentTrack Enterprise Hiring Management System
-- MySQL Relational Database Schema & Seed Data
-- ==============================================================================
-- Engine: MySQL 5.7+ / MySQL 8.0+ / MariaDB
-- Character Set: utf8mb4 (Full Unicode & Emoji support)
-- ==============================================================================

CREATE DATABASE IF NOT EXISTS `talenttrack_db`
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE `talenttrack_db`;

-- Drop old tables in reverse dependency order for clean reinstalls if needed
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `evaluation_audit_log`;
DROP TABLE IF EXISTS `candidate_roadmap`;
DROP TABLE IF EXISTS `candidate_scores`;
DROP TABLE IF EXISTS `candidate_skills`;
DROP TABLE IF EXISTS `candidates`;
DROP TABLE IF EXISTS `users_auth`;
DROP TABLE IF EXISTS `jobs`;
SET FOREIGN_KEY_CHECKS = 1;

-- ==============================================================================
-- 1. COMPANY OPENINGS & REQUISITIONS TABLE
-- ==============================================================================
CREATE TABLE `jobs` (
  `id` VARCHAR(64) NOT NULL,
  `title` VARCHAR(150) NOT NULL,
  `tier` ENUM('Fresher', 'Mid-Level', 'Senior-Level') NOT NULL,
  `department` VARCHAR(100) NOT NULL,
  `experience` VARCHAR(50) NOT NULL,
  `location` VARCHAR(120) NOT NULL,
  `salary` VARCHAR(100) NOT NULL,
  `description` TEXT NULL,
  `is_active` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================================
-- 2. CANDIDATES MASTER PROFILE TABLE
-- ==============================================================================
CREATE TABLE `candidates` (
  `id` VARCHAR(64) NOT NULL,
  `tracking_code` VARCHAR(50) NOT NULL UNIQUE,
  `name` VARCHAR(150) NOT NULL,
  `initials` VARCHAR(10) NOT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `phone` VARCHAR(50) NULL,
  `password` VARCHAR(255) DEFAULT 'Candidate@123',
  `address` TEXT NULL,
  `role` VARCHAR(150) NOT NULL,
  `tier` ENUM('Fresher', 'Mid-Level', 'Senior-Level') NOT NULL,
  `experience` VARCHAR(100) NOT NULL,
  `resume_name` VARCHAR(255) NULL,
  `resume_url` VARCHAR(500) NULL,
  `referral_name` VARCHAR(150) NULL,
  `stage` VARCHAR(100) DEFAULT 'CV Shortlisting',
  `current_step` INT DEFAULT 1,
  `status` VARCHAR(50) DEFAULT 'In Progress',
  `overall_score` DECIMAL(3,1) DEFAULT 8.5,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_candidates_email` (`email`),
  INDEX `idx_candidates_tracking` (`tracking_code`),
  INDEX `idx_candidates_stage` (`stage`),
  INDEX `idx_candidates_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================================
-- 3. CANDIDATE SKILLS TABLE (Normalized Many-to-One)
-- ==============================================================================
CREATE TABLE `candidate_skills` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `candidate_id` VARCHAR(64) NOT NULL,
  `skill_name` VARCHAR(100) NOT NULL,
  INDEX `idx_skills_candidate` (`candidate_id`),
  CONSTRAINT `fk_skills_candidate`
    FOREIGN KEY (`candidate_id`) REFERENCES `candidates` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================================
-- 4. ROUND-BY-ROUND EVALUATION SCORES (Out of 10)
-- Stores Neha Gupta CV Screening rating, Vikram Malhotra Tech rating, 
-- and Priya Kulkarni Final HR rating.
-- ==============================================================================
CREATE TABLE `candidate_scores` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `candidate_id` VARCHAR(64) NOT NULL UNIQUE,
  `cv_screening` DECIMAL(3,1) NULL COMMENT 'Round 1 Resume Screening rating (1.0 to 10.0)',
  `tech_assessment` DECIMAL(3,1) NULL COMMENT 'Round 2 Technical test score (1.0 to 10.0)',
  `tech_interview` DECIMAL(3,1) NULL COMMENT 'Round 3 Technical interview score (1.0 to 10.0)',
  `hr_round` DECIMAL(3,1) NULL COMMENT 'Round 4 Final HR leadership score (1.0 to 10.0)',
  `overall` DECIMAL(3,1) NULL COMMENT 'Average overall rating out of 10.0',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_scores_candidate`
    FOREIGN KEY (`candidate_id`) REFERENCES `candidates` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================================
-- 5. CANDIDATE HIRING ROADMAP & MILESTONES
-- Stores the 4-step progressive track for each candidate.
-- ==============================================================================
CREATE TABLE `candidate_roadmap` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `candidate_id` VARCHAR(64) NOT NULL,
  `step_number` INT NOT NULL,
  `title` VARCHAR(100) NOT NULL,
  `evaluator` VARCHAR(150) NOT NULL,
  `status` ENUM('Completed', 'In Progress', 'Upcoming') NOT NULL DEFAULT 'Upcoming',
  `score_label` VARCHAR(50) NULL COMMENT 'e.g. 8.5 / 10, In Review, Pending, Offer Rolled Out',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_roadmap_cand` (`candidate_id`),
  CONSTRAINT `fk_roadmap_candidate`
    FOREIGN KEY (`candidate_id`) REFERENCES `candidates` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================================
-- 6. EVALUATION AUDIT & DECISION LOG
-- Keeps an immutable history of every shortlist/reject/rating action.
-- ==============================================================================
CREATE TABLE `evaluation_audit_log` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `candidate_id` VARCHAR(64) NOT NULL,
  `action_by` VARCHAR(150) NOT NULL,
  `action_role` VARCHAR(60) NOT NULL,
  `stage` VARCHAR(100) NOT NULL,
  `status` VARCHAR(50) NOT NULL,
  `score_given` DECIMAL(3,1) NULL,
  `note` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_audit_cand` (`candidate_id`),
  CONSTRAINT `fk_audit_candidate`
    FOREIGN KEY (`candidate_id`) REFERENCES `candidates` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================================
-- 7. USERS & STAFF AUTHENTICATION DIRECTORY
-- ==============================================================================
CREATE TABLE `users_auth` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(100) NOT NULL UNIQUE,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL DEFAULT 'TalentTrack2026!',
  `role` ENUM('candidate', 'hr_screener', 'tech_interviewer', 'hr_interviewer', 'admin') NOT NULL,
  `name` VARCHAR(150) NOT NULL,
  `title` VARCHAR(150) NOT NULL,
  `initials` VARCHAR(10) NOT NULL,
  `is_active` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================================
-- SEED DATA: COMPANY OPENINGS (11 Openings across Fresher, Mid, Senior)
-- ==============================================================================
INSERT INTO `jobs` (`id`, `title`, `tier`, `department`, `experience`, `location`, `salary`, `description`) VALUES
('job-fresher-1', 'Graduate Engineer Trainee (GET)', 'Fresher', 'Core Engineering', '0 - 1 Yr', 'Bengaluru (Hybrid)', '₹6.5 - 9.0 LPA', 'Entry-level graduate program focused on core data structures, algorithms, and microservice engineering.'),
('job-fresher-2', 'Associate Frontend Developer', 'Fresher', 'Web Engineering', '0 - 2 Yrs', 'Bengaluru (In-Office)', '₹7.0 - 10.5 LPA', 'Build performant, accessible web components using JavaScript, CSS3, and React.'),
('job-fresher-3', 'Junior QA Automation Engineer', 'Fresher', 'Quality Engineering', '0 - 2 Yrs', 'Pune / Bengaluru', '₹6.0 - 9.5 LPA', 'Develop end-to-end automation test suites with Python, Selenium, and Postman.'),
('job-fresher-4', 'Junior Data Analyst', 'Fresher', 'Data & Analytics', '0 - 1 Yr', 'Hyderabad / Remote', '₹6.5 - 9.0 LPA', 'Analyze customer hiring funnels using SQL, Power BI, and Python Pandas.'),
('job-mid-1', 'Software Development Engineer II (Backend)', 'Mid-Level', 'Core Engineering', '2 - 5 Yrs', 'Bengaluru (Hybrid)', '₹18.0 - 26.0 LPA', 'Architect high-throughput distributed microservices using Go, PostgreSQL, and Kafka.'),
('job-mid-2', 'Product Designer (UI/UX)', 'Mid-Level', 'Product Design', '2 - 4 Yrs', 'Mumbai / Bengaluru', '₹15.0 - 22.0 LPA', 'Lead design system specifications and interactive prototype testing in Figma.'),
('job-mid-3', 'DevOps & Cloud Engineer', 'Mid-Level', 'Infrastructure', '3 - 5 Yrs', 'Bengaluru', '₹17.0 - 25.0 LPA', 'Manage AWS Kubernetes clusters, Terraform infrastructure as code, and CI/CD pipelines.'),
('job-senior-1', 'Lead Frontend Engineer', 'Senior-Level', 'Web Engineering', '6 - 10 Yrs', 'Bengaluru (Hybrid)', '₹34.0 - 48.0 LPA', 'Drive frontend micro-frontends architecture, web worker optimization, and UI standards.'),
('job-senior-2', 'Senior Backend Architect (Go/Distributed)', 'Senior-Level', 'Core Engineering', '7 - 12 Yrs', 'Pune / Bengaluru', '₹40.0 - 55.0 LPA', 'Design fault-tolerant distributed consensus protocols and petabyte-scale streaming pipelines.'),
('job-senior-3', 'Staff Machine Learning Engineer', 'Senior-Level', 'Artificial Intelligence', '6 - 11 Yrs', 'Bengaluru', '₹45.0 - 62.0 LPA', 'Fine-tune open-weight LLMs, CUDA kernels, and real-time inference engines.'),
('job-senior-4', 'Principal DevOps Architect', 'Senior-Level', 'Infrastructure', '8 - 14 Yrs', 'Bengaluru', '₹45.0 - 65.0 LPA', 'Architect zero-trust security mesh and multi-region Kubernetes cloud platforms.');

-- ==============================================================================
-- SEED DATA: STAFF & USERS DIRECTORY (With Passwords)
-- ==============================================================================
INSERT INTO `users_auth` (`username`, `email`, `password`, `role`, `name`, `title`, `initials`) VALUES
('rahul', 'rahul@talenttrack.com', 'Candidate@123', 'candidate', 'Rahul Sharma', 'Candidate', 'RS'),
('snehal', 'snehal@engineering.edu', 'Candidate@123', 'candidate', 'Snehal Patil', 'Candidate', 'SP'),
('ankit', 'ankit.verma@example.com', 'Candidate@123', 'candidate', 'Ankit Verma', 'Candidate', 'AV'),
('harsh', 'harsh.v@example.com', 'Candidate@123', 'candidate', 'Harsh Vardhan', 'Candidate', 'HV'),
('neha', 'neha@talenttrack.com', 'TalentTrack2026!', 'hr_screener', 'Neha Gupta', 'HR Recruiter', 'NG'),
('vikram', 'vikram@talenttrack.com', 'TalentTrack2026!', 'tech_interviewer', 'Vikram Malhotra', 'Tech Round Interviewer', 'VM'),
('priya', 'priya@talenttrack.com', 'TalentTrack2026!', 'hr_interviewer', 'Priya Kulkarni', 'Final HR Interviewer', 'PK');

-- ==============================================================================
-- SEED DATA: CANDIDATES
-- 1. Rahul Sharma (Senior Lead Frontend Engineer - In Tech Evaluation)
-- 2. Snehal Patil (Fresher GET - In CV Shortlisting with Rating by Neha Gupta)
-- 3. Ankit Verma (Mid Backend SDE II - In Final HR Round)
-- ==============================================================================

-- Candidate 1: Rahul Sharma
INSERT INTO `candidates` 
  (`id`, `tracking_code`, `name`, `initials`, `email`, `phone`, `address`, `role`, `tier`, `experience`, `resume_name`, `referral_name`, `stage`, `current_step`, `status`, `overall_score`)
VALUES
  ('cand-1', 'TT-2026-8812', 'Rahul Sharma', 'RS', 'rahul@talenttrack.com', '+91 98201 44521', 'Indiranagar, Bengaluru, Karnataka', 'Lead Frontend Engineer', 'Senior-Level', '8.5 Yrs', 'Rahul_Sharma_Resume.pdf', 'Rajesh Kumar (Senior Staff Eng)', 'Technical Round', 2, 'In Progress', 8.8);

INSERT INTO `candidate_skills` (`candidate_id`, `skill_name`) VALUES
  ('cand-1', 'React Architecture'),
  ('cand-1', 'Microfrontends'),
  ('cand-1', 'V8 Perf'),
  ('cand-1', 'System Design');

INSERT INTO `candidate_scores` (`candidate_id`, `cv_screening`, `tech_assessment`, `tech_interview`, `hr_round`, `overall`) VALUES
  ('cand-1', 8.5, 9.0, 8.8, NULL, 8.8);

INSERT INTO `candidate_roadmap` (`candidate_id`, `step_number`, `title`, `evaluator`, `status`, `score_label`) VALUES
  ('cand-1', 1, 'CV Shortlisting', 'Neha Gupta (HR Recruiter)', 'Completed', '8.5 / 10'),
  ('cand-1', 2, 'Technical Round', 'Vikram Malhotra (Tech Round Interviewer)', 'In Progress', '8.8 / 10'),
  ('cand-1', 3, 'Final HR Round', 'Priya Kulkarni (Final HR Interviewer)', 'Upcoming', 'Pending'),
  ('cand-1', 4, 'Offer & Selection', 'TalentTrack Leadership', 'Upcoming', 'Pending');

INSERT INTO `evaluation_audit_log` (`candidate_id`, `action_by`, `action_role`, `stage`, `status`, `score_given`, `note`) VALUES
  ('cand-1', 'Neha Gupta', 'HR Recruiter', 'Step 1: CV Shortlisting', 'Completed', 8.5, 'Resume Screening Cleared with Rating: 8.5/10. Advanced to Tech Round.');


-- Candidate 2: Snehal Patil (In CV Shortlisting)
INSERT INTO `candidates` 
  (`id`, `tracking_code`, `name`, `initials`, `email`, `phone`, `address`, `role`, `tier`, `experience`, `resume_name`, `referral_name`, `stage`, `current_step`, `status`, `overall_score`)
VALUES
  ('cand-2', 'TT-2026-5178', 'Snehal Patil', 'SP', 'snehal@engineering.edu', '+91 98200 11990', 'Shivajinagar, Pune, Maharashtra', 'Graduate Engineer Trainee (GET)', 'Fresher', '0 Yrs (Fresher)', 'Snehal_Patil_Resume.pdf', 'Campus Recruitment Partner', 'CV Shortlisting', 1, 'In Progress', 8.3);

INSERT INTO `candidate_skills` (`candidate_id`, `skill_name`) VALUES
  ('cand-2', 'Data Structures'),
  ('cand-2', 'Java'),
  ('cand-2', 'SQL'),
  ('cand-2', 'Problem Solving');

INSERT INTO `candidate_scores` (`candidate_id`, `cv_screening`, `tech_assessment`, `tech_interview`, `hr_round`, `overall`) VALUES
  ('cand-2', 8.2, 8.4, NULL, NULL, 8.3);

INSERT INTO `candidate_roadmap` (`candidate_id`, `step_number`, `title`, `evaluator`, `status`, `score_label`) VALUES
  ('cand-2', 1, 'CV Shortlisting', 'Neha Gupta (HR Recruiter)', 'In Progress', '8.2 / 10'),
  ('cand-2', 2, 'Technical Round', 'Vikram Malhotra (Tech Round Interviewer)', 'Upcoming', 'Pending'),
  ('cand-2', 3, 'Final HR Round', 'Priya Kulkarni (Final HR Interviewer)', 'Upcoming', 'Pending'),
  ('cand-2', 4, 'Offer & Selection', 'TalentTrack Leadership', 'Upcoming', 'Pending');


-- Candidate 3: Ankit Verma (In Final HR Round)
INSERT INTO `candidates` 
  (`id`, `tracking_code`, `name`, `initials`, `email`, `phone`, `address`, `role`, `tier`, `experience`, `resume_name`, `referral_name`, `stage`, `current_step`, `status`, `overall_score`)
VALUES
  ('cand-3', 'TT-2026-3392', 'Ankit Verma', 'AV', 'ankit.verma@example.com', '+91 98111 22334', 'Hitec City, Hyderabad, Telangana', 'Software Development Engineer II (Backend)', 'Mid-Level', '4 Yrs', 'Ankit_Verma_Resume.pdf', 'Amitabh Sen (Engineering Director)', 'Final HR Round', 3, 'Shortlisted by Tech Team', 9.1);

INSERT INTO `candidate_skills` (`candidate_id`, `skill_name`) VALUES
  ('cand-3', 'Golang'),
  ('cand-3', 'Microservices'),
  ('cand-3', 'PostgreSQL'),
  ('cand-3', 'Docker'),
  ('cand-3', 'Kafka');

INSERT INTO `candidate_scores` (`candidate_id`, `cv_screening`, `tech_assessment`, `tech_interview`, `hr_round`, `overall`) VALUES
  ('cand-3', 8.8, 9.4, 9.2, 9.0, 9.1);

INSERT INTO `candidate_roadmap` (`candidate_id`, `step_number`, `title`, `evaluator`, `status`, `score_label`) VALUES
  ('cand-3', 1, 'CV Shortlisting', 'Neha Gupta (HR Recruiter)', 'Completed', '8.8 / 10'),
  ('cand-3', 2, 'Technical Round', 'Vikram Malhotra (Tech Round Interviewer)', 'Completed', '9.2 / 10'),
  ('cand-3', 3, 'Final HR Round', 'Priya Kulkarni (Final HR Interviewer)', 'In Progress', '9.0 / 10'),
  ('cand-3', 4, 'Offer & Selection', 'TalentTrack Leadership', 'Upcoming', 'Pending');

INSERT INTO `evaluation_audit_log` (`candidate_id`, `action_by`, `action_role`, `stage`, `status`, `score_given`, `note`) VALUES
  ('cand-3', 'Neha Gupta', 'HR Recruiter', 'Step 1: CV Shortlisting', 'Completed', 8.8, 'Resume credentials verified. Rating: 8.8/10.'),
  ('cand-3', 'Vikram Malhotra', 'Tech Round Interviewer', 'Step 2: Technical Round', 'Shortlisted by Tech Team', 9.2, 'Tech Interview Cleared with Score: 9.2/10.');


-- Candidate 4: Harsh Vardhan (Application Concluded / Rejected in Tech Round)
INSERT INTO `candidates` 
  (`id`, `tracking_code`, `name`, `initials`, `email`, `phone`, `password`, `address`, `role`, `tier`, `experience`, `resume_name`, `referral_name`, `stage`, `current_step`, `status`, `overall_score`)
VALUES
  ('cand-4', 'TT-2026-4409', 'Harsh Vardhan', 'HV', 'harsh.v@example.com', '+91 97112 33445', 'Candidate@123', 'Whitefield, Bengaluru, Karnataka', 'Associate Frontend Engineer', 'Fresher', '0 - 1 Yr', 'Harsh_Vardhan_Resume.pdf', NULL, 'Application Concluded', 2, 'Rejected', 5.8);

INSERT INTO `candidate_skills` (`candidate_id`, `skill_name`) VALUES
  ('cand-4', 'HTML5'),
  ('cand-4', 'CSS3'),
  ('cand-4', 'JavaScript Basics');

INSERT INTO `candidate_scores` (`candidate_id`, `cv_screening`, `tech_assessment`, `tech_interview`, `hr_round`, `overall`) VALUES
  ('cand-4', 7.2, 6.0, 5.4, NULL, 5.8);

INSERT INTO `candidate_roadmap` (`candidate_id`, `step_number`, `title`, `evaluator`, `status`, `score_label`) VALUES
  ('cand-4', 1, 'CV Shortlisting', 'Neha Gupta (HR Recruiter)', 'Completed', '7.2 / 10'),
  ('cand-4', 2, 'Technical Round', 'Vikram Malhotra (Tech Round Interviewer)', 'Rejected', '5.4 / 10'),
  ('cand-4', 3, 'Final HR Round', 'Priya Kulkarni (Final HR Interviewer)', 'Not Applicable', 'N/A'),
  ('cand-4', 4, 'Offer & Selection', 'TalentTrack Leadership', 'Not Applicable', 'N/A');

INSERT INTO `evaluation_audit_log` (`candidate_id`, `action_by`, `action_role`, `stage`, `status`, `score_given`, `note`) VALUES
  ('cand-4', 'Neha Gupta', 'HR Recruiter', 'Step 1: CV Shortlisting', 'Completed', 7.2, 'Screening cleared with 7.2/10.'),
  ('cand-4', 'Vikram Malhotra', 'Tech Round Interviewer', 'Step 2: Technical Round', 'Rejected', 5.4, 'Technical Round score 5.4/10 did not meet minimum threshold 7.0/10.');

-- ==============================================================================
-- 8. CONVENIENCE VIEWS FOR MYSQL WORKBENCH
-- Allows viewing candidate data without manually writing JOINs on candidate_id
-- ==============================================================================
CREATE OR REPLACE VIEW `vw_candidate_full_profile` AS
SELECT 
    c.id AS cand_id,
    c.tracking_code,
    c.name,
    c.email,
    c.phone,
    c.role,
    c.tier,
    c.experience,
    c.stage,
    c.status,
    c.referral_name,
    c.resume_name,
    s.cv_screening    AS resume_rating_out_of_10,
    s.tech_assessment AS tech_test_score,
    s.tech_interview  AS tech_interview_score,
    s.hr_round        AS hr_round_score,
    s.overall         AS overall_score,
    c.created_at
FROM `candidates` c
LEFT JOIN `candidate_scores` s ON c.id = s.candidate_id;

-- ==============================================================================
-- END OF SCHEMA & SEED SCRIPT
-- ==============================================================================

