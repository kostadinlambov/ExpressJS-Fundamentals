const User = require('../models/User');
const Thread = require('../models/Thread');
const encryption = require('../utilities/encryption');

module.exports = {
    register: {
        get: (req, res) => {
            res.render('user/register');
        },
        post: (req, res) => {
            let userData = req.body;

            if (userData.password && userData.password !== userData.confirmedPassword) {
                userData.error = 'Passwords do not match';
                res.render('user/register', userData);
                return;
            }

            let salt = encryption.generateSalt();
            userData.salt = salt;

            if (userData.password) {
                userData.password = encryption.generateHashedPassword(salt, userData.password);
            }

            User.create(userData)
                .then(user => {
                    req.logIn(user, (err, user) => {
                        if (err) {
                            res.render('users/register', { error: 'Wrong credentials!' });
                            return;
                        }

                        res.redirect('/');
                    })
                })
                .catch(error => {
                    userData.error = error;
                    res.render('user/register', userData);
                });
        },
    },
    login: {
        get: (req, res) => {
            res.render('user/login');
        },
        post: (req, res) => {
            let userData = req.body;

            User.findOne({ username: userData.username }).then(user => {
                if (!user || !user.authenticate(userData.password)) {
                    res.render('user/login', { error: 'Wrong credentials!' });
                    return;
                }

                req.logIn(user, (err, user) => {
                    if (err) {
                        res.render('user/login', { error: 'Wrong credentials!' });
                        return;
                    }

                    res.redirect('/');
                })
            })
        },
    },
    logout: (req, res) => {
        req.logout();
        res.redirect('/');
    },
    find: {
        get: (req, res) => {
            let loggedInUser = req.user.username;
            let otherUser = req.query.username;
            if (loggedInUser === otherUser) {
                return res.redirect('/?error=Cannot chat with yourself!');
            }

            User.findOne({ username: otherUser }).then(user => {
                if (!user) {
                    return res.redirect('/?error=User not found!');
                }

                Thread.findOne({ users: { $all: [loggedInUser, otherUser] } }).then(existingThread => {
                    if (!existingThread) {
                        Thread.create({ users: [ loggedInUser, otherUser ]}).then(thread => {
                            if (!thread) {
                                return res.status(500).send({ message: 'Internal server error. Cannot write to database.' });
                            }

                            user.otherUsers.push(req.user._id);
                            user.save();

                            req.user.otherUsers.push(user._id);
                            req.user.save();

                            res.redirect(`/thread/${ user.username }`);
                        });

                        return;
                    }

                    res.redirect(`/thread/${ user.username }`);
                });


            });
        }
    },
    block: {
        get: (req, res) => {
            let userId = req.params.userId;

            req.user.blockedUsers.push(userId);
            req.user.save();

            res.redirect('/');
        }
    },
    unblock: {
        get: (req, res) => {
            let userId = req.params.userId;

            let index = req.user.blockedUsers.indexOf(userId);
            if (index !== -1) {
                req.user.blockedUsers.splice(index, 1);
            }
            req.user.save()
                .then(() => res.redirect('/'));
        }
    }
};