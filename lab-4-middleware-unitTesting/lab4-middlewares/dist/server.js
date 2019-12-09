"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// importing modules
var express = require("express");
/* SESSION */
var session = require("express-session");
var levelSession = require("level-session-store");
var metrics_1 = require("./metrics");
var body_parser_1 = __importDefault(require("body-parser"));
/* USERS HANDLE*/
var user_1 = require("./user");
var app = express();
var port = process.env.PORT || '8081';
app.set('views', __dirname + "/../view");
app.set('view engine', 'ejs');
/* SESSION*/
var LevelStore = levelSession(session);
app.use(session({
    secret: 'my very secret phrase',
    store: new LevelStore('./db/sessions'),
    resave: true,
    saveUninitialized: true
}));
/* USER AUTHENTICATION */
var dbUser = new user_1.UserHandler('./db/users');
var authRouter = express.Router();
authRouter.get('/login', function (req, res) {
    res.render('login');
});
authRouter.get('/signup', function (req, res) {
    res.render('signup');
});
authRouter.get('/logout', function (req, res) {
    delete req.session.loggedIn;
    delete req.session.user;
    res.redirect('/login');
});
authRouter.post('/login', function (req, res, next) {
    dbUser.get(req.body.username, function (err, result) {
        if (err)
            next(err);
        if (result === undefined || !result.validatePassword(req.body.password)) {
            res.redirect('/login');
        }
        else {
            req.session.loggedIn = true;
            req.session.user = result;
            res.redirect('/');
        }
    });
});
app.use(authRouter);
/* USER CREATION AND RETRIEVAL */
var userRouter = express.Router();
userRouter.post('/', function (req, res, next) {
    dbUser.get(req.body.username, function (err, result) {
        if (!err || result !== undefined) {
            res.status(409).send("user already exists");
        }
        else {
            dbUser.save(req.body, function (err) {
                if (err)
                    next(err);
                else
                    res.status(201).send("user persisted");
            });
        }
    });
});
userRouter.get('/:username', function (req, res, next) {
    dbUser.get(req.params.username, function (err, result) {
        if (err || result === undefined) {
            res.status(404).send("user not found");
        }
        else
            res.status(200).json(result);
    });
});
app.use('/user', userRouter);
/* USER AUTHORIZATION MIDDLEWARE */
var authCheck = function (req, res, next) {
    if (req.session.loggedIn) {
        next();
    }
    else
        res.redirect('/login');
};
app.get('/', authCheck, function (req, res) {
    res.render('index', { name: req.session.username });
});
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
    res.render('index.ejs', { name: null });
});
app.get('/hello/:name', function (req, res) {
    res.render('index.ejs', { name: req.params.name });
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
