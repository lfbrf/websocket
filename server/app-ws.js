const WebSocket = require('ws');
const crypto = require('crypto');
const fs = require('fs');
const appWs = require('./app-ws');
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);
const CryptoJS = require("crypto-js");
const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
    modulusLength: 2048,
});
console.log(publicKey);
function onError(ws, err) {
    console.error(`onError: ${err.message}`);
}

function onMessage(ws, data) {
    ws.send(`send!`);
}

function onConnection(ws, req) {
    if(decryptString(req.url.substring(2)) != process.env.SECRET_KEY){
        ws.close();
    }
    ws.on('message', data => onMessage(ws, data));
    ws.on('error', error => onError(ws, error));
    ws.send(`senderwer34253454534t!`);
}

function decryptString(data) {
    if (!data) return null
      try {
        return CryptoJS.AES.decrypt(data, CryptoJS.enc.Utf8.parse(process.env.SECRET_KEY), {
          mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
              }).toString(CryptoJS.enc.Utf8)
      } catch {
          return null
      }
}

function broadcast(jsonObject) {
    if (!this.clients) return;
    this.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            console.log(jsonObject.content);
            jsonObject.content = "hello to you too";
            client.send(JSON.stringify(jsonObject));
        }
    });
}


module.exports = (server) => { 
    const wss = new WebSocket.Server({
        server
    });
    wss.on('connection', onConnection);
    wss.broadcast = broadcast;
    return wss;
}
