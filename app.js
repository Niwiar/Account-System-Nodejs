const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const cookieSession = require('cookie-session');
const cookieParser = require('cookie-parser')

const PORT = process.env.PORT || 3000;
const { corsOption } = require('./config')

const root = require('./src/routes/root');
const user = require('./src/routes/user');
const verifyJWT = require('./src/middleware/verifyJWT');
const credentials = require('./src/middleware/credentials');


const app = express();

app.use(credentials);

app.use(cors(corsOption));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

app.use(cookieParser());

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

app.use('/', root);

app.use(verifyJWT);
app.use('/', user);

// app.use('/', (req, res) => {
//     res.status(404).send('<h1>404 Not Found</h1>')
// });


app.listen(PORT, () => console.log(`Server is listening on ${PORT}`))