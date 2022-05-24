UPDATE users
SET token = ''
WHERE token = @token
SELECT * FROM users
WHERE token = @token