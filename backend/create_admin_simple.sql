-- Create admin user directly in SQLite
-- Password hash for 'admin123' using bcrypt
INSERT INTO users (
    email, 
    password_hash, 
    role, 
    is_active, 
    is_approved, 
    is_verified,
    tenant_id,
    created_at,
    updated_at
) VALUES (
    'admin@zemensystem.com',
    '$2b$12$LQv3c1yqBwEHFuryHnS.sO8J8jVlNvBAePq4B2F8WdHzeUwHFu3jK',
    'admin',
    1,
    1,
    1,
    NULL,
    datetime('now'),
    datetime('now')
);

-- Display the created admin
SELECT 'Admin user created:' as message;
SELECT id, email, role, is_active, is_approved, is_verified FROM users WHERE role = 'admin';