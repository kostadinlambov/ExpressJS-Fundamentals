let express = require('express');
let app = express();
let handlebars = require('express-handlebars');

app.engine('.hbs', handlebars({
    extname: '.hbs',
    partialsDir: 'views/partials'
}))

app.set('view engine', '.hbs');

let context = {
  memes:  [
        {
            id: '1',
            url: 'first meme Url'
        },
        {
            id: '2',
            url: 'second meme Url'
        },
        {
            id: '3',
            url: 'third meme Url'
        }
    ]
};

app.get('/', (req, res) => {
    res.render('home', context)
})


app.listen(1337, () => console.log('Running on port ' + 1337))