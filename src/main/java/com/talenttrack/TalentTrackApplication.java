package com.talenttrack;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class TalentTrackApplication {

    public static void main(String[] args) {
        SpringApplication.run(TalentTrackApplication.class, args);
        System.out.println("==================================================================");
        System.out.println("🚀 TalentTrack Spring Boot 3 Backend active on http://localhost:3000/");
        System.out.println("   Connected to MySQL: talenttrack_db on port 3306");
        System.out.println("   Serving frontend & REST APIs seamlessly");
        System.out.println("==================================================================");
    }
}
