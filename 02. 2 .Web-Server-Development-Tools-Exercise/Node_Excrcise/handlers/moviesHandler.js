const movies = require('../config/dataBase').db;
const customDecoder = require('../config/dataBase').customDecodeString;
const takeAllPosterPictures = require('../config/dataBase').takeAllPosterPictures;
const templates = require('../config/templates');

module.exports = (req, res) => {
    let pathname = req.pathname;
    if (pathname === '/movies/all' && req.method === 'GET') {
        let postersHtml = takeAllPosterPictures();
        res.view('views/dist/viewAll.min.html', postersHtml);
    } else if (pathname.startsWith('/movies/details/') && req.method === 'GET') {
        let index = parseInt(pathname.substr(pathname.lastIndexOf('/') + 1))
        let movie = movies[index];

        let detailsHtml = templates.detailsTemplate(
            customDecoder(movie.moviePoster),
            customDecoder(movie.movieTitle),
            customDecoder(movie.movieYear),
            customDecoder(movie.movieDescription));

        res.view('views/dist/details.min.html', detailsHtml);
    } else {
        return true;
    }
}
