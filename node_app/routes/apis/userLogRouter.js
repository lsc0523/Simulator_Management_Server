const express = require('express');
const router = express.Router();
const userLogController = require('../../controllers/userLogController');


router.get('/', function (req, res, next) {
    userLogController.retrieveByQuery(req.query)
    .then((result) => {
        res.status(200).json(result)
    })
    .catch((err) => { 
        next(err);
    })
});
router.post('/', function (req, res, next) {
    
    userLogController.create(req.body)
        .then((result) => {
            res.status(200).json(result)
        })
        .catch((err) => {
            next(err);
        })
});
module.exports = router;
