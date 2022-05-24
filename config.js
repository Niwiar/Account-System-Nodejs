require('dotenv').config();
const assert = require('assert');

const {PORT, HOST, HOST_URL, SQL_USER, SQL_PASSWORD, SQL_DATABASE, SQL_SERVER, SQL_INSTANCE} = process.env;

assert(PORT, 'PORT is required');
assert(HOST, 'HOST is required');

const allowdOrigins = [
    'http://127.0.0.1:5500',
    'http://localhost:3000'
];

const corsOption = {
    origin: (origin, callback) => {
        if (allowdOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionSuccessStatus: 200
}

const ROLES_LIST = {
    "Admin": 1150,
    "Editor": 9500,
    "User": 2000
}

module.exports = {
    port: PORT,
    host: HOST,
    url: HOST_URL,
    sql: {
        server: SQL_SERVER,
        user: SQL_USER,
        password: SQL_PASSWORD,
        database: SQL_DATABASE,
        options: {
            encrypt: true,
            trustServerCertificate: true,
            enableArithAbort: true,
            instanceName: SQL_INSTANCE
        } 
    },
    corsOption,
    allowdOrigins,
    ROLES_LIST
}