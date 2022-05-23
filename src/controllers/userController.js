const userData = require('../data/users');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const fs = require('fs-extra');
const formidable = require('formidable');
const path = require('path');

const homePage = async (req, res, next) => {
    try {
        let userId = req.session.userID;
        const user = await userData.getUser(userId);
        res.render('home', {
            id: user[0].userId,
            username: user[0].username,
            email: user[0].email,
            password: user[0].password,
            avatar_url: user[0].avatar_url
        });
    } catch (err) {
        res.status(400).send(err.message);
    }
}

const register = async (req, res, next) => {
    const validation_result = validationResult(req);
    const {user_pass} = req.body;
    if (validation_result.isEmpty()) {
        bcrypt.hash(user_pass, 12).then(async (hash_pass) => {
            await userData.createUser(hash_pass, req.body)
            .then(result => {
                res.send('Your account has been created, Now you can <a href="/">Login</a>')
            }).catch(err => {
                if (err) throw err
            })
        }).catch(err => {
            if (err) throw err
        })
    } else {
        let allErrors = validation_result.errors.map((error) => {
            return error.msg;
        })
        res.render('login', {
            register_error: allErrors,
            old_data: req.body
        })
    }
}

const login = async (req, res, next) => {
    const validation_result = validationResult(req);
    const {user_pass, user_email} = req.body;
    if (validation_result.isEmpty()) {
        const user = await userData.findEmail(user_email)
        bcrypt.compare(user_pass, user[0].password)
        .then(compare_result => {
            if (compare_result) {
                req.session.isLoggedIn = true;
                req.session.userID = user[0].userId;
                res.redirect('/');
            } else {
                res.render('login',{
                    login_error: ['Invalid Password']
                })
            }
        }).catch (err => {
            if (err) throw err;
        })
    } else {
        let allErrors = validation_result.errors.map((error) => {
            return error.msg;
       })
       res.render('login', {
           login_error: allErrors
       })
    }
}

const edit = async (req, res, next) => {
    const validation_result = validationResult(req);
    const {user_pass} = req.body;
    if(validation_result.isEmpty()) {
        bcrypt.hash(user_pass, 12).then(async (hash_pass) => {
            await userData.updateUser(hash_pass, req.body)
            .then(result => {
                res.redirect('/');
            }).catch (err => {
                if (err) throw err;
            })
        }).catch (err => {
            if (err) throw err;
        })
    } else {
        let allErrors = validation_result.errors.map((error) => {
            return error.msg;
        })
        let userId = req.session.userID;
        const user = await userData.getUser(userId);
        res.render('home', {
            id: user[0].userId,
            username: user[0].username,
            email: user[0].email,
            password: user[0].password,
            avatar_url: user[0].avatar_url,
            edit_error: allErrors,
            old_data: req.body
        })
    }
}

const del = async (req, res, next) => {
    try {
        let userId = req.session.userID;
        const user = await userData.deleteUser(userId);
        req.session = null;
        res.redirect('/');
    } catch (err) {
        res.status(400).send(err.message);
    }
}

const changeAvatar = async (req, res, next) => {
    const validation_result = validationResult(req);
    let userId = req.session.userID;
    let form = formidable({ multiples: true});
    form.parse(req, (err, fields, files) => {
        console.log(fields);
        console.log(files);
        let oldpath = files._avatar.filepath;
        let newpath = path.join(process.cwd(),"/public/img/user_avatar/",`${userId}.png`);
        fs.move(oldpath, newpath, { overwrite: true}, (err) => {
            if (err) throw err;
            console.log('upload avatar completed')
        })
    })
    try {
        await userData.updateAvatar(userId);
        res.redirect('/');
    } catch (err) {
        res.status(400).send(err.message);
    }
}

module.exports = {
    homePage,
    register,
    login,
    edit,
    del,
    changeAvatar
}