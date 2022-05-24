const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (req, res, next) => {
   console.log(req.body)
   const authHeader = req.body.token || req.query.token || req.headers['authorization'];
   if (!authHeader) return res.status(401).send('A token is required for authentication');
   console.log(authHeader); //Bearer token
   // const token = authHeader.split(' ')[1];
   jwt.verify(authHeader, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) return res.status(403).send("Invalid Token");
      req.body.user_email = decoded.user_email
      next();
   });
}

module.exports = verifyToken;