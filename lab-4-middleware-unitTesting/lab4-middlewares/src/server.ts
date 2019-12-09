// importing modules
import express = require('express');
/* SESSION */
import session = require('express-session');
import levelSession = require('level-session-store');
import {Metric, MetricsHandler} from './metrics';
import bodyparser from "body-parser";
/* USERS HANDLE*/
import {UserHandler, Users} from './users';

/* EXPRESS */
const app = express();
const port: string = process.env.PORT || '8081';

/* VIEW ENGINE EJS*/
app.set('views', __dirname + "/../view");
app.set('view engine', 'ejs');


/* SERVER LISTENING */
app.use(bodyparser.json());
app.use(bodyparser.urlencoded());

app.listen(port, (err: Error) => {
    if (err) {
        throw err;
    }
    console.log(`server is listening on port ${port}`);
});

/* SESSION*/
const LevelStore = levelSession(session);

app.use(session({
    secret: 'my very secret phrase',
    store: new LevelStore('./db/sessions'),
    resave: true,
    saveUninitialized: true
}));

/* USER AUTHENTICATION */
const dbUser: UserHandler = new UserHandler('./db/users');
const authRouter = express.Router();

authRouter.get('/login', (req: any, res: any) => {
    res.render('login')
});

authRouter.get('/signup', (req: any, res: any) => {
    res.render('signup')
});

authRouter.get('/logout', (req: any, res: any) => {
    delete req.session.loggedIn;
    delete req.session.user;
    res.redirect('/login')
});

authRouter.post('/login', (req: any, res: any, next: any) => {
    dbUser.get(req.body.username, (err: Error | null, result?: Users) => {
        if (err) next(err);
        if (result === undefined || !result.validatePassword(req.body.password)) {
            res.redirect('/login')
        } else {
            req.session.loggedIn = true;
            req.session.user = result;
            res.redirect('/')
        }
    })
});

app.use(authRouter);

/* USERS CRUD */
const userRouter = express.Router();

userRouter.post('/', (req: any, res: any, next: any) => {
    dbUser.get(req.body.username, function (err: Error | null, result?: Users) {
        if (!err || result !== undefined) {
            res.status(409).send("user already exists")
        } else {
            let user = new Users(req.body.username, req.body.email, req.body.password);
            dbUser.save(user, function (err: Error | null) {
                if (err) next(err);
                else res.status(201).send("user persisted");
            })
        }
    })
});

userRouter.get('/:username', (req: any, res: any, next: any) => {
    dbUser.get(req.params.username, function (err: Error | null, result?: Users) {
        if (err || result === undefined) {
            res.status(404).send("user not found")
        } else res.status(200).json(result)
    })
});

app.use('/user', userRouter);

/* USER AUTHORIZATION MIDDLEWARE */

const authCheck = function (req: any, res: any, next: any) {
    if (req.session.loggedIn) {
        next()
    } else res.redirect('/login')
};

app.get('/', authCheck, (req: any, res: any) => {
    res.render('index', {name: req.session.user.username})
});

/* METRICS */
const dbMet: MetricsHandler = new MetricsHandler('./db/metrics');

app.post('/:id', (req: any, res: any) => {
    dbMet.save(req.params.id, req.body, (err: Error | null) => {
        if (err) throw err;
        console.log("saved");
        res.status(200).send("ok")
    })
});

app.get('/metrics/:id', (req: any, res: any) => {
    dbMet.getAll(req.params.id, null, (result: Metric[] | null, err: Error | null) => {
        if (err) throw err;
        console.log("getAll");
        res.status(200).send(result);
    })
});

app.get('/metrics/:id/:timestamp', (req: any, res: any) => {
    dbMet.getAll(req.params.id, req.params.timestamp, (result: Metric[] | null, err: Error | null) => {
        if (err) throw err;
        console.log("getAllByTimestamp");
        res.status(200).send(result);
    })
});

app.delete('/metrics/:id/:timestamp', (req: any, res: any) => {
    dbMet.delete(req.params.id, req.params.timestamp, (err: Error | null) => {
        if (err) throw err;
        console.log("deleteByTimestamp");
        res.status(200).send("Delete successful !");
    })
});