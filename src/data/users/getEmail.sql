SELECT userId,
       username,
       email,
       password,
       avatar_url
FROM users
WHERE email = @email