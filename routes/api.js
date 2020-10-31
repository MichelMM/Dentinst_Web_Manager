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
        res.send('ERROR')
      });
});

router.get('/dentist',function(req,res){

    connectMongo("Dentist",req.body.filter).then(function(collection){
        collection.find(function(results){
            res.send(results);
        })
      }).catch(function(err){
        res.send('ERROR')
      });
});

router.get('/patients',function(req,res){
    
    connectMongo("Patient").then(function(collection){
        collection.find(function(results){
          res.send(results);
        })
      }).catch(function(err){
        res.send('ERROR')
      });
});

router.get('/patient',function(req,res){
    
    connectMongo("Patient",req.body.filter).then(function(collection){
        collection.find(function(results){
          res.send(results);
        })
      }).catch(function(err){
        res.send('ERROR')
      });
});


router.get('/invoices',function(req,res){
    
    connectMongo("Invoice").then(function(collection){
        collection.find(function(results){
            res.send(results);
        })
      }).catch(function(err){
        res.send('ERROR')
      });
});

router.get('/invoice',function(req,res){
    
    connectMongo("Invoice",req.body.filter).then(function(collection){
        collection.find(function(results){
            res.send(results);
        })
      }).catch(function(err){
        res.send('ERROR')
      });
});

router.get('/appointments',function(req,res){
    
    connectMongo("Appointment").then(function(collection){
        collection.find(function(results){
          res.send(results);
        })
      }).catch(function(err){
        res.send('ERROR')
      });
});

router.get('/appointment',function(req,res){
    connectMongo("Appointment",req.body.filter).then(function(collection){
        collection.find(function(results){
          res.send(results);
        })
      }).catch(function(err){
        res.send('ERROR')
      });
});


module.exports = router;