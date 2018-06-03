const fs = require("fs");
const url = require("url");
const path = require("path");

const contentTypes = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.ico': 'image/x-icon'
};

module.exports = (req, res) => {
    let pathname = req.pathname || url.parse(req.url).pathname;

    let isGetRequest = req.method === "GET";
    let isPublicFile = pathname.startsWith('/public/');

    let isAllowedFileType = Object
        .keys(contentTypes)
        .map(k => pathname.endsWith(k))
        .reduce((prev, current) => prev || current, false);

    if (pathname === '/favicon.ico' && isGetRequest) {
        res.staticFile('/public/images/favicon.ico', 'image/x-icon')
    } else if (isGetRequest && isPublicFile && isAllowedFileType) {
        res.staticFile(pathname, getContentType(pathname));
    } else {
        return true;
    }

    function getContentType(pathName) {
        return Object
            .keys(contentTypes)
            .filter(k => pathName.endsWith(k))
            .map(k => contentTypes[k])[0];
    }
};
