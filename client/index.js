const express = require('express');
const app = express();
const port = 3050;
const cors = require('cors');
const crpto = require('./../utils/crypto');
app.use(express.json()); 

app.use(cors()) 

app.get('/', async (req, res) => {
  console.log('Websocket Password Encrypted with public key: ');
  res.json(crpto.encryptPublic());
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
