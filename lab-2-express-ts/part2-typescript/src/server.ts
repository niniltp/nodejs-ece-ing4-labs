// importing modules
import express = require('express');
import path = require('path');
import { MetricsHandler } from './metrics';

const app = express();
const port: string = process.env.PORT || '8080';

// app.use(express.static(path.join(__dirname, 'public')));

app.set('views', __dirname + "/../view");
app.set('view engine', 'ejs');

app.listen(port, (err: Error) => {
    if (err) {
        throw err;
    }
    console.log(`server is listening on port ${port}`);

    // go to http://localhost:8080/
});

app.get('/', (req, res) => {
    res.render('index.ejs', {name: req.params.name});
});

app.get('/hello', (req, res) => {
    res.render('hello.ejs')
});

app.get('/hello/:name', (req, res) => {
    res.render('hello-someone.ejs', {name: req.params.name});
});

app.get('/metrics.json', (req: any, res: any) => {
    MetricsHandler.get((err: Error | null, result?: any) => {
        if (err) {
            throw err
        }
        res.json(result)
    })
});
