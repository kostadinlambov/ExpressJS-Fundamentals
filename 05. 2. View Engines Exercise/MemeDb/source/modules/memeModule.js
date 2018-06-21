const fs = require('fs');
const url = require('url');
const qs = require('querystring');
const path = require('path');

const router = require('express').Router();
const shortid = require('shortid');

const memeService = require('../services/memeService');
const genreService = require('../services/genreService');

let memeGenerator = (title, memeSrc, description, privacy, genreId) => {
    return {
        title: title,
        memeSrc: memeSrc,
        description: description,
        privacy: privacy,
        dateStamp: Date.now(),
        genreId: genreId
    };
};

let defaultResponse = (respString, res) => {
    res.writeHead(200, {
        'Content-Type': 'text/html'
    });
    res.end(respString);
};

let fieldChecker = obj => {
    for (let prop in obj) {
        if (obj[prop] === '') {
            return true;
        }
    }
};

let viewAll = (req, res) => {
    memeService
        .getAll()
        .then(memes => {
            memes = memes
                .sort((a, b) => b.dateStamp - a.dateStamp)
                .filter(meme => meme.privacy === 'on');

            res.render('allMemes', {memes, message:'There are no memes!'});
        });
};

let viewAddMeme = (req, res, status = null) => {
    genreService
        .getAll()
        .then(genres => {
            let message;

            if (status === 'err') {
                message = false;
            } else if (status === 'suc') {
                message = true;
            }

            let replaceObj = {
                message,
                genres
            };

            res.render('addMeme', replaceObj);
        });
};

let getDetails = (req, res) => {
    let targetId = qs.parse(url.parse(req.url).query).id;
    memeService
        .get(targetId)
        .then(targetedMeme => {
            let currentMeme = {
                'url': targetedMeme.memeSrc,
                'title': targetedMeme.title,
                'description': targetedMeme.description,
                'id': targetId
            };

            res.render('memeDetails', currentMeme);
        })
        .catch(() => {
            res.end('Meme does not exist.');
        });
};

let addMeme = (req, res) => {
    let fileName = shortid.generate() + '.jpg';
    let fields = req.body;
    let files = req.files;

    memeService
        .getAll()
        .then(allMemes => {
            let dirName = `/public/memeStorage/${Math.ceil(allMemes.length / 10)}`;
            let relativeFilePath = dirName + '/' + fileName;
            let absoluteDirPath = path.join(__dirname, `../../${dirName}`);
            let absoluteFilePath = absoluteDirPath + '/' + fileName;

            fs.access(absoluteDirPath, err => {
                if (err) {
                    fs.mkdirSync(absoluteDirPath);
                }

                files.meme.mv(absoluteFilePath, err => {
                    if (err) {
                        console.log(err);
                        viewAddMeme(req, res, 'err');
                        return;
                    }

                    if (fieldChecker(fields)) {
                        viewAddMeme(req, res, 'err');
                    } else {
                        let memeForImport = memeGenerator(
                            fields.memeTitle,
                            relativeFilePath,
                            fields.memeDescription,
                            fields.status,
                            fields.genreSelect
                        );

                        memeService
                            .create(memeForImport)
                            .then(() => {
                                viewAll(req, res, 'suc');
                            })
                            .catch(() => {
                                viewAddMeme(req, res, 'err');
                            });
                    }
                });
            });
        });
};

let createGenreView = (req, res) => {
    fs.readFile('./source/views/addGenre.html', (err, data) => {
        if (err) {
            console.log(err);
        }
        defaultResponse(data, res);
    });
};

router
    .get('/viewAllMemes', (req, res) => viewAll(req, res))
    .get('/addMeme', (req, res) => viewAddMeme(req, res))
    .post('/addMeme', (req, res) => addMeme(req, res))
    .get('/getDetails', (req, res) => getDetails(req, res))
    .get('/addGenre', (req, res) => createGenreView(req, res));

module.exports = router;