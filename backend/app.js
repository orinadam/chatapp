const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('./models/user')
const Db = require('./db');
const cookieParser = require('cookie-parser');

const app = express();
const db = new Db();

app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
    req.db = db;
    next();
})

const maxAge = 24 * 60 * 60;

const createToken = (id) => {
    return jwt.sign({ id }, 'fkjabcjksIwjbkKVHH72yie2dgJHCV', {
        expiresIn: maxAge
    })
}

const requireAuth = (req, res, next) => {
    const userToken = req.cookies.jwt;
    if (userToken) {
        jwt.verify(userToken, 'fkjabcjksIwjbkKVHH72yie2dgJHCV', (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                res.json({ 'method': 'login inv' });
            }
            else {
                console.log(decodedToken);
                req.userId = decodedToken.id;
                next();
            }
        })
    }
    else {
        res.json({ 'method': 'login' });
    }
}

const handleErrors = (err) => {
    let error = { username: '', password: '' };
    console.log(err);
}

app.get('/', requireAuth, (req, res) => {

    res.json({ user: req.userId });
})

app.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.create({ username, password });
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.json({ user: user._id });
    }
    catch (err) {
        console.log(err);
        res.status(400).send(err);
    }

})

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.login(username, password);
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.json({ user: user._id });
    }
    catch (err) {
        res.status(400).send(err.message);
    }
})

app.listen(3000, () => {
    console.log('Listening')
})



