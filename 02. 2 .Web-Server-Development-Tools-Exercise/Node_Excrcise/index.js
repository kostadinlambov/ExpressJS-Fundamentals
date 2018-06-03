const http = require('http');
const url = require('url');
const handlers = require('./handlers');
const attachFileReader = require('./config/fileReader');
const attachBodyParser = require('./config/bodyParser');
const port = 4021;

http.createServer((req, res) => {
    console.log(req.url);

    req.pathname = req.pathname || url.parse(req.url).pathname;

    attachBodyParser(req);
    attachFileReader(res);

    for (let handler of handlers) {
        if (handler(req, res) !== true) {
            break;
        }
    }
}).listen(port, () => {
    console.log(`Listening on port ${port}`)
});