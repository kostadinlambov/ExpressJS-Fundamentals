const homeController = require('../controllers/homeController')
const booksController = require('../controllers/booksController')

module.exports = (app) => {
    app.get('/', homeController.getIndex)
    app.get('/add', booksController.getAddBook)
    app.post('/add', booksController.postAddBook)
    app.get('/all', booksController.getAll)
    app.get('/details/:id', booksController.getDetails)
}