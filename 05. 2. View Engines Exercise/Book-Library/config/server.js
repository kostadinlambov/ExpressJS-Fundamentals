const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const handlebars = require('express-handlebars')

module.exports = (app) => {
    app.engine('hbs', handlebars({
        extname: '.hbs',
        layoutsDir: 'views/layouts',
        defaultLayout: 'main'
    }))

    app.set('view engine', '.hbs')
    console.log(path.join(__dirname, '../content'))

    app.use(express.static(path.join(__dirname, '../content')))

    app.use(bodyParser.urlencoded({extended: true}))
}