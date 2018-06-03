const fs = require("fs");
const url = require("url");
const path = require("path");

module.exports = (req, res) => {
    if (req.pathname === '/' && req.method === "GET") {

        const filePath = path.normalize(
            path.join(__dirname, '../views/home.html'));


        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                console.log(err);
                res.writeHead(404, {
                    "Content-Type": 'text/plain'
                })

                res.write('404 not found!');
                res.end();
                return;
            } else {
                res.writeHead(200, {
                    'Content-Type': 'text/html'
                })

                res.write(data);
                res.end()
            }
        })
    } else {
        return true;
    }
}
