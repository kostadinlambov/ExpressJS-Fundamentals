const fs = require('fs')
const Image = require('mongoose').model('Image')
const Tag = require('mongoose').model('Tag')
// const ObjectId = require('mongoose').Types.ObjectId;

module.exports = (req, res) => {
  if (req.pathname === '/search') {

    fs.readFile('./views/results.html', 'utf8', (err, html) => {
      if (err) {
        throw err
      }

      const params = {};
      //console.log(req)

      const afterDate = req.pathquery.afterDate;
      const beforeDate = req.pathquery.beforeDate;
      const limit = Number(req.pathquery.limit);

      if (afterDate !== "") {
        params.afterDate = afterDate;

      }
      if (beforeDate !== "") {
        params.beforeDate = beforeDate;
      }

      if (limit !== 0) {
        params.limit = limit;
      }

      if (req.pathquery.tagName !== null) {
        tags = req.pathquery.tagName.split(/,\s+/).filter(e => e.length > 0)

        if (tags.length > 0) {
          Tag.find({
            name: {
              $in: tags
            }
          }).then(data => {
            const tagIds = data.map(m => m._id);
            params.tags = tagIds;
            getImagesAndRespond(params);
          });
        } else {
          getImagesAndRespond(params);
        }
      }


      function getImagesAndRespond(params) {
        if (params.afterDate === undefined && params.tags === undefined
          && params.beforeDate === undefined) {
          Image.find({})
            .limit(params.limit || 10)
            .then(data => {
              console.log(data)
              printHtml(data, html, res)

            }).catch(err => catchError(err, html));
        }else if (params.afterDate !== undefined  &&
          params.limit === undefined && params.tags === undefined) {
          Image.find()
            .where('creationDate').gt(params.afterDate)
            .limit(params.limit || 10)
            .then(data => {
              console.log(data)
              printHtml(data, html, res)

            }).catch(err => catchError(err, html));
        }  else if (params.afterDate !== undefined && 
          params.limit !== undefined && params.tags === undefined) {
          Image.find()
            .where('creationDate').gt(params.afterDate).lt(params.beforeDate|| Date.now()+1)
            .limit(params.limit || 10)
            .then(data => {
              console.log(data)
              printHtml(data, html, res)
            }).catch(err => catchError(err, html));
        }else if (params.afterDate === undefined  && params.tags !== undefined) {
          Image.find({tags: {$in: params.tags}})          
            .limit(params.limit || 10)
            .then(data => {
              console.log(data)
              printHtml(data, html, res)

            }).catch(err => catchError(err, html));
        }else if (params.afterDate !== undefined && params.tags !== undefined) {
          Image.find({tags: {$in: params.tags}}) 
            .where('creationDate').gt(params.afterDate).lt(params.beforeDate|| Date.now()+1)         
            .limit(params.limit || 10)
            .then(data => {
              console.log(data)
              printHtml(data, html, res)

            }).catch(err => catchError(err, html));
        }else if (params.afterDate === undefined && params.tags === undefined &&
          params.limit !== undefined ) {
          Image.find({})
            .limit(params.limit || 10)
            .then(data => {
              console.log(data)
              printHtml(data, html, res)

            }).catch(err => catchError(err, html));
          }else{
            console.log('Error')
            printHtml([], html, res)
          }
      }
    });

  } else {
    return true
  }
}

function printHtml(data, html, res) {
  let imageHtml = ''
  for (let image of data) {
    imageHtml += imageTemplate(image);
  }

  if(data.length === 0){
    html = html.replace(`<div class="replaceMe"></div>`,
     '<h1 style="color: red">A resource associated with the request could not be found!</h1>');
  }else{
    html = html.replace(`<div class="replaceMe"></div>`, imageHtml)
  }


  res.writeHead(200, {
    'Content-Type': 'text/html'
  });

  res.write(html);
  res.end();
}

function catchError(err, html) {
  console.log(err)

  res.writeHead(302, {
    'Location': './views/results.html'
  });
  res.write(html);
  res.end(html);
}

function imageTemplate(image) {
  return `<fieldset id = "${image._id}">
  <p><img src="${image.url}"></p>
  </img><p>${image.description}</p>
  <button class="displayed" onclick='location.href="/delete?id=${image._id}"'class='deleteBtn'>Delete
  </button> 
  </fieldset>`
}