console.log('------------------------------------');
console.log("Iniciando");
console.log('------------------------------------');
//app
if (!process.env.NODE_PROD) {//Preguntar si estamos en produccion
  require('dotenv').config();
}
const express = require('express');
const path = require('path');
const app = express();
//Routes
const r_api = require('./routes/api');
//Http
const axios = require("axios")
const encodeUrl = require("encodeurl")
//Images
const multer = require("multer")
const AWS = require("aws-sdk")
const multerS3 = require("multer-s3")
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
const ObjectId = require('mongodb').ObjectId;
const {
  connectMongo,
  updateMongo,
  postMongo,
  deleteMongo
} = require('./src/controllers/db.controller');
//Port
console.log('------------------------------------');
console.log("Cargando puerto");
console.log('------------------------------------');
const port = process.env.PORT || 3000;
console.log('------------------------------------');
console.log("Cors");
console.log('------------------------------------');
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
  setInterval(function () {
    console.log('------------------------------------');
    console.log("Revisando citas");
    // foreach de cada cita que tienen menos de un minuto de haber "expirado" sus 24hrs previas
    // sendWhats(msg,phone,apiKey)
    console.log('------------------------------------');
  }, 60000);

  res.send("todo ok")
})

/////////Images S3 realm/////////////////////////////////////
let s3bucket = new AWS.S3({
  accessKeyId: process.env.IAM_USER_KEY,
  secretAccessKey: process.env.IAM_USER_SECRET,
  Bucket: process.env.BUCKET_NAME
})
const multerStorage = multerS3({
  s3: s3bucket,
  bucket: process.env.BUCKET_NAME,
  acl: "public-read",
  key: function (req, file, cb) {
    const ext = file.originalname.split(".").pop()
    cb(null, `dentistProfile/${file.fieldname}-${Date.now()}.${ext}`)
  }
})

const upload = multer({
  storage: multerStorage, fileFilter: function (req, file, cb) {
    cb(null, file.mimetype.startsWith("image"))
  }
})


app.post("/image", upload.single("image"), (req, res) => {
  res.send({ location: req.file.location })
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

function sendSMS(msg, phone) {
  msg_encoded = encodeUrl(msg)
  axios.post(`https://http-api.d7networks.com/send?username=${process.env.SMS_USR}&password=${process.env.SMS_PASS}&dlr-method=POST&dlr-url=https://4ba60af1.ngrok.io/receive&dlr=yes&dlr-level=3&from=smsinfo&content=${msg}&to=${phone}`).then(response => {
    console.log('----------------SMS-----------------');
    console.log(`${response.status}: ${response.data}`);
    console.log('------------------------------------');
  }).catch(err => {
    console.log('----------------SMS-----------------');
    console.log(err);
    console.log('------------------------------------');
  })
}

let date = ""
let whatsTimer = setInterval(whatsTimerFunc, 1*60*1000);//Debería de ser de un dia entero (poco menos)

function whatsTimerFunc() {
  console.log('------------------------------------');
  console.log("Entrando whatsTimerFunc");
  console.log('------------------------------------');

  date=""//SOLO PARA PRUEBAS Y DEMOSTRACIÓN, QUITAR EN OTRO CASO

  let now = new Date().toISOString().slice(0, 10);
  if (date !== now) {
    //No se han mandado los mensajes del día de hoy
    date = now
    let filter = { Date: date }
    connectMongo("Appointment", filter).then(function (collection) {
      collection.find(function (results) {
        results.forEach(cita => {
          var o_id = new ObjectId(cita.Patient_ID)
          connectMongo("Patient", { _id: o_id }).then(function (collection) {
            collection.find(function (paciente) {
              console.log('------------------------------------');
              console.log("mandar");
              console.log('------------------------------------');
              // sendWhats(`${paciente[0].Name}, te recordamos que tu cita con el dentista es el día de mañana`,paciente[0].Phone_number,process.env.WHATS_KEY)
              // sendSMS(`Hola, te recordamos que tu cita con el dentista es en un dia`,paciente[0].Phone_number)
            })
          }).catch(function (err) {
            console.log('------------------------------------');
            console.log(`ERROR: ${err}`);
            console.log('------------------------------------');
          });
        });
      })
    }).catch(function (err) {
      console.log('------------------------------------');
      console.log(`ERROR: ${err}`);
      console.log('------------------------------------');
    });
  } else {
    //Ya se mandaron los mensajes del día
    //Reiniciar el temporizador en 10 minutos
    console.log('------------------------------------');
    console.log("Reiniciando whatsTimer en 10 minutos");
    console.log('------------------------------------');
    clearInterval(whatsTimer);
    setTimeout(function () {whatsTimer = setInterval(whatsTimerFunc, 1*60*1000)}, 10*60*1000);
  }
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
    console.log(`User ${data.patientName} ${data.patientLastName} made a new appointment with dentist ID: ${data.dentistId}`);
    socket.broadcast.emit('NewAppointment', data);
  });

});