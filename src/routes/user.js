const express = require('express');
const router = express.Router();
const userControl = require('../controllers/userController');
const { validateEdit } = require('../controllers/validator');
const { ROLES_LIST } = require('../../config')
const verifyRoles = require('../middleware/verifyRoles');
const admin = require('./api/users');

//Edit
router.post('/edit', validateEdit, verifyRoles(ROLES_LIST.Editor, ROLES_LIST.Admin), userControl.edit);
//Delete
router.post('/delete', verifyRoles(ROLES_LIST.Admin), userControl.del);
//users list
router.get('/admin', verifyRoles(ROLES_LIST.Admin), (req, res, next) => {
    try {
        res.render('list');
    } catch (err) {
        res.status(400).send(err.message);
    }
});
//users
router.use('/users', verifyRoles(ROLES_LIST.Admin), admin);

module.exports = router;