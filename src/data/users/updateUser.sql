UPDATE users
SET username = @username, password = @password
WHERE email = @email
SELECT * FROM users
WHERE email = @email