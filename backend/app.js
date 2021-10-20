const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('./models/user')
const Db = require('./db');

const app = express();
const db = new Db();

app.use(express.json());

app.use((req, res, next) => {
    req.db = db;
    next();
})

const handleErrors = (err) => {
    let error = { username: '', password: '' };
}

app.get('/', (req, res) => {
    res.send("hello");
})

app.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.create({ username, password });
        res.json(user);
    }
    catch (err) {
        console.log(err);
        res.status(400).send(err);
    }

})

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    {/* try {
        const user = await User.login(username, password);
        res.json({ user: user._id });
    }
    catch (err) {
        res.status(400).json({});
    } */}
    res.send(`${username}, ${password}`);
})

app.listen(3000, () => {
    console.log('Listening')
})



