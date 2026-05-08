INSERT INTO users (
  email,
  password,
  role,
  firstname,
  lastname,
  is_active
)
SELECT
  'admin@admin',
  '$2b$10$tM96oPzD5.E8.k6M6zRkOe/uA7GkI0Y4e6r8Y9K1kYq9r7u5Yy6mO', -- Hash de 'admin'
  'admin',
  'Super',
  'Admin',
  TRUE
WHERE NOT EXISTS (
  SELECT 1
  FROM users
  WHERE email = 'admin@admin'
);
