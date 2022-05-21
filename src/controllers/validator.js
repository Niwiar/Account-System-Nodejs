const { body } = require('express-validator');
const { findEmail } = require('../data/users');

exports.validateLogin = [
    body('user_email').custom(async (value) => {
        let emailCheck = await findEmail(value)
        if (emailCheck.length === 1) {
            return true
        }
        return Promise.reject('Invalid Email Address');
    }),
    body('user_pass', 'Password is empty').trim().not().isEmpty()
];

exports.validateRegister = [
    body('user_email', 'Invalid Email Address').isEmail().custom( async (value) => {
        let emailCheck = await findEmail(value)
        if (emailCheck.length > 0) {
            return Promise.reject('This email already in use');
        }
        return true;
    }),
    body('user_name', 'Username is empty!').trim().not().isEmpty(),
    body('user_pass', 'The password must be of minimum length 6 characters').trim().isLength({min: 6})
];

exports.validateEdit = [
    body('user_name', 'Username is empty!').trim().not().isEmpty(),
    body('user_pass', 'The password must be of minimum length 6 characters').trim().isLength({min: 6})
];

