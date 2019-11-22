const url = require('url');
const qs = require('querystring');

const writeContentHelloExplained = () => {
    return '<!DOCTYPE html>' +
        '<html>' +
        '   <head>' +
        '   <meta charset="utf-8"/>' +
        '       <title>ECE AST</title>' +
        '   </head>' +
        '   <body>' +
        '       <h1>How does /hello works ?</h1>' +
        '       <h2>Hello someone</h2>' +
        '       <p>Add ?hello/name=someone to the url and replace "someone" with your actual name so we can greet you properly !</p>' +
        '       <p>Go to <a href="http://localhost:8080/hello?name=someone">http://localhost:8080/hello?name=someone</a></p>' +
        '       <h2>Us</h2>' +
        '       <p>Add ?hello/name=jonathan to the url to learn a little bit about him</p>' +
        '       <p>Go to <a href="http://localhost:8080/hello?name=jonathan">http://localhost:8080/hello?name=jonathan</a></p>' +
        '       <p>Add ?hello/name=nhien to the url to learn a little bit about her</p>' +
        '       <p>Go to <a href="http://localhost:8080/hello?name=nhien">http://localhost:8080/hello?name=nhien</a></p>' +
        '       <p>Add ?hello/name=oceane to the url to learn a little bit about her</p>' +
        '       <p>Go to <a href="http://localhost:8080/hello?name=oceane">http://localhost:8080/hello?name=oceane</a></p>' +
        '   </body>' +
        '</html>';
};

const writeContentHelloName = (name) => {
    return '<!DOCTYPE html>' +
        '<html>' +
        '   <head>' +
        '   <meta charset="utf-8"/>' +
        '       <title>ECE AST</title>' +
        '   </head>' +
        '   <body>' +
        '       <p>Hello ' + name + ' ! How are you ?</p>' +
        '       <br/><br/><a href="/">Home</a>' +
        '   </body>' +
        '</html>';
};

const writeContentJonathan = () => {
    return '<!DOCTYPE html>' +
        '<html>' +
        '   <head>' +
        '   <meta charset="utf-8"/>' +
        '       <title>ECE AST</title>' +
        '   </head>' +
        '   <body>' +
        '       <h1>Hi, I\'m Jonathan !</h1>' +
        '       <p>My name is Jonathan BOUTAKHOT. I am 21 years old.<br/><br/> ' +
        '       I am a student at ECE Paris engineering school in Paris. ' +
        '       I\'m on my 4th year of studies. This year we need to find an internship. I\'m studying information system. <br>' +
        '       Thanks for reading.</p>' +
        '       <br/><br/><a href="/">Home</a>' +
        '   </body>' +
        '</html>';
};

const writeContentNhien = () => {
    return '<!DOCTYPE html>' +
        '<html>' +
        '   <head>' +
        '   <meta charset="utf-8"/>' +
        '       <title>ECE AST</title>' +
        '   </head>' +
        '   <body>' +
        '       <h1>Hi, I\'m Nhien !</h1>' +
        '       <p>I\'m a french student at the engineering school ECE Paris-Lyon.<br/><br/> ' +
        '       I\'m doing my M1 and I\'m currently looking for a 4 or 5 months internship (from 2020 April 15 where I would like to discover new fields, like Big Data or Cybersecurity !' +
        '       I love IT, development (web and software and I also like to learn new things !</p>' +
        '       <br/><br/><a href="/">Home</a>' +
        '   </body>' +
        '</html>';
};

const writeContentOceane = () => {
    return '<!DOCTYPE html>' +
        '<html>' +
        '   <head>' +
        '   <meta charset="utf-8"/>' +
        '       <title>ECE AST</title>' +
        '   </head>' +
        '   <body>' +
        '       <h1>Hi, I\'m Oceane !</h1>' +
        '       <p>My name is Oceane Salmeron.<br/><br/> ' +
        '       I\'m an engineer student at the school ECE Paris and I am majoring in IT!<br>' +
        '       I will graduate in 2021.</p>' +
        '       <br/><br/><a href="/">Home</a>' +
        '   </body>' +
        '</html>';
};


const writePageNotFound = () => {
    return '<!DOCTYPE html>' +
        '<html>' +
        '   <head>' +
        '   <meta charset="utf-8"/>' +
        '       <title>ECE AST</title>' +
        '   </head>' +
        '   <body>' +
        '       <h1>Sorry, your page was not found...</h1>' +
        '       <h2>Are you sure about the URL ? Maybe try to go to <a href="http://localhost:8080/">http://localhost:8080/</a></h2>' +
        '       <br/><br/><a href="/">Home</a>' +
        '   </body>' +
        '</html>';
};

module.exports = {
    serverHandle: function (req, res) {
        const route = url.parse(req.url);
        const path = route.pathname;
        const params = qs.parse(route.query);

        if (path === '/') {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(writeContentHelloExplained());
        } else if (path === '/hello' && 'name' in params && params['name'] !== '') {
            res.writeHead(200, {'Content-Type': 'text/html'});
            const name = params['name'];

            if (name === 'jonathan') {
                res.write(writeContentJonathan());
            } else if(name === 'nhien'){
                res.write(writeContentNhien());
            } else if(name === 'oceane'){
                res.write(writeContentOceane());
            }
            else {
                res.write(writeContentHelloName(name));
            }
        } else {
            // Error
            res.writeHead(404, {'Content-Type': 'text/html'});
            res.write(writePageNotFound());
        }

        res.end();
    }
};