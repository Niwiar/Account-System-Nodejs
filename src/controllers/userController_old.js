const userData = require('../data/users');


const showUser = async (req, res, next) => {
    try {
        let userId = req.session.userID;
        const user = await userData.getUser(userId);
        res.send(user);
    } catch (err) {
        res.status(400).send(err.message);
    }
}

const userRegister = async (req, res, next) => {
    try {
        let data = req.body;
        const created = await userData.createUser(data);
        res.send(created);
    } catch (err) {
        res.status(400).send(err.message);
    }
}

module.exports = {
    showUser,
    userRegister
}