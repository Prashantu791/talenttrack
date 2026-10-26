# TalentTrack - Spring Tool Suite (STS) Enterprise Edition

TalentTrack is an Enterprise Recruitment & Candidate Evaluation Portal built with **Java 17 (LTS)**, **Spring Boot 3**, and **MySQL**.

This project is configured for **Spring Tool Suite 4 (STS)** with **zero PowerShell / command line dependencies**.

---

## 🚀 How to Run in STS (Spring Tool Suite 4)

### 1. Import Project into STS
1. Open **STS (Spring Tool Suite 4)**.
2. Go to **File** -> **Import...**
3. Select **Maven** -> **Existing Maven Projects** and click **Next**.
4. Browse and select `D:\Projects\TalentTrack`.
5. Ensure `pom.xml` is selected and click **Finish**.

### 2. Run the Application
You can run it in STS using any of these 3 simple GUI actions:
* **Option 1 (Boot Dashboard)**: In the **Boot Dashboard** (bottom-left in STS), select `talenttrack-backend` and click **(Re)start** (green play icon).
* **Option 2 (Run As)**: Right-click `TalentTrackApplication.java` -> **Run As** -> **Spring Boot App**.
* **Option 3 (Run Configuration)**: Select the included `TalentTrackApplication` launch profile from the Run toolbar.

### 3. Open in Browser
Visit **[http://localhost:3000/](http://localhost:3000/)**
The entire web interface, API backend, and candidate tracking dashboard are served directly.

---

## 🗄️ Database Setup (MySQL)
* Database name: `talenttrack_db`
* Configuration file: `src/main/resources/application.properties`
* Schema & Seed Data: `src/main/resources/schema.sql` (can be executed directly in STS SQL Scrapbook, MySQL Workbench, phpMyAdmin, or DBeaver).
