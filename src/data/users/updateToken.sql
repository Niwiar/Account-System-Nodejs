UPDATE users
SET token = @token
WHERE email = @email
SELECT * FROM users
WHERE email = @email