const { allowdOrigins } = require('../../config');

const credentials = (req, res, next) => {
    const origin = req.headers.origin;
    if (allowdOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Credentials', true);
    }
    next()
}

module.exports = credentials