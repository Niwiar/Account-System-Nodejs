const express = require('express');
const router = express.Router();
const userControl = require('../controllers/userController');
const {validateLogin, validateRegister, validateEdit, validateAvatar} = require('../controllers/validator');

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
//Edit
router.post('/edit', validateEdit, userControl.edit);
//Upload avatar
router.post('/uploadavatar', validateAvatar, userControl.changeAvatar);
//Logout
router.get('/logout', userControl.logout);
//Delete
router.post('/delete', userControl.del);

router.use('/', (req, res) => {
    res.status(404).send('<h1>404 Not Found</h1>')
});


module.exports = router;