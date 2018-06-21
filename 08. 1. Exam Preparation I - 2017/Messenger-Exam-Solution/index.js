"use strict";

const express = require('express');
const http = require('http');
const port = 3000;

const config = require('./source/config/config');
const database = require('./source/config/database.config.js');

let app = express();

let environment = process.env.NODE_ENV || 'development';
database(config[environment]);
require('./source/config/express')(app, config[environment]);
require('./source/config/routes')(app);
require('./source/config/passport')();

app.listen(port);
console.log(`Listening on ${port}`);
