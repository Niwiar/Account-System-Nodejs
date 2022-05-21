const express = require('express');
const config = require('./config');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const cookieSession = require('cookie-session');
const userControl = require('./src/controllers/userController');
const {validateLogin, validateRegister, validateEdit} = require('./src/controllers/validator');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

app.use(express.static(path.join(__dirname, "/public/")));
app.set("views","./src/views");
app.set("view engine", "ejs");

app.use(cookieSession({
    name: 'session',
    keys: ['key1, key2'],
    maxAge: 3600 * 1000 //1hr
}));

//Declare custom Middleware
const ifNotLoggedIn = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return res.render('login');
    }
    next();
}

const ifLoggedIn = (req, res, next) => {
    if (req.session.isLoggedIn) {
        return res.redirect('/');
    }
    next();
}

app.use((req, res, next) => {
    console.log('home route');
    next();
})
app.get("/", ifNotLoggedIn, userControl.homePage);

//register
app.post("/register", ifLoggedIn, validateRegister, userControl.register);
//login
app.post('/login', ifLoggedIn, validateLogin, userControl.login)
//edit
app.post('/edit', validateEdit, userControl.edit)
//logout
app.get('/logout', (req, res, next) => {
    req.session = null;
    res.redirect('/')
})
//delete
app.post('/delete', userControl.del)

app.use('/', (req, res) => {
    res.status(404).send('<h1>404 Not Found</h1>')
})

app.listen(config.port, () => console.log(`Server is listening on ${config.url}`))