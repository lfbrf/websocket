const WebSocket = require('ws');
const { encrypt } = require('cryptico');
const crpto = require('./../utils/crypto');
function onError(ws, err) {
    console.error(`onError: ${err.message}`);
}

function onMessage(ws, data) { 
    const dataParsed = JSON.parse(data);
    sendMessageForKeyDefinedAndHelloUndefined(ws, dataParsed);
    sendMessageForKeyAndHelloDefined(ws, dataParsed);
}

function sendMessageForKeyDefinedAndHelloUndefined(ws, dataParsed){
    if(keyisDefinedAndHelloUndefined(dataParsed)){
        const privateKeyDecrypted = crpto.decryptPrivate(dataParsed.key);
        closeSocketIfInvalidPrivateKey(ws, dataParsed.key);
        sendMessageWithEncryptPrivateKey(ws, dataParsed, privateKeyDecrypted);
    }    
}

function sendMessageForKeyAndHelloDefined(ws, dataParsed){
    if(keyAndHelloArDfefined(dataParsed)){
        closeSocketIfInvalidHellos(ws, dataParsed);
        sendMessageHelloTyouTWithAes(ws, dataParsed);
    }    
}

function keyAndHelloArDfefined(dataParsed){
    return dataParsed.key && dataParsed.hello;
}

function closeSocketIfInvalidHellos(ws, dataParsed){
    hello = crpto.decryptAes(dataParsed.hello, dataParsed.aes);
    if(hello != 'hello'){
        ws.close();
    }     
}

function sendMessageHelloTyouTWithAes(ws, dataParsed){
    const helloTyT = crpto.encryptAes('hello to you too', dataParsed.aes);
    dataParsed.helloTyT = helloTyT;
    ws.send(JSON.stringify(dataParsed));
    logMessageHello(helloTyT, dataParsed); 
}

function logMessageHello(helloTyT, dataParsed){
    console.log('hello you too encrypted with AES Key: ', helloTyT + '\n');
    console.log('######################### Final Result #######################################');
    console.log(dataParsed);   
}

function sendMessageWithEncryptPrivateKey(ws, dataParsed, privateKeyDecrypted){
    const aes = crpto.encryptAes(privateKeyDecrypted, process.env.SECRET_KEY);
    dataParsed.aes = aes;
    ws.send(JSON.stringify(dataParsed));
    logMessagePrivateKey(privateKeyDecrypted, aes);
}

function logMessagePrivateKey(privateKeyDecrypted, aes){
    console.log('AES Key encrypted with private key', privateKeyDecrypted + '\n');
    console.log('Websocket Password Encrypted with public key: ', aes + '\n');  
}

function closeSocketIfInvalidPrivateKey(ws, key){
    privateKeyDecrypted = crpto.decryptPrivate(key);
    if(privateKeyDecrypted != process.env.SECRET_KEY){
        ws.close();
    } 
}

function keyisDefinedAndHelloUndefined(dataParsed){
  return dataParsed.key && !dataParsed.hello;
}

function onConnection(ws, req) {
  ws.on('message', data => onMessage(ws, data));
  ws.on('error', error => onError(ws, error));
}

module.exports = (server) => { 
const wss = new WebSocket.Server({
    server,
    privateKey: process.env.SECRET_KEY,
    publicKey: encrypt(process.env.SECRET_KEY),
});
wss.on('connection', onConnection);
return wss;
}
