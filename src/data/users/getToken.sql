SELECT userId,
       username,
       email,
       password,
       avatar_url,
       token
FROM users
WHERE token = @token