INSERT INTO users 
    (
        username,
        email,
        password,
        avatar_url,
        roles
    )
VALUES (
        @username,
        @email,
        @password,
        @avatar_url,
        @roles
)

SELECT SCOPE_IDENTITY() AS userId