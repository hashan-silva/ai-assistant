package com.helpclub.platform.repository;

import com.helpclub.platform.domain.SessionToken;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SessionTokenRepository extends JpaRepository<SessionToken, Long> {
    Optional<SessionToken> findByToken(String token);
}
