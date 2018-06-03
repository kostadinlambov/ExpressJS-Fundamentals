const movies = require('../config/dataBase').db;
const customDecoder = require('../config/dataBase').customDecodeString;
const takeAllPosterPictures = require('../config/dataBase').takeAllPosterPictures;
const templates = require('../config/templates');

module.exports = (req, res) => {
    let pathname = req.pathname;
    if (pathname === '/movies/add' && req.method === 'GET') {
        res.view('views/dist/addMovie.min.html');
    } else if (pathname === '/movies/add' && req.method === 'POST') {
        req.on('end', () => {
            var data = req.bodyData;
            if (!data.movieTitle || !data.moviePoster) {
                res.view('views/dist/addMovie.min.html', templates.errorNotification());
                return;
            }
    
            movies.push(data);
        
            let postersHtml = takeAllPosterPictures();
            res.view('views/dist/viewAll.min.html', postersHtml);
        })
    }else {
        return true;
    }
}
