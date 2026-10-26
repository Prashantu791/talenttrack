# TalentTrack MySQL Database System

TalentTrack supports **MySQL** for robust relational storage of candidate records, CV screening ratings out of 10, technical & HR scores, roadmap progression milestones, and decision audit trails.

---

## 1. Database Architecture & Tables

The schema is defined in [`database/schema.sql`](file:///d:/Projects/TalentTrack/database/schema.sql):

```
talenttrack_db
├── jobs                       (11 open requisitions with tier, department, salary)
├── users_auth                 (Recruiter & Interviewer login credentials)
├── candidates                 (Master candidate profiles, referral, resume, tracking)
│   ├── candidate_skills       (Normalized skills: React, Go, Java, Docker, etc.)
│   ├── candidate_scores       (Round-by-round ratings out of 10 for CV, Tech, and HR)
│   ├── candidate_roadmap      (Progressive 4-milestone hiring journey)
│   └── evaluation_audit_log   (Timestamped decisions by Neha Gupta, Vikram Malhotra, etc.)
```

### Table Details:

| Table | Purpose | Key Columns |
| :--- | :--- | :--- |
| **`users_auth`** | Candidate & Staff Authentication | `id`, `username`, `email`, `password`, `role`, `name`, `title` |
| **`candidates`** | Candidate core identity | `id`, `tracking_code`, `name`, `email`, `phone`, `password`, `role`, `tier`, `resume_name`, `referral_name`, `stage`, `status` |
| **`candidate_scores`** | Ratings out of 10 | `cv_screening` (Neha Gupta), `tech_assessment`, `tech_interview` (Vikram Malhotra), `hr_round` (Priya Kulkarni), `overall` |
| **`candidate_roadmap`** | 4 Hiring Milestones | `step_number`, `title`, `evaluator`, `status` (Completed, In Progress, Upcoming), `score_label` |
| **`evaluation_audit_log`** | Decision tracking | `action_by`, `action_role`, `stage`, `status`, `score_given`, `note`, `created_at` |
| **`jobs`** | Company Openings | `id`, `title`, `tier`, `department`, `experience`, `location`, `salary` |

### Default Stored Usernames & Passwords:

| User Type | Name | Role Key | Username / Email | Password |
| :--- | :--- | :--- | :--- | :--- |
| **Candidate** | Rahul Sharma | `candidate` | `rahul@talenttrack.com` | `Candidate@123` |
| **Candidate** | Snehal Patil | `candidate` | `snehal@engineering.edu` | `Candidate@123` |
| **Candidate** | Ankit Verma | `candidate` | `ankit.verma@example.com` | `Candidate@123` |
| **HR Recruiter** | Neha Gupta | `hr_screener` | `neha@talenttrack.com` | `TalentTrack2026!` |
| **Tech Interviewer** | Vikram Malhotra | `tech_interviewer` | `vikram@talenttrack.com` | `TalentTrack2026!` |
| **Final HR Lead** | Priya Kulkarni | `hr_interviewer` | `priya@talenttrack.com` | `TalentTrack2026!` |

---

## 2. Configuration (`database/mysql_config.json`)

Edit [`database/mysql_config.json`](file:///d:/Projects/TalentTrack/database/mysql_config.json) if you have customized MySQL credentials:

```json
{
  "host": "localhost",
  "port": 3306,
  "user": "root",
  "password": "",
  "database": "talenttrack_db",
  "enabled": true
}
```

---

## 3. How to Initialize the MySQL Database

### Option A: Using STS (Spring Tool Suite) or Spring Boot
The schema is placed at `src/main/resources/schema.sql`. You can:
1. Open STS, right-click `schema.sql` -> **Execute All** (or open in SQL Scrapbook).
2. Or let Spring Boot auto-initialize by enabling `spring.sql.init.mode=always` in `application.properties`.

### Option B: Using MySQL CLI Terminal
```bash
mysql -u root -p < database/schema.sql
```

### Option C: Using phpMyAdmin / HeidiSQL / MySQL Workbench
1. Open phpMyAdmin (`http://localhost/phpmyadmin`) or MySQL Workbench.
2. Click **Import** or **Open SQL Script**.
3. Select `database/schema.sql`.
4. Click **Go** / **Execute**.

---

## 4. REST API Integration Endpoints

| Endpoint | Method | Action |
| :--- | :--- | :--- |
| `/api/candidates` | `GET` | Fetches all candidates from the database. |
| `/api/apply` | `POST` | Registers a candidate with CV, referral, and initial scores. |
| `/api/login` | `POST` | Authenticates users; candidates must have submitted an application to log in. |
| `/api/candidates/update-stage` | `POST` | Updates candidate stage, scores out of 10, and audit log. |
| `/api/database/status` | `GET` | Reports live MySQL connection status and engine details. |
