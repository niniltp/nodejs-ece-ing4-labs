"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// importing modules
var express = require("express");
var metrics_1 = require("./metrics");
var body_parser_1 = __importDefault(require("body-parser"));
var app = express();
var port = process.env.PORT || '8081';
// app.use(express.static(path.join(__dirname, 'public')));
app.set('views', __dirname + "/../view");
app.set('view engine', 'ejs');
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded());
app.listen(port, function (err) {
    if (err) {
        throw err;
    }
    console.log("server is listening on port " + port);
});
app.get('/', function (req, res) {
    res.render('index.ejs', { port: port, name: req.params.name });
});
app.get('/hello', function (req, res) {
    res.render('hello.ejs', { name: null });
});
app.get('/hello/:name', function (req, res) {
    res.render('hello.ejs', { name: req.params.name });
});
var dbMet = new metrics_1.MetricsHandler('./db/metrics');
app.post('/metrics/:id', function (req, res) {
    dbMet.save(req.params.id, req.body, function (err) {
        if (err)
            throw err;
        console.log("saved");
        res.status(200).send("ok");
    });
});
app.get('/metrics/:id', function (req, res) {
    dbMet.getAll(req.params.id, null, function (result, err) {
        if (err)
            throw err;
        console.log("getAll");
        res.status(200).send(result);
    });
});
app.get('/metrics/:id/:timestamp', function (req, res) {
    dbMet.getAll(req.params.id, req.params.timestamp, function (result, err) {
        if (err)
            throw err;
        console.log("getAllByTimestamp");
        res.status(200).send(result);
    });
});
app.delete('/metrics/:id/:timestamp', function (req, res) {
    dbMet.delete(req.params.id, req.params.timestamp, function (err) {
        if (err)
            throw err;
        console.log("deleteByTimestamp");
        res.status(200).send("Delete successful !");
    });
});
