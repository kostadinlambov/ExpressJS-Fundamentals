const controllers = require('../controllers')
const auth = require('./auth')

module.exports = (app) => {
  app.get('/', controllers.home.index)
  app.get('/index.html', controllers.home.index)
  
  // app.get('/about', auth.isAuthenticated, controllers.home.about)

  app.get('/users/register', controllers.users.registerGet)
  app.post('/users/register', controllers.users.registerPost)
  app.get('/users/login', controllers.users.loginGet)
  app.post('/users/login', controllers.users.loginPost)
  app.post('/users/logout', controllers.users.logout)

  //Articles
  // app.get('/articles/create', auth.isAuthenticated, controllers.articles.createGet)
  app.get('/articles/edit/:id', auth.isAuthenticated, controllers.articles.getEdit)
  app.post('/articles/edit', auth.isAuthenticated, controllers.articles.postEdit)
  app.get('/articles/create', auth.isAuthenticated, controllers.articles.createGet)
  app.post('/articles/create', auth.isAuthenticated, controllers.articles.createPost)
  app.get('/articles/all',  controllers.articles.getAllArticles)
  app.get('/articles/getDetails/:id',  controllers.articles.getDetails)
  app.get('/articles/details',  controllers.articles.getDetails)

 



  app.all('*', (req, res) => {
    res.status(404)
    res.send('404 Not Found!')
    res.end()
  })
}
