const takeAllPosterPictures = require('../config/dataBase').takeAllPosterPictures;
const totalNumberOfMovies = require('../config/dataBase').totalNumberOfMovies;
const templates = require('../config/templates');

module.exports = (req, res) => {
    if(req.headers["statusheader"] === 'Full'){
        let html = templates.statusTemplate(totalNumberOfMovies())
        res.view('views/dist/status.min.html', html);
    }else {
        return true;
    }
}
