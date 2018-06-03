const staicHandler = require('./static');
const homeHandler = require('./home');
const aboutHandler = require('./about');
const errorHandler = require('./error');

module.exports = [
    staicHandler,
    homeHandler,
    aboutHandler,
    errorHandler

];