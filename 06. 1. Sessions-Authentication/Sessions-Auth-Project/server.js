const app = require('express')();
const cookieParser = require('cookie-parser');
const session = require('express-session');
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const passport = require('passport');
const authRouter = require('./auth');


const products = [
    {
        name: 'Apple',
        cost: 10
    },
    {
        name: 'Banana',
        cost: 12
    }, {
        name: 'Orange',
        cost: 8
    }
];

app.engine('.hbs', handlebars({
    extname: '.hbs'
}));
app.set('view engine', '.hbs');

app.use(cookieParser());
app.use(session({
    secret: 'keyboard cat !@#'
}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRouter);

function isAuthenticated(req, res, next) {
    if (req.user === undefined) {
        return res.redirect('/auth/login');
    }
    next();
}
/*
app.use((req, res, next) => {
    if (req.session.user === undefined) {
        return res.redirect('/auth/login');
    }
    next();
});
*/

app.get('/', (req, res) => {
    const username = (req.user || {username: 'anonymous'}).username;
    const numItems = (req.session.cart || []).length;
    const message = req.session.message;
    req.session.message = '';
    res.render('index', {
        products,
        numItems,
        message,
        username
    });
});

app.get('/add/:id', (req, res) => {
    if (req.session.cart === undefined) {
        req.session.cart = [];
    }
    const product = products[Number(req.params.id)];
    req.session.cart.push(product);
    req.session.message = "Product added to cart";
    res.redirect('/');
});

app.get('/readSession', (req, res) => {
    res.json(req.session);
});

app.get('/cart', isAuthenticated, (req, res) => {
    const items = req.session.cart || [];
    const numItems = items.length;
    const total = items.reduce((p, c) => p + c.cost, 0);
    res.render('cart', {
        items,
        numItems,
        total
    });
});

app.get('/remove/:id', (req, res) => {
    const items = req.session.cart || [];
    const id = Number(req.params.id);
    req.session.cart = items.filter((p, i) => i != id);
    res.redirect('/cart');
});

app.listen(3000);