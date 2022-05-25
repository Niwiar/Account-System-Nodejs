UPDATE users
SET avatar_url = @url
WHERE userId = @userId
SELECT * FROM users
WHERE userId = @userId