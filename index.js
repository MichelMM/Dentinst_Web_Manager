//app
require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();
//Routes
const r_api = require('./routes/api');
//Http
const axios = require("axios")
const encodeUrl = require("encodeurl")
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
//CORS
const cors = require('cors');
//Mongodb
const connectMongo = require('./src/controllers/db.controller');
//Port
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(path.join(__dirname, 'public')));

app.engine('handlebars', handlebars());
app.set('view engine', 'handlebars');
app.set('views', 'src/views');

app.get('/', function (req, res) {

  connectMongo('Dentist').then(function (collection) {
    collection.find(function (results) {
      res.render('index', { results: "correct" });
    })
  }).catch(function (err) {
    res.render('index', { results: "failure" });
  });
});
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use('/api', jsonParser, r_api);

app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.get("/whats", jsonParser, (req, res) => {
  //Endpoint de prueba para notificaciones
  msg = "Tu cita será pronto"
  apiKey = process.env.WHATS_KEY
  phone = process.env.WHATS_PHONE
  
  //Esta setInterval debería de estar fuera del endpoint(ejecutarse desde el inicio)
  setInterval(function(){
    console.log('------------------------------------');
    console.log("Revisando citas");
    // foreach de cada cita que tienen menos de un minuto de haber "expirado" sus 24hrs previas
    // sendWhats(msg,phone,apiKey)
    console.log('------------------------------------');
  }, 60000);

  res.send("todo ok")
})

const server = app.listen(port, () => {
  console.log('app is running in port ' + port);
});


/////////Whats realm/////////////////////////////////////
function sendWhats(msg, phone, apiKey) {
  msg_encoded = encodeUrl(msg)
  // axios.post(`https://http-api.d7networks.com/send?username=${process.env.SMS_USR}&password=${process.env.SMS_PASS}&dlr-method=POST&dlr-url=https://4ba60af1.ngrok.io/receive&dlr=yes&dlr-level=3&from=smsinfo&content=Tenia 0.13 dolares &to=${process.env.SMS_PHONE}`).then(response => {
  axios.get(`https://api.callmebot.com/whatsapp.php?phone=${phone}&text=${msg_encoded}&apikey=${apiKey}`).then(response => {
    console.log('----------------Whats---------------');
    console.log(`${response.status}: ${response.data}`);
    console.log('------------------------------------');
  }).catch(err => {
    console.log('----------------Whats---------------');
    console.log(err);
    console.log('------------------------------------');
  })
}


/////////Socket realm/////////////////////////////////////
const socketIo = require('socket.io');

const Io = socketIo(server, {
  cors: {
    origin: process.env.SOCKET_ORIGIN,
    methods: ['GET', 'POST'],
    allowedHeaders: [],
    credentials: true
  }
});

Io.on('connection', socket => {
  console.log('New user connected to website!');

  socket.on('disconnect', () => {
    console.log('User disconnected from website :(');
  });

  socket.on('appointmentDone', data => {
    console.log('User made an appointment, check:', data);
  });

});