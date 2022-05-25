const userData = require('../data/users');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const fs = require('fs-extra');
const formidable = require('formidable');
const path = require('path');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const homePage = async (req, res, next) => {
    try {
        // req.session = null;
        // res.redirect('/');
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
        //encrypt password
        bcrypt.hash(user_pass, 12).then(async (hash_pass) => {
            await userData.createUser(hash_pass, req.body)
            .then(async (result) => {
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
        //auth & evaluate password
        const user = await userData.findEmail(user_email)
        const compared =  await bcrypt.compare(user_pass, user[0].password)
        console.log(user)
        if (compared) {
            const roles = Object.values(JSON.parse(user[0].roles));
            console.log(roles)
            //session authentication
            req.session.isLoggedIn = true;
            req.session.userID = user[0].userId;
            //jwt authentication
            const accessToken = jwt.sign(
                { 
                    "userInfo": {
                        "user_email": user_email,
                        "user_roles": roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '1min' }
            );
            const refreshToken = jwt.sign(
                { 
                    "userInfo": {
                        "user_email": user_email,
                        "user_roles": roles
                    } 
                },
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: '1d' }
            );
            const userToken = await userData.updateToken(user_email, refreshToken);
            // console.log(userToken)
            res.cookie('jwt', refreshToken, {httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 3600 * 1000})
            // res.json({ accessToken });
            console.log( accessToken )

            res.redirect('/');
        } else {
            res.render('login',{
                login_error: ['Invalid Password']
            })
        }
    } else {
        let allErrors = validation_result.errors.map((error) => {
            return error.msg;
       })
       res.render('login', {
           login_error: allErrors
       })
    }
}

const logout = async (req, res, next) => {
    req.session = null;
    const cookies = req.cookies;
    if (!cookies.jwt) return res.sendStatus(204); //No content
    //find token
    const refreshToken = cookies.jwt;
    const user = await userData.findToken(refreshToken)
    if (!user.length) {
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true});
        return res.sendStatus(204);
    }
    //del token
    const userToken = await userData.deleteToken(refreshToken);
    console.log(userToken)
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true});
    res.redirect('/')
}

const edit = async (req, res, next) => {
    const validation_result = validationResult(req);
    const {user_pass} = req.body;
    if(validation_result.isEmpty()) {
        bcrypt.hash(user_pass, 12).then(async (hash_pass) => {
            await userData.updateUser(hash_pass, req.body)
            .then(() => {
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
        await userData.deleteUser(userId);
        console.log('delete user completed')
        req.session = null;
        res.redirect('/');
    } catch (err) {
        res.status(400).send(err.message);
    }
}

const changeAvatar = async (req, res, next) => {
    let userId = req.session.userID;
    let form = formidable({ multiples: true});
    form.parse(req, (err, fields, files) => {
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
    logout,
    edit,
    del,
    changeAvatar
}