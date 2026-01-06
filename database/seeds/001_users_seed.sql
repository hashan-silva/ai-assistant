INSERT INTO user_accounts (email, password_hash, role, created_at)
VALUES ('seeker@example.com', '$2a$10$7EqJtq98hPqEX7fNZaFWoOe9YwJxEvuS/9T1JcWn2NiZdv7G.v9P2', 'JOB_SEEKER', CURRENT_TIMESTAMP);

INSERT INTO user_accounts (email, password_hash, role, created_at)
VALUES ('poster@example.com', '$2a$10$7EqJtq98hPqEX7fNZaFWoOe9YwJxEvuS/9T1JcWn2NiZdv7G.v9P2', 'JOB_POSTER', CURRENT_TIMESTAMP);

INSERT INTO job_seeker_profiles (user_id, full_name, headline, skills, location, experience_summary, updated_at)
VALUES (
    (SELECT id FROM user_accounts WHERE email = 'seeker@example.com'),
    'Sample Seeker',
    'Java/Spring Developer',
    'Java, Spring Boot, REST, SQL',
    'Remote',
    '3 years building APIs and microservices.',
    CURRENT_TIMESTAMP
);

INSERT INTO job_poster_profiles (user_id, company_name, contact_name, contact_title, location, updated_at)
VALUES (
    (SELECT id FROM user_accounts WHERE email = 'poster@example.com'),
    'Helpclub',
    'Alex Recruiter',
    'Talent Lead',
    'Remote',
    CURRENT_TIMESTAMP
);

INSERT INTO job_posts (poster_id, title, description, location, skills, status, created_at)
VALUES (
    (SELECT id FROM user_accounts WHERE email = 'poster@example.com'),
    'Backend Engineer',
    'Build and scale the Helpclub backend platform.',
    'Remote',
    'Java, Spring Boot, Oracle, REST',
    'OPEN',
    CURRENT_TIMESTAMP
);
