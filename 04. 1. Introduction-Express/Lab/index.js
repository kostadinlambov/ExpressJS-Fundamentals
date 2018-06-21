let express = require('express');
let app = express();

let port = 1337;

app.get('/home', (req, res) => {
    res.status(200)
    res.send('Welcome to Express.js!')

})

app.post('/home', (req, res) => {
    res.status(200)
    res.send('Post request - Welcome to Express.js!')

})

app.get('/users/:userId', (req, res) => {
    let paramsObj = req.params
    res.send(paramsObj)
})

app.get('/users/:userId/:name/:age', (req, res) => {
    let paramsObj = req.params
    res.send(paramsObj)
})


app.listen(port, () => console.log('Runnig on port '+ port))