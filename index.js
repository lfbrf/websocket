const express = require('express');
const https = require('https');
const fs = require('fs');
const port = 3000;
const appWs = require('./app-ws');
const crypto = require('crypto');
const iv = crypto.randomBytes(16);

var keyCode = fs.readFileSync('./selfsigned.key', 'utf-8');
var certCode = fs.readFileSync('./selfsigned.crt', 'utf-8');
var options = {
  key: keyCode,
  cert: certCode
};

app = express()
app.get('/', (req, res) => {
   res.send('Hello');
});

var server = https.createServer(options, app);

var sv = server.listen(port, () => {
  console.log("server starting on port : " + port)
});

const wss = appWs(sv);

setInterval(() => {
    wss.broadcast({content: "hello", currentCrypt: encrypt(keyCode) });
}, 5000);


const encrypt = (text) => {
    const cipher = crypto.createCipheriv('aes-256-ctr', process.env.SECRET_KEY, iv);
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
    return {
        iv: iv.toString('hex'),
        content: encrypted.toString('hex')
    };
};