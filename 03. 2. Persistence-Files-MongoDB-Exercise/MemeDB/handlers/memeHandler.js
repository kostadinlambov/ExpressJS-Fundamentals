const fs = require('fs');
const url = require('url');
const dataBase = require('../config/dataBase')
const formidable = require('formidable')
const shortid = require('shortid')
const qs = require('querystring')

const viewDetailsPath = 'views/details.html'


function viewAll(req, res) {
  let memes = dataBase.getDb();

  memes = memes
    .sort((a, b) => a.dateStamp - b.dateStamp)
    .filter(x => x.privacy === 'on')

  fs.readFile('views/viewAll.html', 'utf8', (err, data) => {
    if (err) {
      console.log(err);
      return;
    }

    let origin = '<div id="replaceMe">{{replaceMe}}</div>'
    let memesString = ''

    for (let meme of memes) {
      if(meme.privacy === 'on'){
        memesString += `<div class="meme">
        <a href="/getDetails?id=${meme.id}">
        <img class="memePoster" src="${meme.memeSrc}"/>          
        </div>`
      }
    }

    data = data.toString().replace(origin, memesString)

    res.writeHead(200, {
      "Content-Type": "text/html"
    });
    res.write(data)
    res.end()

  })
}

function viewAddMeme(req, res) {
  fs.readFile('views/addMeme.html', 'utf8', (err, data) => {
    if (err) {
      console.log(err)
    }

    res.writeHead(200, {
      'Content-Type': 'text/html'
    })

    res.write(data);
    res.end();
  })
}

function addMeme(req, res) {
  let form = new formidable.IncomingForm();

  form.parse(req, (err, fields, files) => {
    if (err) {
      console.log(err);
      return;
    }

    createMeme(files, fields);

    res.writeHead(302, {
      'Location': './viewAllMemes'
    })

    res.write('Added File Successfully!')
    res.end();
  })
}

function getDetails(req, res) {
  let queryStrObject = qs.parse(req.url.substr(req.url.lastIndexOf('?') + 1));
  // let queryStrObj = qs.parse(url.parse(req.url).query);
  // let queryStrId = qs.parse(url.parse(req.url).query).id;
  let allMemes = dataBase.getDb()
  let targetedMeme = undefined;

  targetedMeme = allMemes.find(x => x['id'] === queryStrObject['id'])

  fs.readFile(viewDetailsPath, 'utf8', (err, data) => {
    if (err) {
      console.log(err);
      return;
    }

    let origin = '<div id="replaceMe">{{replaceMe}}</div>'
    let memesString = ''

    memesString = `<div class="content">
    <img src="${targetedMeme.memeSrc}" alt=""/>
    <h3>${targetedMeme.title}</h3>
    <p> ${targetedMeme.description}</p>
        <a href="${targetedMeme.memeSrc}" download = "${targetedMeme.title}.jpg">Download Meme</a>
    </div>`

    data = data.toString().replace(origin, memesString)

    res.writeHead(200, {
      "Content-Type": "text/html"
    });

    res.write(data)
    res.end()
  })

}

function createMeme(files, fields) {
  let file = files.meme;
  let tempPath = file.path;
  // let fileName = file.name;

  let privacy = fields.status;

  let length = dataBase.getDb().length + 1 

  let folderName = Math.ceil(length / 5);
  let folderPath = `./public/memeStorage/${folderName}`
  let fileName = shortid.generate() + '.jpg';


  fs.access(folderPath, err => {
    if (err) {
      console.log(err)
      fs.mkdirSync(folderPath)
    }

    let memeSrc = folderPath + `/${fileName}`

    fs.rename(tempPath, memeSrc, (err) => {
      if (err) {
        console.log(err)
        return;
      }

      let id = shortid.generate();
      let title = fields.memeTitle;
      let description = fields.memeDescription;

      let meme = {
        id: id,
        title: title,
        memeSrc: memeSrc,
        description: description,
        privacy: privacy,
        dateStamp: Date.now()
      }

      dataBase.add(meme);

      dataBase.save()
        .then(res => console.log('Meme saved successfully!'))
    });

  });
}

module.exports = (req, res) => {
  if (req.pathname === '/viewAllMemes' && req.method === 'GET') {
    viewAll(req, res)
  } else if (req.pathname === '/addMeme' && req.method === 'GET') {
    viewAddMeme(req, res)
  } else if (req.pathname === '/addMeme' && req.method === 'POST') {
    addMeme(req, res)
  } else if (req.pathname.startsWith('/getDetails') && req.method === 'GET') {
    getDetails(req, res)
  } else {
    return true
  }
}