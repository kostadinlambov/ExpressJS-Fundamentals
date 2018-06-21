const Article = require('mongoose').model('Article')
const Edit = require('mongoose').model('Edit')

async function create(data) {
        const articleObj = {
            title: data.title,
            // content: bodyparams.content
        }

    //    return await Article.create({
    //     title: data.title
    //    })


       return await Edit.create(editObj);
                    // .then(newEdit => {
                    //     console.log(newEdit)
                    //     console.log()

                    //     Article.findById(articleId)
                    //     .then(selectedArticle => {
                    //         selectedArticle.edits.push(newEdit.id)

                    //         selectedArticle.save().then(() => {
                    //                     res.redirect('/');
                    //                     // res.redirect('back')
                    //                 }) 
                    //     }).catch()
                        
                    // })
    
}

async function getAll(){
    const products = await Product.find({});
    const chicken = products.filter (x => x.category === 'chicken');
    const beef = products.filter (x => x.category === 'beef');
    const lamb = products.filter (x => x.category === 'lamb');
    return {
        chicken,
        beef,
        lamb
    }
}

module.exports = {
    create,
    getAll
}