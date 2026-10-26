package com.talenttrack.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.util.Map;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class LoginResponse {
    private Boolean success;
    private String token;
    private Map<String, Object> user;
    private String error;
    private String message;

    public LoginResponse() {}

    public static LoginResponse ok(String token, Map<String, Object> user) {
        LoginResponse r = new LoginResponse();
        r.setSuccess(true);
        r.setToken(token);
        r.setUser(user);
        return r;
    }

    public static LoginResponse failure(String error, String message) {
        LoginResponse r = new LoginResponse();
        r.setSuccess(false);
        r.setError(error);
        r.setMessage(message);
        return r;
    }

    public Boolean getSuccess() { return success; }
    public void setSuccess(Boolean success) { this.success = success; }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public Map<String, Object> getUser() { return user; }
    public void setUser(Map<String, Object> user) { this.user = user; }

    public String getError() { return error; }
    public void setError(String error) { this.error = error; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
