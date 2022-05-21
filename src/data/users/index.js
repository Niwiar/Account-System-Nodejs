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
        console.log(user)
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
        return editedUser.recordset
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

module.exports = {
    getUser,
    createUser,
    findEmail,
    updateUser,
    deleteUser
}