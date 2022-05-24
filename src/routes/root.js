const express = require('express');
const router = express.Router();
const userControl = require('../controllers/userController');
const tokenControl = require('../controllers/refreshTokenController');
const { validateLogin, validateRegister, validateAvatar } = require('../controllers/validator');

//Declare custom Middleware
const ifNotLoggedIn = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return res.render('login');
    }
    next();
}

const ifLoggedIn = (req, res, next) => {
    if (req.session.isLoggedIn) {
        return res.redirect('/');
    }
    next();
}


//Router
router.get("/", ifNotLoggedIn, userControl.homePage);
//Register
router.post("/register", ifLoggedIn, validateRegister, userControl.register);
//Login
router.post('/login', ifLoggedIn, validateLogin, userControl.login);
//Logout
router.get('/logout', userControl.logout);
//Delete
router.post('/delete', userControl.del);
//Upload avatar
router.post('/uploadavatar', validateAvatar, userControl.changeAvatar);
//refresh
router.get('/refresh', tokenControl.refreshToken);


module.exports = router;