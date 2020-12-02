const express = require('express');
const Token = require('../src/models/token');
const router = express.Router();
const bcrypt = require("bcryptjs");
const ObjectId = require('mongodb').ObjectId;
const {
  OAuth2Client
} = require('google-auth-library');
const Patient = require('../src/models/patient');
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const {
  connectMongo,
  updateMongo,
  postMongo,
  deleteMongo
} = require('./../src/controllers/db.controller');
const PatientController = require('../src/controllers/patient.controller');

function getHashedPassword(pass) {
  return bcrypt.hashSync(pass, 12)
}


/** 
 * @swagger 
 * /api: 
 *     get: 
 *         summary: See if api works
 *         description: API Documentation working 
 *         responses: 
 *             200: 
 *                 description: success call to the endpoint 
 */

router.get('/', (req, res) => {
  res.send('api works');
});

//////////////////////DENTISTS//////////////////////

router.get('/dentists', function (req, res) {

  connectMongo("Dentist").then(function (collection) {
    collection.find(function (results) {
      res.send(results);
    })
  }).catch(function (err) {
    res.status(400).send(`ERROR: ${err}`);
  });
  /**
   * @swagger 
   * /api/dentists: 
   *   get: 
   *     summary: Get all dentists from database
   *     responses: 
   *       200: 
   *         description: Worked! All dentists shown
   *       400:
   *         description: Couldn't bring all dentists
   */
});

router.get('/dentist', function (req, res) {
  connectMongo("Dentist", JSON.parse(req.query.filter)).then(function (collection) {
    collection.find(function (results) {
      res.send(results);
    })
  }).catch(function (err) {
    res.status(400).send(`ERROR: ${err}`);
  });
  /**
   * @swagger 
   * /api/dentist: 
   *   get: 
   *     summary: Get specific dentist with filter
   *     parameters:
   *       - in: query
   *         name: filter
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *     responses: 
   *       200: 
   *         description: Dentist found!
   *       400:
   *         description: Dentist not found
   */
});

router.get('/dentistId', function (req, res) {
  var o_id = new ObjectId(JSON.parse(req.query.filter))
  connectMongo("Dentist", { _id: o_id }).then(function (collection) {
    collection.find(function (results) {
      res.send(results);
    })
  }).catch(function (err) {
    res.status(400).send(`ERROR: ${err}`);
  });
  /**
   * @swagger 
   * /api/dentistId: 
   *   get: 
   *     summary: Get specific dentist with ID
   *     parameters:
   *       - in: query
   *         name: filter
   *         content:
   *           application/json:
   *             schema:
   *               type: string
   *         example: "5fc7117881973b0017a0487a"
   *     responses: 
   *       200: 
   *         description: Dentist found!
   *       400:
   *         description: Dentist not found
   */
});

router.patch('/dentist', function (req, res) {
  updateMongo("Dentist", req.body.filter, req.body.data, req.body.many).then(function (collection) {
    collection.update(function (results) {
      res.send(results);
    })
  }).catch(function (err) {
    res.status(400).send(`ERROR: ${err}`);
  });

  /**
   * @swagger 
   * /api/dentist: 
   *   patch: 
   *     summary: Update one or many "Dentist" documents
   *     requestBody:
   *       description: filter, data, [many]. If not filter, then filter={}
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               filter:
   *                 type: string
   *               data:
   *                 type: object
   *               many:
   *                 type: boolean
   *           example: {"filter":{"Name":"Michel"},"data":{"$set":{"Name":"Michelangelo"}}}
   *     responses: 
   *       200: 
   *         description: Documents updated
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 matchedCount:
   *                   type: number
   *                 modifiedCount:
   *                   type: number
   *       400:
   *         description: Update error
   *         content:
   *           text/plain:
   *             schema:
   *               type: string
   *               example: Error [*err*]
   */
});

router.post('/dentist', function (req, res) {
  console.log("EndPoints:", req.body.data)
  postMongo("Dentist", req.body.data).then(function (collection) {
    collection.post(function (results) {
      res.send(results);
    })
  }).catch(function (err) {
    res.status(400).send(`ERROR: ${err}`);
  });

  /**
   * @swagger
   * /api/dentist: 
   *   post: 
   *     summary: Create a dentist on database
   *     requestBody:
   *       description: data
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               data:
   *                 type: object
   *           example: {"data": {"Name":"Miguel","Last_name":"Mendez","Phone_number":"3324934501","Email":"miguel.r.m@mail.com","RFC":"123456","Schedule":{"Monday":["10-15"],"Tuesday":["8-16"],"Wednesday":["11-17"],"Thursday":["12-18"],"Friday":["8-16"],"Saturday":["10-15"],"Sunday":["8-13"]}}}
   *     responses: 
   *       200: 
   *         description: Dentist posted
   *       400:
   *         description: Post error
   *         content:
   *           text/plain:
   *             schema:
   *               type: string
   *               example: Error [*err*]
   */

});

