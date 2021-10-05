const express = require('express');
const router = express.Router();
const ifController = require('../../controllers/ifController');


router.get('/', function (req, res, next) {
    
    ifController.retrieveByQuery(req.query)
    .then((result) => {
        res.status(200).json(result)
    })
    .catch(err => {
        next(err)
    })
            
});
router.post('/', function (req, res, next) {
    ifController.create(req.body)
    .then((result) => {
        res.status(200).json(result)
    })
    .catch((err) => {
        next(err);
    })
});

module.exports = router;
