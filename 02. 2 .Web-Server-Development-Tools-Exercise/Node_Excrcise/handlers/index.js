const homeHandler = require('./home');
const staticHandler = require('./staticHandler');
const moviesHandler = require('./moviesHandler');
const addMovieHandler = require('./addMovieHandler');
const headerHnadler = require('./headerHandler');
const errorHandler = require('./error');

module.exports = [
    headerHnadler,
    homeHandler,
    staticHandler,
    moviesHandler,
    addMovieHandler,
    errorHandler
];