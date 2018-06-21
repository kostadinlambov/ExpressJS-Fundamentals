const Article = require('mongoose').model('Article')
const Edit = require('mongoose').model('Edit')

async function create(data) {
        const articleObj = {
            title: data.title,
            // content: bodyparams.content
        }

       return await Article.create({
        title: data.title
       })
    
}

async function findById (articleId){
    return await Article.findById(articleId);     
}

async function getAll(){
    return await Article.find(); 
}

module.exports = {
    create,
    getAll,
    findById
}