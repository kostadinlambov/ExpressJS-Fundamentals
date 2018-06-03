const qs = require('querystring');

module.exports = req => {
    let body = [];
    if (req.method !== 'POST') {
        return;
    }

    req
        .on('data', chunk => {
            body.push(chunk);
        })
        .on('end', () => {
            let dataString = Buffer
                .concat(body)
                .toString()
            req.bodyData = qs.parse(dataString);
        })
};