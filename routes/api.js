const express = require('express');
const router = express.Router();
const {connectMongo,updateMongo} = require('./../src/controllers/db.controller');
/** 
* @swagger 
* /api: 
*     get: 
*         description: api works 
*         responses: 
*             200: 
*                 description: success call to the endpoint 
*/

router.get('/', (req, res) => {
    res.send('api works');
});

router.get('/dentists',function(req,res){
    
    connectMongo("Dentist").then(function(collection){
        collection.find(function(results){
            res.send(results);
        })
      }).catch(function(err){
        res.send(`ERROR: ${err}`).sendStatus(400);
      });
});

router.get('/dentist',function(req,res){

    connectMongo("Dentist",req.body.filter).then(function(collection){
        collection.find(function(results){
            res.send(results);
        })
      }).catch(function(err){
        res.send(`ERROR: ${err}`).sendStatus(400);
      });
});

router.patch('/dentist',function(req,res){
  updateMongo("Dentist",req.body.filter,req.body.data,req.body.many).then(function(collection){
      collection.update(function(results){
          res.send(results);
      })
    }).catch(function(err){
      res.send(`ERROR: ${err}`).sendStatus(400);
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
*                 type: object
*               data:
*                 type: object
*               many:
*                 type: boolean
*           example: {"data":{"$set":{"Name":"Miguel Robertooo"}}}
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

router.get('/patients',function(req,res){
    
    connectMongo("Patient").then(function(collection){
        collection.find(function(results){
          res.send(results);
        })
      }).catch(function(err){
        res.send(`ERROR: ${err}`).sendStatus(400);
      });
});

router.get('/patient',function(req,res){
    
    connectMongo("Patient",req.body.filter).then(function(collection){
        collection.find(function(results){
          res.send(results);
        })
      }).catch(function(err){
        res.send(`ERROR: ${err}`).sendStatus(400);
      });
});

router.patch('/patient',function(req,res){
  updateMongo("Patient",req.body.filter,req.body.data,req.body.many).then(function(collection){
      collection.update(function(results){
          res.send(results);
      })
    }).catch(function(err){
      res.send(`ERROR: ${err}`).sendStatus(400);
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
*           example: {"data":{"$set":{"Name":"Antonio Banderas"}}}
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

router.get('/invoices',function(req,res){
    
    connectMongo("Invoice").then(function(collection){
        collection.find(function(results){
            res.send(results);
        })
      }).catch(function(err){
        res.send(`ERROR: ${err}`).sendStatus(400);
      });
});

router.get('/invoice',function(req,res){
    
    connectMongo("Invoice",req.body.filter).then(function(collection){
        collection.find(function(results){
            res.send(results);
        })
      }).catch(function(err){
        res.send(`ERROR: ${err}`).sendStatus(400);
      });
});

router.patch('/invoice',function(req,res){
  updateMongo("Invoice",req.body.filter,req.body.data,req.body.many).then(function(collection){
      collection.update(function(results){
          res.send(results);
      })
    }).catch(function(err){
      res.send(`ERROR: ${err}`).sendStatus(400);
    });
/**
* @swagger 
* /api/invoice: 
*   patch: 
*     summary: Update one or many "Invoice" documents
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
*           example: {"data":{"$set":{"Invoice_ID":10}}}
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

router.get('/appointments',function(req,res){
    
    connectMongo("Appointment").then(function(collection){
        collection.find(function(results){
          res.send(results);
        })
      }).catch(function(err){
        res.send(`ERROR: ${err}`).sendStatus(400);
      });
});

router.get('/appointment',function(req,res){
    connectMongo("Appointment",req.body.filter).then(function(collection){
        collection.find(function(results){
          res.send(results);
        })
      }).catch(function(err){
        res.send(`ERROR: ${err}`).sendStatus(400);
      });
});

router.patch('/appointment',function(req,res){
  updateMongo("Appointment",req.body.filter,req.body.data,req.body.many).then(function(collection){
      collection.update(function(results){
          res.send(results);
      })
    }).catch(function(err){
      res.send(`ERROR: ${err}`).sendStatus(400);
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
*           example: {"filter":{"Appointment_ID":{"$eq":2}},"data":{"$set":{"Dentist_ID":100}}}
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

module.exports = router;