const fs = require("fs");

module.exports = (req, res) => {
    res.writeHead(404, {
        'Content-Type': 'text/plain'
    });
    res.end("Bad request");
};