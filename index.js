//app
require('dotenv').config();
const express = require('express');
const app = express();
//Routs
const r_api = require('./routes/api');
//Body parser
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
//Swagger
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const swaggerOptions = require('./swagger.config');
const swaggerDocs = swaggerJsDoc(swaggerOptions);
//Port
const port = process.env.PORT || 3000;


app.use('/api', jsonParser, r_api);

app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.listen(port, () => {
    console.log('app is running in port ' + port);
});




