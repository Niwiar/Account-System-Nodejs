INSERT INTO users 
    (
        username,
        email,
        password,
        avatar_url
    )
VALUES (
        @username,
        @email,
        @password,
        @avatar_url
)

SELECT SCOPE_IDENTITY() AS userId