router.delete('/dentist', function (req, res) {
  deleteMongo("Dentist", req.body.filter).then(function (collection) {
    collection.delete(function (results) {
      res.send(results);
    })
  }).catch(function (err) {
    res.status(400).send(`ERROR: ${err}`);
  });
  /**
   * @swagger 
   * /api/dentist: 
   *   delete: 
   *     summary: Delete dentist from database
   *     requestBody:
   *       description: filter, has to be the main ID of the object
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               filter:
   *                 type: object
   *           example: {"filter": {"Name":"Michel"}}
   *     responses: 
   *       200: 
   *         description: Document deleted 
   *       400:
   *         description: Delete error
   *         content:
   *           text/plain:
   *             schema:
   *               type: string
   *               example: Error [*err*]
   */
});

//////////////////////PATIENTS//////////////////////

router.get('/patients', function (req, res) {
  connectMongo("Patient").then(function (collection) {
    collection.find(function (results) {
      res.send(results);
    })
  }).catch(function (err) {
    res.status(400).send(`ERROR: ${err}`);
  });
  /**
   * @swagger 
   * /api/patients: 
   *   get: 
   *     summary: Get all patients from database
   *     responses: 
   *       200: 
   *         description: Worked! All patients shown
   *       400:
   *         description: Couldn't bring all patients
   */
});

router.get('/patient', function (req, res) {
  connectMongo("Patient", JSON.parse(req.query.filter)).then(function (collection) {
    collection.find(function (results) {
      res.send(results);
    })
  }).catch(function (err) {
    res.status(400).send(`ERROR: ${err}`);
  });
  /**
   * @swagger 
   * /api/patient: 
   *   get: 
   *     summary: Get specific patient with filter
   *     parameters:
   *       - in: query
   *         name: filter
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *     responses: 
   *       200: 
   *         description: Patient found!
   *       400:
   *         description: Patient not found
   */
});

router.get('/patientId', function (req, res) {
  var o_id = new ObjectId(JSON.parse(req.query.filter))
  connectMongo("Patient", { _id: o_id }).then(function (collection) {
    collection.find(function (results) {
      res.send(results);
    })
  }).catch(function (err) {
    res.status(400).send(`ERROR: ${err}`);
  });
  /**
   * @swagger 
   * /api/patientId: 
   *   get: 
   *     summary: Get specific patient with patient ID
   *     parameters:
   *       - in: query
   *         name: filter
   *         content:
   *           application/json:
   *             schema:
   *               type: string
   *         example: "5fc003aa3aa92633c0d16f23"
   *     responses: 
   *       200: 
   *         description: Patient found!
   *       400:
   *         description: Patient not found
   */
});

router.patch('/patient', function (req, res) {
  if (req.body.Password) {
    req.body.Password = getHashedPassword(req.body.Password);
  }
  updateMongo("Patient", req.body.filter, req.body.data, req.body.many).then(function (collection) {
    collection.update(function (results) {
      res.send(results);
    })
  }).catch(function (err) {
    res.status(400).send(`ERROR: ${err}`);
  });
  /**
   * @swagger 
   * /api/patient: 
   *   patch: 
   *     summary: Update one or many "Patient" documents
   *     requestBody:
   *       description: filter, data, [many]. If not filter, then filter={}
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               filter:
   *                 type: object
   *               data:
   *                 type: object
   *               many:
   *                 type: boolean
   *           example: {"filter":{"Name":"Michel"},"data":{"$set":{"Name":"Michelangelo"}}}
   *     responses: 
   *       200: 
   *         description: Documents updated
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 matchedCount:
   *                   type: number
   *                 modifiedCount:
   *                   type: number
   *       400:
   *         description: Update error
   *         content:
   *           text/plain:
   *             schema:
   *               type: string
   *               example: Error [*err*]
   */
});

router.post('/patient', function (req, res) {
  postMongo("Patient", req.body.data).then(function (collection) {
    collection.post(function (results) {
      res.send(results);
    })
  }).catch(function (err) {
    res.status(400).send(`ERROR: ${err}`);
  });

  /**
   * @swagger 
   * /api/patient: 
   *   post: 
   *     summary: Create one "Patient" document
   *     requestBody:
   *       description: data
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               data:
   *                 type: object
   *           example: {"data":{"Patient_ID":1,"Name":"Antonio","Last_name":"Banderas","Phone_number":"3322764501","Email":"antonio.b@mail.com","Birth_date":{"date":660636000000},"RFC":"654321"}}
   *     responses: 
   *       200: 
   *         description: Documents posted
   *       400:
   *         description: Update error
   *         content:
   *           text/plain:
   *             schema:
   *               type: string
   *               example: Error [*err*]
   */

});

