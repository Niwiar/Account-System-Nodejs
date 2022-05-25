const userData = require('../data/users');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const refreshToken = async (req, res, next) => {
    const cookies = req.cookies;
    if (!cookies.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;
    // console.log(refreshToken)
    const user = await userData.findToken(refreshToken)
    if (user.length !== 1) return res.sendStatus(403); //Forbidden
    //evaluate jwt
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err || user[0].email !== decoded.userInfo.user_email) return res.sendStatus(403);
            const roles = Object.values(JSON.parse(user[0].roles));
            const accessToken = jwt.sign(
                {
                    "userInfo": {
                        "user_email": decoded.userInfo.user_email,
                        "user_roles": roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '30m'}
            );
            // res.json({ accessToken });
            console.log( accessToken )
            res.redirect('/');
        }
    );
}

module.exports = { refreshToken }