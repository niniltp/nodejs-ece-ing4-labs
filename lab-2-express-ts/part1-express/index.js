// importing modules
const express = require('express');
const path = require ('path');
const metrics = require('./metrics');

const app = express();
app.use(express.static(path.join(__dirname, 'public')));

app.set('port', 8080);
app.set('views', __dirname + "/view");
app.set('view engine', 'ejs');

app.listen(
    app.get('port'), () => console.log(`server listening on ${app.get('port')}`)
    // go to http://localhost:8080/
);

app.get('/', (req, res) => {
    res.render('index.ejs', {name: req.params.name});
});

app.get('/hello', (req, res) => {
    res.render('hello.ejs')
});

app.get('/hello/:name', (req, res) => {
    res.render('hello-someone.ejs', {name: req.params.name});
});

app.get('/metrics.json', (req, res) => {
    metrics.get((err, data) => {
        if(err) throw err;
        res.status(200).json(data);
    })
});
