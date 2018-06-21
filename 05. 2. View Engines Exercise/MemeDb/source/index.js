'use strict';

const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const fileUploader = require('express-fileupload');
const handlebars = require('express-handlebars');
const helpers = require('handlebars-helpers');

const homeModule = require('./modules/homeModule');
const memeModule = require('./modules/memeModule');
const apiModule = require('./modules/apiModule');
const genreModule = require('./modules/genreModule');

const port = 2323;
const app = express();

const comparisonHelper = helpers.comparison();

app.set('views', './source/views');

app.engine('hbs', handlebars({
    extname: '.hbs',
    layoutsDir: path.join(__dirname, '..', 'source', 'views', 'layouts'),
    defaultLayout: 'main',
    partialsDir: path.join(__dirname, '..', 'source', 'views', 'partials')
}));

app.use(fileUploader());


app.set('view engine', '.hbs');

app.use('/public', express.static(path.join(__dirname, '../public')));
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use('/', homeModule);
app.use('/memes', memeModule);
app.use('/api', apiModule);
app.use('/genres', genreModule);

require('./config/mongoConfig')
    .then(() => {
        app.listen(port, () => console.log('Im listening on ' + port));

    })
    .catch(err => {
        console.log('Could not connect to MongoDb\n', err);
    });