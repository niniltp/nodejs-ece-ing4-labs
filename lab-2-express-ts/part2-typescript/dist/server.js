"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// importing modules
var express = require("express");
var path = require("path");
var metrics_1 = require("./metrics");
var app = express();
var port = process.env.PORT || '8080';
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', __dirname + "/view");
app.set('view engine', 'ejs');
app.listen(app.get('port'), function () { return console.log("server listening on " + app.get('port')); }
// go to http://localhost:8080/
);
app.get('/', function (req, res) {
    res.render('index.ejs', { name: req.params.name });
});
app.get('/hello', function (req, res) {
    res.render('hello.ejs');
});
app.get('/hello/:name', function (req, res) {
    res.render('hello-someone.ejs', { name: req.params.name });
});
app.get('/metrics.json', function (req, res) {
    metrics_1.MetricsHandler.get(function (err, result) {
        if (err) {
            throw err;
        }
        res.json(result);
    });
});
