const express = require('express')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const session = require('express-session')
const passport = require('passport')
const handlebars = require('express-handlebars')
const path = require('path')

module.exports = (app) => {
   // View engine setup.
  //  app.set('views', path.join(__dirname, './views'));
   app.engine('.hbs', handlebars({
       extname: '.hbs',
       layoutsDir: 'views/layouts',
       defaultLayout: 'main',
       partialsDir: 'views/partials',
   }))

   app.set('view engine', '.hbs');

   // We will use cookies.
  app.use(cookieParser())

   // This set up which is the parser for the request's data.
  app.use(bodyParser.urlencoded({ extended: true }))

  // Session is storage for cookies, which will be de/encrypted with that 'secret' key.
  app.use(session({
    secret: 'neshto-taino!@#$%',
    resave: false,
    saveUninitialized: false
  }))

  // For user validation we will use passport module.
  app.use(passport.initialize())
  app.use(passport.session())

  app.use((req, res, next) => {
    if (req.user) {
      res.locals.currentUser = req.user
    }

    next()
  })

   // This makes the content in the "public" folder accessible for every user.
  app.use(express.static('public'))

   // We can add second "public" folder
   // app.use(express.static(path.join(config.rootFolder, 'meme')));

  console.log('Express ready!')
}
