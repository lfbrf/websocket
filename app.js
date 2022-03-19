const express = require('express');

const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const express = require('express');
const https = require('https');
const fs = require('fs');

app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));

app.use(helmet());

app.use(express.json());

app.use(morgan('dev'));

app.post('/login', (req, res, next) => {
    res.json({ token: '123456' });
});

var key = fs.readFileSync('./selfsigned.key');
var cert = fs.readFileSync('./selfsigned.crt');
var options = {
  key: key,
  cert: cert
};


var server = https.createServer(options, app);

module.exports = server;