const express = require('express');
const http = require('http');
const port = 3000;
const appWs = require('./app-ws');
const cors = require('cors');

server = express()
server.use(cors()) 
server.get('/', async (req, res) => {
  res.sendFile(process.cwd() + '/client/index.html');
});

var server = http.createServer( server);

var sv = server.listen(port, () => {
  console.log("server starting on port : " + port + '\n')
});

const wss = appWs(sv);
