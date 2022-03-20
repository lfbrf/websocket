const express = require('express')
const app = express()
const port = 3050
const fs = require('fs');
const crypto = require('crypto');
const iv = crypto.randomBytes(16);
const CryptoJS = require("crypto-js");
app.use(express.json());       
app.use(express.urlencoded()); 

const authenticatedUser = [];
app.get('/', async (req, res) => {
  console.log('ENCRYPT');
  console.log(req.body);
  res.sendFile(process.cwd() + '/client/index.html');
});

app.post('/', function (req, res) {
  var decripted = decryptString(req.body.key);
  if(decripted == process.env.SECRET_KEY)
    authenticatedUser.push(req.body.key);
  const aesKey = encrypt(decripted);
  res.json({aesKey});
});

function encrypt(data) {
  if (!data) return null
    try {
      return CryptoJS.AES.encrypt(process.env.SECRET_KEY, CryptoJS.enc.Utf8.parse(process.env.SECRET_KEY), {
             mode: CryptoJS.mode.ECB,
              padding: CryptoJS.pad.Pkcs7
        }).toString();
    } catch {
         return null
    }
}

function decryptString(encryptedStr){
  const decryptedData = crypto.privateDecrypt(
    {
      key: fs.readFileSync( process.cwd() + '/files/private_key').toString(),
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: "sha256",
    },
    Buffer.from(encryptedStr, "base64")
  );
  return decryptedData.toString();
}


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
  
});

function decryptString (encryptedStr) {
  const decryptedData = crypto.privateDecrypt(
    {
      key: fs.readFileSync( process.cwd() + '/files/private_key').toString(),
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: "sha256",
    },
    Buffer.from(encryptedStr, "base64")
  );
  return decryptedData.toString();
}
