//app
require('dotenv').config();
const express = require('express');
const path = require('path');
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
//Handlebars
const handlebars = require('express-handlebars');
//Port
const port = process.env.PORT || 3000;

app.use('/public', express.static(path.join(__dirname, 'public')));

app.engine('handlebars',handlebars());
app.set('view engine','handlebars');
app.set('views','src/views');

app.get('/',function(req,res){
    res.render('index',{});
});

app.use('/api', jsonParser, r_api);

app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.listen(port, () => {
    console.log('app is running in port ' + port);
});



