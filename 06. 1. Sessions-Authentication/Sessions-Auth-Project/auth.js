const passport = require('passport');
const LocalPassport = require('passport-local');
const encryption = require('./encryption');
const router = require('express').Router();

const users = [];

passport.use(new LocalPassport((username, password, done) => {
    const user = users.filter(u => u.username === username)[0];
    if (user !== undefined) {
        const hashedPass = encryption.generateHashedPassword(user.salt, password);
        if (user.hashedPass === hashedPass) {
            return done(null, user);
        }
    }
    return done(null, false);
}));

passport.serializeUser((user, done) => {
    if (user) return done(null, user._id);
});

passport.deserializeUser((id, done) => {
    const user = users.filter(u => u._id === id)[0];
    if (user) return done(null, user);
    return done(null, false);
});

router.get('/login', (req, res) => {
    const message = req.session.message;
    req.session.message = '';
    res.render('login', {
        message,
        inputData: req.session.inputData
    });
});

router.post('/login', passport.authenticate('local'), (req, res) => {
    req.session.message = "Login successful";
    res.redirect('/');
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
        _id: encryption.generateId(),
        username,
        salt,
        hashedPass
    };
    users.push(user);
    req.login(user, err => {
        if (err) {
            return error("Something went wrong");
        }
        req.session.message = "Registration successful";
        console.log(user);
        return res.redirect('/');
    });
   
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