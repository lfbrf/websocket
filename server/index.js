const express = require('express');
const http = require('http');
const fs = require('fs');
const port = 3000;
const appWs = require('./app-ws');
const crypto = require('crypto');

server = express()
server.get('/', async (req, res) => {
  var encrypt = encryptString(process.env.SECRET_KEY);
  const aes = await sendPost(encrypt);
  console.log('aes.aesKey');
  res.redirect('http://localhost:3050?aesKey=' + aes.aesKey);
});

async function sendPost(param){
  const axios = require('axios');
  const response = await axios.post('http://localhost:3050', { key: param });
  return response.data;
}

function encryptString (plaintext) {
  const encryptedData = crypto.publicEncrypt(
    {
      key: fs.readFileSync( process.cwd() + '/files/public_key').toString(),
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: "sha256",
    },
    Buffer.from(plaintext)
  );
  return encryptedData.toString("base64");
}


var server = http.createServer( server);

var sv = server.listen(port, () => {
  console.log("server starting on port : " + port)
});

const wss = appWs(sv);
