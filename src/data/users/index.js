const utils = require("../utils");
const config = require("../../../config");
const sql = require("mssql");


const getUser = async (userId) => {
    try {
        const pool = await sql.connect(config.sql);
        const sqlQueries = await utils.loadSqlQueries('users');
        const user = await pool.request()
            .input('userId', sql.Int, userId)
            .query(sqlQueries.getUser);
        return user.recordset;
    } catch (error) {
        return error.message;
    }
}

const createUser = async (pass, user) => {
    try {
        const avatarStd = "./img/user_avatar/0.png";
        const pool = await sql.connect(config.sql);
        const sqlQueries = await utils.loadSqlQueries('users');
        const insertUser = await pool.request()
            .input('username', sql.NVarChar(50), user.user_name)
            .input('email',sql.NVarChar(50), user.user_email)
            .input('password', sql.NVarChar(255), pass)
            .input('avatar_url', sql.NVarChar(255), avatarStd)
            .query(sqlQueries.createUser);
        return insertUser.recordset;
    } catch (error) {
        return error.message;
    }
}

const findEmail = async (email) => {
    try {
        const pool = await sql.connect(config.sql);
        const sqlQueries = await utils.loadSqlQueries('users');
        const user = await pool.request()
            .input('email', sql.NVarChar(50), email)
            .query(sqlQueries.getEmail)
        return user.recordset
    } catch (err) {
        return err.message
    }
}

const updateUser = async (pass, user) => {
    try {
        const pool = await sql.connect(config.sql);
        const sqlQueries = await utils.loadSqlQueries('users');
        const editedUser = await pool.request()
            .input('username', sql.NVarChar(50), user.user_name)
            .input('password', sql.NVarChar(255), pass)
            .input('email', sql.NVarChar(50), user.user_email)
            .query(sqlQueries.updateUser);
        console.log(editedUser.recordset)
        return editedUser.recordset
    } catch (err) {
        return err.message
    }
}

const updateAvatar = async (userId) => {
    try {
        const url = `./img/user_avatar/${userId}.png`
        const pool = await sql.connect(config.sql);
        const sqlQueries = await utils.loadSqlQueries('users');
        const changedAvater = await pool.request()
            .input('url', sql.NVarChar(255), url)
            .input('userId', sql.Int, userId)
            .query(sqlQueries.updateUserAvatar);
        return changedAvater.recordset
    } catch (err) {
        return err.message
    }
}

const deleteUser = async (userId) => {
    try {
        const pool = await sql.connect(config.sql);
        const sqlQueries = await utils.loadSqlQueries('users');
        const deletedUser = await pool.request()
            .input('userId', sql.Int, userId)
            .query(sqlQueries.deleteUser);
        return deletedUser.recordset
    } catch (err) {
        return err.message
    }
}

const updateToken = async (email, token) => {
    try {
        const pool = await sql.connect(config.sql);
        const sqlQueries = await utils.loadSqlQueries('users');
        const addToken = await pool.request()
            .input('email', sql.NVarChar(50), email)
            .input('token', sql.NVarChar(255), token)
            .query(sqlQueries.updateToken);
        return addToken.recordset
    } catch (err) {
        return err.message
    }
}

const findToken = async (token) => {
    try {
        const pool = await sql.connect(config.sql);
        const sqlQueries = await utils.loadSqlQueries('users');
        const found = await pool.request()
            .input('token', sql.NVarChar(255), token)
            .query(sqlQueries.getToken);
        return found.recordset
    } catch (err) {
        return err.message
    }
}

const deleteToken = async (token) => {
    try {
        const pool = await sql.connect(config.sql);
        const sqlQueries = await utils.loadSqlQueries('users');
        const deleted = await pool.request()
            .input('token', sql.NVarChar(255), token)
            .query(sqlQueries.deleteToken);
        return deleted.recordset
    } catch (err) {
        return err.message
    }
}

module.exports = {
    getUser,
    createUser,
    findEmail,
    updateUser,
    deleteUser,
    updateAvatar,
    updateToken,
    findToken,
    deleteToken
}