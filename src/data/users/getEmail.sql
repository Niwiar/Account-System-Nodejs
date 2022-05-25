SELECT userId,
       username,
       email,
       password,
       avatar_url,
       roles
FROM users
WHERE email = @email