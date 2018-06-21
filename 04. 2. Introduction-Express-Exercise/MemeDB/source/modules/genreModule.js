const router = require('express').Router();
const genreService = require('../services/genreService');
const fs = require('fs');
const path = require('path');

const placeholder = '<div id="replaceMe">{{replaceMe}}</div>';
const uiTemplates = require('../infrastructure/uiTemplates');
const genreTemplates = require('../infrastructure/genreTemplates');

let successMessage = '<div id="succssesBox"><h2 id="succssesMsg">Genre Added</h2></div>';



let genreGenerator = (genreName) => {
    return {
        title: genreName
    };
};



let viewAddGenre = (req, res, status = null, errorMessage = undefined) => {
    let filePath = path.normalize(path.join(__dirname, '../views/addGenre.html'));

    fs.readFile(filePath, (err, data) => {
        if (err) {
            console.log(err);
            return;
        }


        if (status === 'err') {
            data = data
                .toString()
                .replace(
                    placeholder,
                    errorMessage || uiTemplates.errorMessage()
                );
        }
        if (status === 'suc') {
            data = data
                .toString()
                .replace(
                    placeholder,
                    successMessage
                );
        }

        res.writeHead(200, {
            'Content-Type': 'text/html'
        });

        res.write(data);
        res.end();
    });

};


let addGenre = (req, res) => {
    let genreName = req.body.genreName;
    console.log(genreName);

    if (genreName === '') {
        let errorMessage = '<div id="errBox"><h2 id="errMsg">Genre title cannot be empty. Please enter new Genre.</h2></div>';
        viewAddGenre(req, res, 'err', errorMessage);
        return;
    }

    let genreObj = genreGenerator(genreName);


    genreService.getAll()
        .then(allGenres => {
            for (let currentGenre of allGenres) {
                if (currentGenre.title === genreName) {
                    let errorMessage = '<div id="errBox"><h2 id="errMsg">Genre already exists. Please enter new Genre</h2></div>';
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
        .then(data => {
            // data = data
            //     .sort((a, b) => b.dateStamp - a.dateStamp)
            //     .filter(meme => meme.privacy === 'on');

            let responseString = '';
            let index = 1;
            for (let genre of data) {
                responseString += genreTemplates.viewAll(genre.title, index++);
            }

            fs.readFile('./source/views/viewAllGenres.html', (err, html) => {
                if (err) {
                    console.log(err);
                    return;
                }
                html = html
                    .toString()
                    .replace(placeholder, responseString);

                res.writeHead(200, {
                    'Content-Type': 'text/html'
                });

                res.write(html);
                res.end();
            });
        });
};


router
    .get('/addGenre', (req, res) => viewAddGenre(req, res))
    .post('/addGenre', (req, res) => addGenre(req, res))
    .get('/viewAllGenres', (req, res) => viewAll(req, res));

module.exports = router;