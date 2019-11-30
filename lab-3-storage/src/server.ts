// importing modules
import express = require('express');
import {Metric, MetricsHandler} from './metrics';
import bodyparser from "body-parser";

const app = express();
const port: string = process.env.PORT || '8081';

// app.use(express.static(path.join(__dirname, 'public')));

app.set('views', __dirname + "/../view");
app.set('view engine', 'ejs');

app.use(bodyparser.json());
app.use(bodyparser.urlencoded());

app.listen(port, (err: Error) => {
    if (err) {
        throw err;
    }
    console.log(`server is listening on port ${port}`);
});

app.get('/', (req, res) => {
    res.render('index.ejs', {port: port, name: req.params.name});
});

app.get('/hello', (req, res) => {
    res.render('hello.ejs', {name: null});
});

app.get('/hello/:name', (req, res) => {
    res.render('hello.ejs', {name: req.params.name});
});

const dbMet: MetricsHandler = new MetricsHandler('./db/metrics');

app.post('/metrics/:id', (req: any, res: any) => {
    dbMet.save(req.params.id, req.body, (err: Error | null) => {
        if (err) throw err;
        console.log("saved");
        res.status(200).send("ok")
    })
});

app.get('/metrics/:id', (req: any, res: any) => {
    dbMet.getAll(req.params.id,  null,(result: Metric[] | null, err: Error | null) => {
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