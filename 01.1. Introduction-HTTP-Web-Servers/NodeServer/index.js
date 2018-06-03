const http =  require('http');
const fs = require('fs');

const server = http.createServer((req, res)=> {
    console.log(req.url);
    if(req.url == '/index.html'){
        var stat =fs.statSync('./index.html');

        res.writeHead(200, {
            'Content-Type': 'text/html',
            'Content-Length': stat.size
        })

        const readStream = fs.createReadStream('./index.html');
        readStream.pipe(res);
    
    }else{
        res.end('404') 
    }
   // res.end('Hi!')
});

server.listen(8000);
