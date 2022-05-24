const userData = require('../data/users');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const refreshToken = async (req, res, next) => {
    const cookies = req.cookies;
    if (!cookies.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;
    const user = await userData.findToken(refreshToken)
    if (user.length !== 1) return res.sendStatus(403); //Forbidden
    //evaluate jwt
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            console.log(user[0].email)
            if (err || user[0].email !== decoded.user_email) return res.sendStatus(403);
            const accessToken = jwt.sign(
                { "user_email": decoded.user_email },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '1m'}
            );
            // res.json({ accessToken });
            console.log( accessToken )
            res.redirect('/');
        }
    );
}

module.exports = { refreshToken }