router.delete('/patient', function (req, res) {
  deleteMongo("Patient", req.body.filter).then(function (collection) {
    collection.delete(function (results) {
      res.send(results);
    })
  }).catch(function (err) {
    res.status(400).send(`ERROR: ${err}`);
  });
  /**
   * @swagger 
   * /api/patient: 
   *   delete: 
   *     summary: Delete one "Patient" document
   *     requestBody:
   *       description: filter, has to be the main ID of the object
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               filter:
   *                 type: object
   *           example: {"filter": {"Patient_ID":1}}
   *     responses: 
   *       200: 
   *         description: Document deleted 
   *       400:
   *         description: Delete error
   *         content:
   *           text/plain:
   *             schema:
   *               type: string
   *               example: Error [*err*]
   */
});

//////////////////////APPOINTMENTS//////////////////////

router.get('/appointments', function (req, res) {

  connectMongo("Appointment").then(function (collection) {
    collection.find(function (results) {
      res.send(results);
    })
  }).catch(function (err) {
    res.status(400).send(`ERROR: ${err}`);
  });
  /**
   * @swagger 
   * /api/appointments: 
   *   get: 
   *     summary: Get all appointments from database
   *     responses: 
   *       200: 
   *         description: Worked! All appointments shown
   *       400:
   *         description: Couldn't bring all appointments
   */
});

router.get('/appointment', function (req, res) {
  connectMongo("Appointment", JSON.parse(req.query.filter)).then(function (collection) {
    collection.find(function (results) {
      res.send(results);
    })
  }).catch(function (err) {
    res.status(400).send(`ERROR: ${err}`);
  });
  /**
   * @swagger 
   * /api/appointment: 
   *   get: 
   *     summary: Get specific appointment with filter
   *     parameters:
   *       - in: query
   *         name: filter
   *         content:
   *           application/json:
   *             schema:
   *               type: object 
   *     responses: 
   *       200: 
   *         description: Appointment found!
   *       400:
   *         description: Appointment not found
   */
});

router.patch('/appointment', function (req, res) {
  var o_id = new ObjectId(req.body.filter)
  updateMongo("Appointment", { _id: o_id }, req.body.data, req.body.many).then(function (collection) {
    collection.update(function (results) {
      res.send(results);
    })
  }).catch(function (err) {
    res.status(400).send(`ERROR: ${err}`);
  });
  /**
   * @swagger 
   * /api/appointment: 
   *   patch: 
   *     summary: Update one or many "Appointment" documents
   *     requestBody:
   *       description: filter, data, [many]. If not filter, then filter={}
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               filter:
   *                 type: object
   *               data:
   *                 type: object
   *               many:
   *                 type: boolean
   *           example: {"filter":5fc71caf81973b0017a0487f,"data":{"$set":{"Cause":"Swagger updates with patch"}}}
   *     responses: 
   *       200: 
   *         description: Documents updated
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 matchedCount:
   *                   type: number
   *                 modifiedCount:
   *                   type: number
   *       400:
   *         description: Update error
   *         content:
   *           text/plain:
   *             schema:
   *               type: string
   *               example: Error [*err*]
   */
});

router.post('/appointment', function (req, res) {

  postMongo("Appointment", req.body.data).then(function (collection) {
    collection.post(function (results) {
      res.send(results);
    })
  }).catch(function (err) {
    res.status(400).send(`ERROR: ${err}`);
  });

  /**
   * @swagger 
   * /api/appointment: 
   *   post: 
   *     summary: Create one "Appointment" document
   *     requestBody:
   *       description: data
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               data:
   *                 type: object
   *           example: {"data":{"Appointment_ID":1,"Dentist_ID":100,"Patient_ID":1,"Cause":"Dolor de muelas","Description":"Llega usuario con cara inflamada","images":[""],"Date":{"date":1603865460000}}}
   *     responses: 
   *       200: 
   *         description: Documents posted
   *       400:
   *         description: Update error
   *         content:
   *           text/plain:
   *             schema:
   *               type: string
   *               example: Error [*err*]
   */

});

