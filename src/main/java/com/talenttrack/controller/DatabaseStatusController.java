package com.talenttrack.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/database")
public class DatabaseStatusController {

    private final JdbcTemplate jdbcTemplate;

    public DatabaseStatusController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getDatabaseStatus() {
        boolean isConnected = false;
        try {
            Integer result = jdbcTemplate.queryForObject("SELECT 1", Integer.class);
            isConnected = result != null && result == 1;
        } catch (Exception ignored) {}

        Map<String, Object> status = new HashMap<>();
        status.put("database_engine", "MySQL");
        status.put("database_name", "talenttrack_db");
        status.put("host", "localhost");
        status.put("port", 3306);
        status.put("user", "root");
        status.put("backend_runtime", "Java 17 (OpenJDK / LTS) + Spring Boot 3");
        status.put("framework", "Spring Boot 3.5.5 (Spring Web & Spring JDBC)");
        status.put("is_mysql_running", isConnected);
        status.put("active_mode", isConnected ? "Live Spring Boot 3 & MySQL Relational Database" : "Database Connection Warning");
        status.put("schema_file", "database/schema.sql");
        status.put("config_file", "src/main/resources/application.properties");

        return ResponseEntity.ok(status);
    }
}
