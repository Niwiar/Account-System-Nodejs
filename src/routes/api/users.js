const express = require('express');
const router = express.Router();
const userControl = require('../../controllers/userController');
const {userLists, delUser} = require('../../controllers/usersController');

router.use('/', (req, res, next) => {
    
    console.log('admin route')
    console.log(req.body)
    next();
})
//users list
router.post('/', userLists);
router.delete('/user', delUser)

module.exports = router;