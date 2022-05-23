const express = require('express');
const config = require('./config');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const cookieSession = require('cookie-session');

const root = require('./src/routes/root');

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

app.use((req, res, next) => {
    console.log(`${req.method} ${req.headers.origin} ${req.path}`);
    next();
})

app.use('/', root)


app.listen(config.port, () => console.log(`Server is listening on ${config.url}`))