router.delete('/appointment', function (req, res) {
  console.log(req.query.filter)
  var o_id = new ObjectId(JSON.parse(req.query.filter))
  deleteMongo("Appointment", {_id:o_id}).then(function (collection) {
    collection.delete(function (results) {
      res.send(results);
    })
  }).catch(function (err) {
    res.status(400).send(`ERROR: ${err}`);
  });
  /**
   * @swagger 
   * /api/appointment: 
   *   delete: 
   *     summary: Delete one "Appointment" document
   *     requestBody:
   *       description: filter, has to be the main ID of the object
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               filter:
   *                 type: object
   *           example: {"filter": {"Appointment_ID":1}}
   *     responses: 
   *       200: 
   *         description: Document deleted 
   *       400:
   *         description: Delete error
   *         content:
   *           text/plain:
   *             schema:
   *               type: string
   *               example: Error [*err*]
   */
});

//////////////////////LOGINS//////////////////////
router.post('/auth/google', function (req, res) {
  googleClient.verifyIdToken({
    idToken: req.body.idToken
  }).then(googleResponse => {
    const responseData = googleResponse.getPayload();
    const email = responseData.email;
    console.log('------------------------------------');
    console.log(email);
    console.log('------------------------------------');
    Patient.findOne({
      Email: email
    }).then(response => {
      if (response) {
        console.log('Found user: ', response);
        if (!response.googleId) {
          console.log('Does not have google ID');
          Patient.updateOne({
            email: email
          }, {
            $set: {
              googleId: req.body.id
            }
          }).then(() => {
            // PatientController.createToken(response._id, res);

            tokenStuff = Token.create(response._id, 0)
            tokenStuff[0].then(tokenResult => {
              // console.log('Created token: ', tokenResult);
              res.send(tokenStuff[1]);

            }).catch(err => {
              console.log('Failed to create token', err);
            });

          }).catch(err => {
            console.log('Failed to update user', err);
          });
        } else {
          console.log('Already has google ID');
          // PatientController.createToken(response._id, res);
          tokenStuff = Token.create(response._id, 0)
          tokenStuff[0].then(tokenResult => {
            // console.log('Created token: ', tokenResult);
            res.send(tokenStuff[1]);

          }).catch(err => {
            console.log('Failed to create token', err);
          });
        }
      } else {
        // Crear
        console.log('------------------------------------');
        console.log("Correo no encontrado");
        console.log('------------------------------------');
        Patient.create({
          Name: req.body.firstName,
          Email: email,
          googleId: req.body.id,
          Last_name: req.body.lastName
        }, {
          timestamps: false
        }).then(response => {
          // PatientController.createToken(response.insertedId, res);
          Patient.findOne({
            Email: email
          }).then(response => {
            console.log('----------------USR CREADO----------------');
            console.log(response);
            console.log('------------------------------------');
            tokenStuff = Token.create(response._id, 0)
            tokenStuff[0].then(tokenResult => {
              res.send(tokenStuff[1]);
            }).catch(err => {
              console.log('Failed to create token', err);
            });
          }).catch(err => {
            res.status(400).send();
          })
        });
      }
    }).catch(err => {
      res.status(400).send();
    });
  }).catch(err => {
    res.status(400).send();
  })
  /**
   * @swagger 
   * /api/auth/google: 
   *   post: 
   *     summary: Authentication with google account
   *     responses: 
   *       200: 
   *         description: Authenticated with Goolo Goolo!
   *       400:
   *         description: Not authenticated with Goolo Goolo
   */
});

router.post('/auth', function (req, res) {
  //Buscar al paciente
  console.log('----------------INTRO------------------');
  console.log(req.body.data);
  console.log('------------------------------------');
  let obj = {
    Email: req.body.data.Email
  }
  console.log('----------------OBJ--------------------');
  console.log(obj);
  console.log('------------------------------------');
  connectMongo("Patient", obj).then(function (collection) {
    collection.find(function (results) {
      //results tiene los datos del usuario
      console.log('-----------------RES----------------');
      console.log(results);
      console.log('------------------------------------');
      console.log('----------------COMPARE----------------');
      console.log(bcrypt.compareSync(req.body.data.Password, results[0].Password));
      console.log('------------------------------------');
      if (bcrypt.compareSync(req.body.data.Password, results[0].Password)) {
        //La contraseña coincide
        tokenStuff = Token.create(results[0]._id, 0)
        tokenStuff[0].then(tokenResult => {
          // console.log('Created token: ', tokenResult);
          res.send(tokenStuff[1]);

        }).catch(err => {
          console.log('Failed to create token', err);
        });
      } else {
        //Contraseña incorrecta
        res.status(401).send(`Contraseña incorrecta`);
      }



    })
  }).catch(function (err) {
    res.status(400).send(`ERROR: ${err}`);
  });
  /**
   * @swagger 
   * /api/auth: 
   *   post: 
   *     summary: Authentication with regular patient account
   *     responses: 
   *       200: 
   *         description: Patient authenticated!
   *       400:
   *         description: Patient not authenticated
   */
});


