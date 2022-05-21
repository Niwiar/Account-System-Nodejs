const express = require('express');
const userController = require('../controllers/userController_old');
const router = express.Router();

const {showUser, userRegister} = userController;

router.use((req, res, next) => {
    console.log('middleware');
    next();
})


module.exports = {
    routes: router
}