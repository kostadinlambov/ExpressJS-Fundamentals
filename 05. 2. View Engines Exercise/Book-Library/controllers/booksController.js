const Book = require('../data/Book')

module.exports = {
    getAddBook: (req, res) => {
        res.render('books/add')
    },


    postAddBook: (req, res) => {
        let book = req.body;

        if (!book.title || !book.imageUrl) {
            book.error = 'Title and Image URL are required'
            res.render('books/add', book)
        }

        console.log(book)
        // book.releaseDate = new Date(book.releaseDate)

        // console.log(releaseDate)

        Book.create(book).then(() => {
            res.redirect('/all')
        })

    },
    getAll: (req, res) => {
        const page = +req.query.page

        Book
            .find()
            .sort('-releaseDate')
            .skip((page - 1) * 10)
            .limit(10)
            .then(books => {
                res.render('books/all', {
                    books
                })
            })
    },
    getDetails: (req, res) => {
        const id = req.params.id

        Book.findById(id)
            .then(book => {
                console.log(book)
                res.render('books/details', book)
            })
    }
}