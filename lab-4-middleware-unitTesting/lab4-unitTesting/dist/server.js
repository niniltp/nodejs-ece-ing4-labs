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
var users_1 = require("./users");
/* EXPRESS */
var app = express();
var port = process.env.PORT || '8081';
/* VIEW ENGINE EJS*/
app.set('views', __dirname + "/../view");
app.set('view engine', 'ejs');
/* SERVER LISTENING */
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded());
app.listen(port, function (err) {
    if (err) {
        throw err;
    }
    console.log("server is listening on port " + port);
});
/* SESSION*/
var LevelStore = levelSession(session);
app.use(session({
    secret: 'my very secret phrase',
    store: new LevelStore('./db/sessions'),
    resave: true,
    saveUninitialized: true
}));
/* USER AUTHENTICATION */
var dbUser = new users_1.UserHandler('./db/users');
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
/* USERS CRUD */
var userRouter = express.Router();
userRouter.post('/', function (req, res, next) {
    console.log(req.body);
    dbUser.get(req.body.username, function (err, result) {
        if (!err || result !== undefined) {
            res.status(409).send("user already exists");
        }
        else {
            var user = new users_1.Users(req.body.username, req.body.email, req.body.password);
            dbUser.save(user, function (err) {
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
    res.render('index', { name: req.session.user.username });
});
/* METRICS */
var dbMet = new metrics_1.MetricsHandler('./db/metrics');
app.post('/users/:username/metrics', function (req, res) {
    console.log(req);
    dbMet.save(req.params.username, req.body, function (err) {
        if (err)
            throw err;
        console.log("saved");
        res.status(200).send("ok");
    });
});
app.get('/users/:username/metrics', function (req, res) {
    dbMet.get(req.params.username, null, function (err, result) {
        if (err)
            throw err;
        console.log("get");
        res.status(200).send(result);
    });
});
app.get('/users/:username/metrics/:metricId', function (req, res) {
    dbMet.get(req.params.username, req.params.metricId, function (err, result) {
        if (err)
            throw err;
        console.log("getById");
        res.status(200).send(result);
    });
});
app.delete('/users/:username/metrics/:metricId', function (req, res) {
    dbMet.delete(req.params.username, req.params.metricId, function (err) {
        if (err)
            throw err;
        console.log("deleteByTimestamp");
        res.status(200).send("Delete successful !");
    });
});
