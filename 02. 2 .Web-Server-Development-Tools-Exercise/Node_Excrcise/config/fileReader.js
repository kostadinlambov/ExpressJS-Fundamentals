const fs = require('fs');
const path = require('path');
const database = require('./dataBase')

function readFile(pathname, format) {
    if (!pathname) {
        throw new ReferenceError('Argument "pathname" cannot be undefined.');
    }
    pathname = path.join(__dirname, `../${pathname}`);

    return new Promise((resolve, reject) => {
        fs.readFile(pathname, format ? format : null, (err, data) => {
            if (err) {
                reject(err);
                return;
            }

            resolve(data);
        });
    })
}

function respondWithFileReadError(err) {
    console.dir(err);
    res.writeHead(500, {
        'Content-Type': 'text/plain'
    });
    res.end(`Could not read file with path "${pathname}".`);
}

module.exports = res => {
    res.view = (path, dynamicContent) => {
        readFile(path, "utf8")
            .then(data => {
                if (dynamicContent) {
                    
                    let placeholder = '<div id=replaceMe>{{replaceMe}}</div>';
                    if (path === 'views/dist/status.min.html') {
                        placeholder = '<h1>{{replaceMe}}</h1>';
                    }

                    data = data.replace(placeholder, dynamicContent);
                }
                res.writeHead(200, {
                    'Content-Type': 'text/html'
                });
                res.write(data);
                res.end();
            })
            .catch(err => respondWithFileReadError(err));
    }

    res.staticFile = (path, contentType) => {
        readFile(path)
            .then(data => {
                res.writeHead(200, {
                    'Content-Type': contentType
                });
                res.write(data);
                res.end();
            })
            .catch(err => respondWithFileReadError(err));
    }
}