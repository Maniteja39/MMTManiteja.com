package com.mmtmaniteja.api.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * Defined separately from {@link SecurityConfig} to avoid a circular dependency between
 * the SecurityFilterChain bean and {@code CustomUserDetailsService} (which needs the encoder).
 */
@Configuration
public class PasswordConfig {

    /**
     * BCrypt with 12 rounds (~200ms per hash on typical hardware). The default is 10,
     * which is no longer recommended; 12 is the current floor for new deployments.
     * Increasing further past ~13 starts costing real request latency at login.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }
}
