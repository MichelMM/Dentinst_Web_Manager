const express = require('express')
const app = express();
require('dotenv').config()
const port = process.env.PORT || 3000;

const r_api = require('./routes/api');

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

app.use('/api', jsonParser, r_api);

app.listen(port, () => {
    console.log('app is running in port ' + port);
});