const fs = require('fs');

const mimeTypes = {
    'css' : 'text/css',
    'js' : 'application/javascript',
    'png' : 'image/png',
}

function staticHandler(req, res){

    if(req.path.startsWith('/static/')){
        if(req.path.endsWith('.css')){
            const extension = req.path.split('.').pop();
            res.writeHead(200,{
                'content-type': mimeTypes[extension]
            });
        }else  if(req.path.endsWith('.js')){
            res.writeHead(200,{
                'content-type': 'application/javascript'
            });
        }

        fs.readFile('.' + req.path, 'utf8', (err, data) =>{
           res.write(data);
           res.end();
        } )
    }else{
        return true;
    }
}

module.exports = staticHandler;