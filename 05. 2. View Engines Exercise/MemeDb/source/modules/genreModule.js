const router = require('express').Router();
const genreService = require('../services/genreService');

let genreGenerator = (genreName) => {
    return {
        title: genreName
    };
};

let viewAddGenre = (req, res, status = null, message = undefined) => {
    res.render('addGenre', {status, message});
};


let addGenre = (req, res) => {
    let genreName = req.body.genreName;

    if (genreName === '') {
        let errorMessage = 'Genre title cannot be empty. Please enter new Genre!';
        viewAddGenre(req, res, 'err', errorMessage);
        return;
    }

    let genreObj = genreGenerator(genreName);

    genreService.getAll()
        .then(allGenres => {
            for (let currentGenre of allGenres) {
                if (currentGenre.title === genreName) {
                    let errorMessage = 'Genre already exists. Please enter new Genre!';
                    viewAddGenre(req, res, 'err', errorMessage);
                    return;
                }
            }

            genreService.create(genreObj)
                .then(() => {
                    viewAll(req, res, 'suc');
                }).catch(() => {
                    viewAddGenre(req, res, 'err');
                });
        });
};

let viewAll = (req, res) => {
    genreService
        .getAll()
        .then(genres => {   
            let index = 1;
            for (let genre of genres) {
                genre.index = index++;
            }

            if(genres.length === 0){
                genres.message = 'There are no genres!';
            }
            
            res.render('allGenres', {genres,  message:'There are no genres!'});
        });
};

router
    .get('/addGenre', (req, res) => viewAddGenre(req, res))
    .post('/addGenre', (req, res) => addGenre(req, res))
    .get('/viewAllGenres', (req, res) => viewAll(req, res));

module.exports = router;