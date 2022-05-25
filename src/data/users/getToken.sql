SELECT userId,
       username,
       email,
       password,
       avatar_url,
       token,
       roles
FROM users
WHERE token = @token