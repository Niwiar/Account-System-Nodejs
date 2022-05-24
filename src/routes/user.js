const express = require('express');
const router = express.Router();
const userControl = require('../controllers/userController');
const { validateEdit } = require('../controllers/validator');


//Edit
router.post('/edit', validateEdit, userControl.edit);

module.exports = router;