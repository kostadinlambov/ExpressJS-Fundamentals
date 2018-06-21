const Article = require('../data/Article')
const Edit = require('../data/Edit')
// const Edit = require('mongoose').model('Edit')
const articleApi = require('../api/article')
const editApi = require('../api/edit')

module.exports = {
    createGet: (req, res) => {
        res.render('articles/create')
    },
    createPost: async (req, res) => {
        let bodyparams = req.body;
        let userId = req.user._id


        console.log(req.body)
        try {
            const article = await articleApi.create(req.body);

            let articleId = article.id;


            let editObj = {
                author: userId,
                content: bodyparams.content,
                article: articleId
            }


            articleApi.findById(articleId).then((selectedArticle) => {
                selectedArticle.edits.push(editObj);

                console.log();

                selectedArticle.save().then(() => {
                    console.log()
                    res.redirect('/');
                }).catch(err => {
                    console.log(err)
                })

            })


        } catch (err) {
            console.log(err);
            res.render('articles/create')
        }

    },

    getAllArticles: async (req, res) => {

        try {
            let articles = await articleApi.getAll();
            console.log(articles);

            articles = articles.sort((a, b) => (a.title).localeCompare(b.title))

            res.render('articles/all', {
                articles
            })
        } catch (err) {
            console.log(err);
            res.render('articles/create')
        }

    },

    getDetails: (req, res) => {
        Article.findById(req.params.id).then((article) => {

            let sortedEdits = article.edits.sort((a, b) => a.creationDate - b.creationDate)

            let id = req.params.id
            let content = sortedEdits[0].content
            let title = article.title

            console.log(article);
            console.log(content);

            let paragraphs = content.split(/\r\n/).filter(x => x !== '');

            console.log(paragraphs);
            res.render('articles/details', {
                paragraphs,
                title,
                id
            })
        })

    },

    getEdit: (req, res) => {

        let id = req.params.id

        Article.findById(req.params.id).then((article) => {

            let sortedEdits = article.edits.sort((a, b) => a.creationDate - b.creationDate)

            let id = req.params.id
            let content = sortedEdits[0].content
            let title = article.title

            res.render('articles/edit', {
                id,
                title,
                content
            })

        }).catch(err => {
            console.log(err)
        })




    },

    postEdit: (req, res) => {

        let id = req.body.id

        articleApi.findById(id).then((selectedArticle) => {

            selectedArticle.save().then(() => {
                console.log()
                res.redirect('/');
            }).catch(err => {
                console.log(err)
            })


           // res.render('articles/edit')
        })
    }


}