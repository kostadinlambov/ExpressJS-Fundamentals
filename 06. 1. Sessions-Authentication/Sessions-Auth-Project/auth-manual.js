const router = require('express').Router();
const encryption = require('./encryption');

const users = [];

router.get('/login', (req, res) => {
    const message = req.session.message;
    req.session.message = '';
    res.render('login', {
        message,
        inputData: req.session.inputData
    });
});

router.post('/login', (req, res) => {
    const {
        username,
        password
    } = req.body;
    const user = users.filter(u => u.username === username)[0];
    if (user !== undefined) {
        const hashedPass = encryption.generateHashedPassword(user.salt, password);
        if (user.hashedPass === hashedPass) {
            req.session.user = {
                username
            };
            req.session.message = 'Login successful';
            delete req.session.inputData;
            return res.redirect('/');
        }
    }
    req.session.message = 'Incorrect username or password';
    req.session.inputData = {
        username,
        password
    };
    res.redirect('/auth/login');
});

router.get('/register', (req, res) => {
    const message = req.session.message;
    req.session.message = '';
    res.render('register', {
        message,
        inputData: req.session.inputData
    });
});

router.post('/register', (req, res) => {
    const {
        username,
        password,
        repeat
    } = req.body;
    if (password !== repeat) {
        return error("Passwords don't match");
    }
    if (users.filter(u => u.username === username).length > 0) {
        return error("Username is taken");
    }

    const salt = encryption.generateSalt();
    const hashedPass = encryption.generateHashedPassword(salt, password);
    const user = {
        username,
        salt,
        hashedPass
    };
    users.push(user);
    req.session.user = {
        username
    };
    req.session.message = "Registration successful";
    console.log(user);
    return res.redirect('/');

    function error(message) {
        req.session.inputData = {
            username,
            password,
            repeat
        };
        req.session.message = message;
        return res.redirect('/auth/register');
    }
});


module.exports = router;