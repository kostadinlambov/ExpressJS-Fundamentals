const fs = require('fs')
const filePath = './public/images/favicon.ico'
const qs = require('querystring')

let typeChecker = path => {
  let support = {
    '.css': 'text/css',
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.png': 'image/png',
    '.jpg': 'image/jpg'
  }

  for (let type in support) {
    if (path.endsWith(type)) {
      return support[type]
    }
  }
  return true
}

let getFavicon = (req, res) => {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      console.log(err)
      return
    }
    res.writeHead(200, {
      'Content-Type': 'imaga/x-icon'
    })
    res.end(data)
  })
}

let getStaticFiles = (req, res) => {
  let resPath = '.' + req.pathname
  let type = typeChecker(resPath)

  let idObj = qs.parse(req.url.substr(req.url.lastIndexOf('?') + 1));
  let id = idObj['id'];

  fs.readFile(resPath, (err, data) => {
    if (err) {
      console.log(err)
      return
    }
    
    if (idObj['download'] === 'true') {
      res.writeHead(200, {
        "Content-Type": "image/jpg",
        "Content-Disposition": `attachment; filename=\"Picture.jpg\"`
      });
    }else{
      res.writeHead(200, {
        'Content-Type': type
      })
    }

    res.end(data)
  })
}

let handler404 = (req, res) => {

  res.writeHead(404, 'Resource not found')
  res.end()

}

module.exports = (req, res) => {
  let resPath = '.' + req.pathname
  let type = typeChecker(resPath)

  if (req.pathname === '/favicon.ico' && req.method === 'GET') {
    getFavicon(req, res)
  } else if (
    req.pathname.startsWith('/public/') &&
    req.method === 'GET' &&
    type !== true
  ) {
    getStaticFiles(req, res)
  }  else if (
    req.pathname.startsWith('/public/') &&
    req.method === 'GET' &&
    type !== true
  ) {
    getStaticFiles(req, res)
  } 
  
  else {
    handler404(req, res)
  }
}
