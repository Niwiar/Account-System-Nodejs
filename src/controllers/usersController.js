const userData = require('../data/users');

const userLists = async (req, res, next) => {
    try {
        const user = await userData.getUsers();
        res.json(user);
    } catch (err) {
        res.status(400).send(err.message);
    }
}

const delUser = async (req, res, next) => {
    try {
        let userId = req.body.id;
        await userData.deleteUser(userId);
        console.log('delete user completed')
        if (userId === req.session.userID) {
            req.session = null;
            res.redirect('/');
        }
    } catch (err) {
        res.status(400).send(err.message);
    }
}

module.exports = {
    userLists,
    delUser
}