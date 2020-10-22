const express = require('express');
const router = express.Router();

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

module.exports = router;