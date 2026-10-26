# TalentTrack Spring Boot 3 Enterprise Backend Guide

TalentTrack's backend is powered entirely by **Java 17 (LTS)** and **Spring Boot 3**, connecting natively to the **MySQL** relational database (`talenttrack_db`) on port `3306`.

---

## 1. Architecture Overview (Standard Spring Tool Suite / Maven Structure)

```
TalentTrack/
├── pom.xml                                               # Standard Maven build descriptor with Spring Boot 3 & DevTools
├── .project                                              # STS / Eclipse project definition (Spring Boot & Maven natures)
├── .classpath                                            # STS Java 17 & Maven Classpath container
├── .settings/                                            # Eclipse / STS compiler & Maven preferences
├── TalentTrackApplication.launch                         # STS 1-Click Run configuration
├── src/main/
│   ├── java/com/talenttrack/
│   │   ├── TalentTrackApplication.java                   # Spring Boot entry point (Run As -> Spring Boot App)
│   │   ├── config/
│   │   │   └── WebMvcConfig.java                         # CORS & Static asset serving (serves UI directly from static resources)
│   │   ├── controller/
│   │   │   ├── AuthController.java                       # POST /api/login (Role authentication & candidate check)
│   │   │   ├── CandidateController.java                  # GET /api/candidates, POST /api/apply, POST /api/candidates/update-stage, GET /api/track
│   │   │   ├── JobController.java                        # GET /api/jobs (11 company openings by tier)
│   │   │   ├── StatsController.java                      # GET /api/stats (Pipeline distributions & metrics)
│   │   │   ├── FeedbackController.java                   # POST /api/feedback
│   │   │   └── DatabaseStatusController.java             # GET /api/database/status
│   │   ├── dao/
│   │   │   ├── CandidateDao.java                         # Relational persistence across candidates, scores, roadmap, skills, & audit log
│   │   │   ├── JobDao.java                               # Open positions query engine
│   │   │   └── UserAuthDao.java                          # Staff & user credential repository
│   │   ├── dto/
│   │   │   ├── ApplyRequest.java                         # Candidate application payload
│   │   │   ├── LoginRequest.java                         # Authentication payload
│   │   │   ├── LoginResponse.java                        # Standard user token & profile response
│   │   │   └── UpdateStageRequest.java                   # Stage transition & 10-point scoring payload
│   │   └── model/
│   │       ├── Candidate.java                            # Candidate entity
│   │       ├── CandidateScores.java                      # 10-point ratings (CV, Tech test, Tech interview, HR round)
│   │       ├── RoadmapItem.java                          # 4-stage milestone step
│   │       ├── AuditLogItem.java                         # Timestamped evaluation history
│   │       ├── Job.java                                  # Requisition entity
│   │       └── UserAuth.java                             # Authenticated identity
│   └── resources/
│       ├── application.properties                        # Server port (3000), MySQL connection, HikariCP pool
│       ├── schema.sql                                    # Database schema & initial seed data
│       └── static/                                       # Packaged UI Web Application
│           ├── index.html                                # TalentTrack Single Page Web App
│           ├── styles.css                                # Design System & Styling
│           ├── app.js                                    # Frontend logic & API integration
│           ├── logo-preview.html                         # Logo showcase
│           └── assets/                                   # SVG and brand assets
└── src/test/
    └── java/com/talenttrack/
        └── TalentTrackApplicationTests.java              # Unit & Integration test harness
```

---

## 2. Configuration (`src/main/resources/application.properties`)

```properties
server.port=3000
spring.application.name=talenttrack-backend

# MySQL DataSource
spring.datasource.url=jdbc:mysql://localhost:3306/talenttrack_db?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC&characterEncoding=UTF-8&createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=root
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# HikariCP Connection Pool
spring.datasource.hikari.maximum-pool-size=10
spring.datasource.hikari.minimum-idle=2
```

---

## 3. How to Run in Spring Tool Suite (STS) - Pure IDE Workflow

> [!NOTE]
> No PowerShell terminal, no command line, and no external scripts required. Everything runs inside STS GUI.

### Step 1: Open STS & Import Project
1. Open **Spring Tool Suite 4 (STS)**.
2. In the top menu, click **File** -> **Import...**
3. Select **Maven** -> **Existing Maven Projects**, then click **Next**.
4. Set Root Directory to: `D:\Projects\TalentTrack`
5. Ensure `pom.xml` is checked and click **Finish**.
*(STS will automatically configure dependencies and compile the workspace)*.

### Step 2: Run the Application (Choose any 1 method)
- **Method 1 (Boot Dashboard - Recommended)**:
  Look at the **Spring Boot Dashboard** tab (usually at the bottom-left of STS). Click on `talenttrack-backend` and click the **(Re)start** green play button.
- **Method 2 (Run As Spring Boot App)**:
  Right-click `TalentTrackApplication.java` in Package Explorer -> **Run As** -> **Spring Boot App**.
- **Method 3 (Preconfigured Launch File)**:
  Click the top green **Run** button (using the preconfigured `TalentTrackApplication.launch`).

### Step 3: Access Application
- Open your browser to: **[http://localhost:3000/](http://localhost:3000/)**
- The TalentTrack Web UI loads directly from Spring Boot!

---

## 4. Endpoints & REST API Specifications

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` or `/index.html` | Serves the main TalentTrack web application. |
| `GET` | `/api/jobs` | Returns all 11 open requisitions grouped by Fresher, Mid, and Senior tiers. |
| `POST` | `/api/login` | Authenticates Candidates, HR Recruiters, Tech Interviewers, and Final HR Leads. |
| `GET` | `/api/candidates` | Returns candidate profiles with multi-round roadmaps and 10-point evaluation ratings. |
| `POST` | `/api/apply` | Registers candidate applications, generating tracking codes (`TT-2026-XXXX`). |
| `POST` | `/api/candidates/update-stage` | Updates candidate stage, persists 10-point scorecard ratings, and inserts audit logs. |
| `GET` | `/api/track` | Tracks candidate hiring progression using tracking code or email. |
| `GET` | `/api/stats` | Pipeline statistics and conversion funnel breakdown. |
| `GET` | `/api/database/status` | Reports live Spring Boot 3 framework details and MySQL connection status. |

---

## 5. Default Credentials

| Role | Name | Email | Password |
| :--- | :--- | :--- | :--- |
| **Candidate** | Rahul Sharma | `rahul@talenttrack.com` | `Candidate@123` |
| **Candidate** | Snehal Patil | `snehal@engineering.edu` | `Candidate@123` |
| **Candidate** | Harsh Vardhan | `harsh.v@example.com` | `Candidate@123` |
| **HR Recruiter** | Neha Gupta | `neha@talenttrack.com` | `TalentTrack2026!` |
| **Tech Round Interviewer** | Vikram Malhotra | `vikram@talenttrack.com` | `TalentTrack2026!` |
| **Final HR Lead** | Priya Kulkarni | `priya@talenttrack.com` | `TalentTrack2026!` |
