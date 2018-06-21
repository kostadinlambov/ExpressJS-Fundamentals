const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');

module.exports = (app, config) => {
    "use strict";
    app.set('view engine', 'pug');
    app.set('views', path.join(config.rootPath, 'source/views'));


    app.use(cookieParser());
    app.use(session({secret: 'S3cr3t', saveUninitialized: false, resave: false}));
    app.use(passport.initialize());
    app.use(passport.session());

    // MiddleWare to attach Access levels data of logged in user.
    app.use((req, res, next) => {
        if (req.isAuthenticated()) {
            res.locals.hasUserAccess = true;
        }
        if (req.user && req.user.hasAccess('Admin')) {
            res.locals.hasAdminAccess = true;
        }

        next();
    });

    app.use((req, res, next) => {
        if (req.user) {
            res.locals.user = req.user;
        }

        next();
    });

    // Configure middleware for parsing forms
    app.use(bodyParser.urlencoded({extended: true}));

    // Configure "public" folder
    app.use((req, res, next) => {
        if (req.url.startsWith('/public')) {
            req.url = req.url.replace('/public', '');
        }

        next();
    }, express.static(path.normalize(path.join(config.rootPath, 'public'))));
};