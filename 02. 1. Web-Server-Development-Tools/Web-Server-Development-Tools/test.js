if(path.startsWith('/static/')){
    if(path.endsWith('.css')){
        res.writeHead(200,{
            'content-type': 'text/css'
        });
    }else  if(path.endsWith('.js')){
        res.writeHead(200,{
            'content-type': 'application/javascript'
        });
    }

    fs.readFile('.' + path, 'utf8', (err,data) =>{
       res.write(data);
       res.end;
    });

}
else if(path == '/static/site.css' ){
    fs.readFile('./static/site.css', 'utf8', (err, data) =>{
        res.writeHead(200,{
            'content-type': 'text/css'
        });

        res.write(data);
        res.end();
    });
}else if(path == '/static/app.js' ){
    fs.readFile('./static/app.js', 'utf8', (err, data) =>{
        res.writeHead(200,{
            'content-type': 'application/javascript'
        });

        res.write(data);
        res.end();
    });
}


if(path.startsWith('/static/')){
    if(path.endsWith('.css')){
        res.writeHead(200,{
            'content-type': 'text/css'
        });
    }else  if(path.endsWith('.js')){
        res.writeHead(200,{
            'content-type': 'application/javascript'
        });
    }

    fs.readFile('.' + path, 'utf8', (err, data) =>{
       res.write(data);
       res.end();
    } )
}else if(path == '/' || path =='/index.html'){
        fs.readFile('./index.html', 'utf8', (err, data) =>{
            res.writeHead(200,{
                'content-type': 'text/html'
            });
    
            res.write(data);
            res.end();
        });
    }else if(path == '/about.html' ){
        fs.readFile('./about.html', 'utf8', (err, data) =>{
            res.writeHead(200,{
                'content-type': 'text/html'
            });
    
            res.write(data);
            res.end();
        });
    }else if(path == '/catPic.png' ){
        fs.readFile('./static/cat.png', 'utf8', (err, data) =>{
            res.writeHead(200,{
                'content-type': 'image/png'
            });
    
            res.write(data);
            res.end();
        });
    }else{
        fs.readFile('./error.html', 'utf8', (err, data) =>{
            res.writeHead(404,{
                'content-type': 'text/html'
            });
            res.write(data);
            res.end();
        });
    }