package com.helpclub.platform.config;

import com.helpclub.platform.domain.UserAccount;
import com.helpclub.platform.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Optional;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class AuthInterceptor implements HandlerInterceptor {

    private final AuthService authService;

    public AuthInterceptor(AuthService authService) {
        this.authService = authService;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
        throws IOException {
        String path = request.getRequestURI();
        if (path.startsWith("/api/auth")
            || path.startsWith("/api/health")
            || path.startsWith("/v3/api-docs")
            || path.startsWith("/swagger-ui")) {
            return true;
        }

        String token = request.getHeader("X-Auth-Token");
        Optional<UserAccount> user = authService.authenticate(token);
        if (user.isEmpty()) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.getWriter().write("{\"error\":\"unauthorized\"}");
            return false;
        }
        request.setAttribute("authUser", user.get());
        return true;
    }
}
