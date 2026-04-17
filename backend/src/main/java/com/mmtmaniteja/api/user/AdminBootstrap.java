package com.mmtmaniteja.api.user;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Creates the admin user on first boot using credentials from the environment.
 * Keeps the Flyway migrations free of secrets and lets you rotate the password
 * via env vars + a restart.
 *
 * Controlled by {@code ADMIN_USERNAME} and {@code ADMIN_PASSWORD} env vars.
 * If the user already exists, does nothing.
 */
@Component
public class AdminBootstrap {

    private static final Logger log = LoggerFactory.getLogger(AdminBootstrap.class);

    private final UserRepository users;
    private final PasswordEncoder encoder;
    private final String adminUsername;
    private final String adminPassword;

    public AdminBootstrap(UserRepository users,
                          PasswordEncoder encoder,
                          @Value("${app.admin.username:}") String adminUsername,
                          @Value("${app.admin.password:}") String adminPassword) {
        this.users = users;
        this.encoder = encoder;
        this.adminUsername = adminUsername;
        this.adminPassword = adminPassword;
    }

    /** Minimum acceptable length for the seeded admin password. */
    private static final int MIN_PASSWORD_LENGTH = 12;

    @EventListener(ApplicationReadyEvent.class)
    @Transactional
    public void seed() {
        if (adminUsername.isBlank() || adminPassword.isBlank()) {
            log.warn("ADMIN_USERNAME / ADMIN_PASSWORD not set — skipping admin bootstrap.");
            return;
        }
        if (users.findByUsername(adminUsername).isPresent()) {
            log.info("Admin user '{}' already exists — leaving password untouched.", adminUsername);
            return;
        }
        // Fail loudly rather than silently seeding a guessable password. Rotate
        // ADMIN_PASSWORD to something ≥ 12 chars (mix of classes preferred) and
        // restart to continue.
        if (adminPassword.length() < MIN_PASSWORD_LENGTH) {
            log.error("ADMIN_PASSWORD is shorter than {} characters — refusing to seed admin user. "
                    + "Generate a strong password (e.g. `openssl rand -base64 24`) and restart.",
                    MIN_PASSWORD_LENGTH);
            return;
        }
        User u = new User();
        u.setUsername(adminUsername);
        u.setPasswordHash(encoder.encode(adminPassword));
        u.setRole(User.Role.ADMIN);
        users.save(u);
        log.info("Created admin user '{}'.", adminUsername);
    }
}
