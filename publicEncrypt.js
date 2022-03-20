const crypto = require('crypto');
const fs = require("fs");
const iv = crypto.randomBytes(16);

function generateKeyFiles() {
   const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
      modulusLength: 2048,
    });
    fs.writeFileSync(process.cwd() + "/files/public_key", publicKey.export({ format: 'pem', type: 'spki' }));

    fs.writeFileSync(process.cwd() + "/files/private_key", privateKey.export({ format: 'pem', type: 'pkcs8' }));
}
generateKeyFiles();