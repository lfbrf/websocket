const CryptoJS = require("crypto-js");
const crypto = require('crypto');
const fs = require('fs');
function encryptAes(data, key){
    try {
      return CryptoJS.AES.encrypt(data, CryptoJS.enc.Utf8.parse(key), {
             mode: CryptoJS.mode.ECB,
              padding: CryptoJS.pad.Pkcs7
        }).toString();
    } catch {
         return null
    }
}

function decryptAes(data, key) {
    if (!data) return null
      try {
        return CryptoJS.AES.decrypt(data, CryptoJS.enc.Utf8.parse(key), {
          mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
              }).toString(CryptoJS.enc.Utf8)
      } catch {
          return null
      }
}

function decryptPrivate(encryptedStr){
    try{
        const decryptedData = crypto.privateDecrypt(
            {
            key: fs.readFileSync( process.cwd() + '/files/private_key').toString(),
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: "sha256",
            },
            Buffer.from(encryptedStr, "base64")
        );
        return decryptedData.toString();
    }catch(e){
        return "";
    }
}

function encryptPublic(){
    const encryptedData = crypto.publicEncrypt(
      {
        key: fs.readFileSync( process.cwd() + '/files/public_key').toString(),
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: "sha256",
      },
      Buffer.from(process.env.SECRET_KEY)
    );
    return encryptedData.toString("base64");
  }

module.exports = {
    encryptAes,
    decryptAes,
    decryptPrivate,
    encryptPublic
 }