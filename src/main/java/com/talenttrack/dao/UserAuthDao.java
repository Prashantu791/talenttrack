package com.talenttrack.dao;

import com.talenttrack.model.UserAuth;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Optional;

@Repository
public class UserAuthDao {

    private final JdbcTemplate jdbcTemplate;

    public UserAuthDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private static final RowMapper<UserAuth> ROW_MAPPER = new RowMapper<>() {
        @Override
        public UserAuth mapRow(ResultSet rs, int rowNum) throws SQLException {
            UserAuth u = new UserAuth();
            u.setId(rs.getInt("id"));
            u.setUsername(rs.getString("username"));
            u.setEmail(rs.getString("email"));
            u.setPassword(rs.getString("password"));
            u.setRole(rs.getString("role"));
            u.setName(rs.getString("name"));
            u.setTitle(rs.getString("title"));
            u.setInitials(rs.getString("initials"));
            u.setIsActive(rs.getBoolean("is_active"));
            return u;
        }
    };

    public Optional<UserAuth> findByEmail(String email) {
        try {
            String sql = "SELECT * FROM users_auth WHERE LOWER(email) = LOWER(?) LIMIT 1";
            UserAuth user = jdbcTemplate.queryForObject(sql, ROW_MAPPER, email);
            return Optional.ofNullable(user);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    public Optional<UserAuth> findByUsername(String username) {
        try {
            String sql = "SELECT * FROM users_auth WHERE LOWER(username) = LOWER(?) LIMIT 1";
            UserAuth user = jdbcTemplate.queryForObject(sql, ROW_MAPPER, username);
            return Optional.ofNullable(user);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    public Optional<UserAuth> findByRole(String role) {
        try {
            String sql = "SELECT * FROM users_auth WHERE role = ? LIMIT 1";
            UserAuth user = jdbcTemplate.queryForObject(sql, ROW_MAPPER, role);
            return Optional.ofNullable(user);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }
}
