// importing modules
const http = require('http');

const handles = require('./handles');

const server = http.createServer(handles.serverHandle);
server.listen(8080);

// go to http://localhost:8080/