const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (req, res, next) => {
   const authHeader = req.body.token || req.query.token || req.headers.authorization || req.headers.Authorization;
   if (!authHeader) return res.sendStatus(401);
   // console.log(authHeader); //Bearer token
   // const token = authHeader.split(' ')[1];
   jwt.verify(authHeader, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) return res.sendStatus(403); // invalid token
      req.body.user_email = decoded.userInfo.user_email
      req.roles = decoded.userInfo.user_roles
      next();
   });
}

module.exports = verifyToken;