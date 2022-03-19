const WebSocket = require('ws');
const crypto = require('crypto');
const fs = require('fs');
const appWs = require('./app-ws');
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);
var keyCode = fs.readFileSync('./selfsigned.key', 'utf-8');

function onError(ws, err) {
    console.error(`onError: ${err.message}`);
}

function onMessage(ws, data) {
    console.log(`onMessage: ${data}`);
    ws.send(`send!`);
}

function onConnection(ws, req) {
    ws.on('message', data => onMessage(ws, data));
    ws.on('error', error => onError(ws, error));
}

function broadcast(jsonObject) {
    if (!this.clients) return;
    this.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN  && decrypt(jsonObject.currentCrypt) === keyCode) {
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


const decrypt = (hash) => {
    const decipher = crypto.createDecipheriv('aes-256-ctr', process.env.SECRET_KEY, Buffer.from(hash.iv, 'hex'));
    const decrpyted = Buffer.concat([decipher.update(Buffer.from(hash.content, 'hex')), decipher.final()]);
    return decrpyted.toString();
};