router.post('/dentistAuth', function (req, res) {
  //Buscar al paciente
  console.log('----------------INTRO_Dentist------------------');
  console.log(req.body.data);
  console.log('------------------------------------');
  let obj = {
    Email: req.body.data.Email
  }
  console.log('----------------OBJ--------------------');
  console.log(obj);
  console.log('------------------------------------');
  connectMongo("Dentist", obj).then(function (collection) {
    collection.find(function (results) {
      //results tiene los datos del usuario
      console.log('-----------------RES----------------');
      console.log(results);
      console.log('------------------------------------');
      console.log('----------------COMPARE----------------');
      console.log(bcrypt.compareSync(req.body.data.Password, results[0].Password));
      console.log('------------------------------------');
      if (bcrypt.compareSync(req.body.data.Password, results[0].Password)) {
        //La contraseña coincide
        tokenStuff = Token.create(results[0]._id, 1)
        tokenStuff[0].then(tokenResult => {
          // console.log('Created token: ', tokenResult);
          res.send(tokenStuff[1]);

        }).catch(err => {
          console.log('Failed to create token', err);
        });
      } else {
        //Contraseña incorrecta
        res.status(401).send(`Contraseña incorrecta`);
      }
    })
  }).catch(function (err) {
    res.status(400).send(`ERROR: ${err}`);
  });
  /**
   * @swagger 
   * /api/dentistAuth: 
   *   post: 
   *     summary: Authentication with regular dentist account
   *     responses: 
   *       200: 
   *         description: Dentist authenticated!
   *       400:
   *         description: Dentist not authenticated
   */
});


router.post('/signup', function (req, res) {
  const hashedPassword = getHashedPassword(req.body.data.Password);
  const obj = {
    Name: req.body.data.Name,
    Last_name: req.body.data.Last_name,
    Phone_number: req.body.data.Phone_number,
    Email: req.body.data.Email,
    Birth_date: req.body.data.Birth_date,
    RFC: req.body.data.RFC,
    Password: hashedPassword
  }
  postMongo("Patient", obj).then(function (collection) {
    collection.post(function (results) {
      res.send(results);
    })
  }).catch(function (err) {
    res.status(400).send(`ERROR: ${err}`);
  });
  /**
   * @swagger 
   * /api/signup: 
   *   post: 
   *     summary: Sign up with regular patient account
   *     responses: 
   *       200: 
   *         description: Patient registered!
   *       400:
   *         description: Patient not registered
   */
});


router.post('/dentistSignup', function (req, res) {
  const hashedPassword = getHashedPassword(req.body.data.Password);
  const obj = {
    Name: req.body.data.Name,
    Last_name: req.body.data.Last_name,
    Phone_number: req.body.data.Phone_number,
    Email: req.body.data.Email,
    Birth_date: req.body.data.Birth_date,
    RFC: req.body.data.RFC,
    Password: hashedPassword,
    Specialty: req.body.data.Specialty,
    Social_media: req.body.data.Social_media,
    Description: req.body.data.Description,
    Image: req.body.data.Image,
    Schedule: req.body.data.Schedule
  }
  postMongo("Dentist", obj).then(function (collection) {
    collection.post(function (results) {
      res.send(results);
    })
  }).catch(function (err) {
    res.status(400).send(`ERROR: ${err}`);
  });
  /**
   * @swagger 
   * /api/dentistSignup: 
   *   post: 
   *     summary: Sign up with regular dentist account
   *     responses: 
   *       200: 
   *         description: Dentist registered!
   *       400:
   *         description: Dentist not registered
   */
});

router.get('/token', function (req, res) {
  connectMongo("Token", { token: req.query.filter }).then(function (collection) {
    collection.find(function (results) {
      res.send(results);
    })
  }).catch(function (err) {
    res.status(400).send(`ERROR: ${err}`);
  });
  /**
   * @swagger 
   * /api/token: 
   *   get: 
   *     summary: Get token for user logged in
   *     parameters:
   *       - in: query
   *         name: filter
   *         content:
   *           application/json:
   *             schema:
   *               type: string
   *         example: cd88946955464ff040021c7f79b91d0f4ff19e243392d8558f3a493758db350384f8868d7eb0de863ddd645c2ca2d697 
   *     responses: 
   *       200: 
   *         description: Token found!
   *       400:
   *         description: Token not found
   */
});

module.exports = router;