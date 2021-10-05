const express = require('express'); 
const router = express.Router();
const dashboardController = require('../../controllers/dashboardController');

router.get('/', function (req, res, next) {
    dashboardController.retrieveAll()
        .then((result) => {
            res.status(200).json(result)
        })  
        .catch(err => {
            next(err) 
        })
});  

router.get('/site/:id', function (req, res, next) {

    dashboardController.retrieveSite(req.params.id)
        .then((result) => {            
            res.status(200).json(result)
        })
        .catch(err => {
            next(err)
        })
});

router.get('/pcList/:id', function (req, res, next) {
    let list = '';
    dashboardController.retrievePcList(req.params.id)
        .then((result) => {            
            res.status(200).json(result)            
        })        
        .catch(err => {  
            next(err)
        });

    

});

router.get('/pcVerList/:id', function (req, res, next) {    
    dashboardController.retrievePcVerList(req.params.id)
        .then((result) => {            
            if(result){               
                res.status(200).json(result)
            }
        })        
        .catch(err => {  
            next(err)
        });    
});

router.get('/program', function (req, res, next) {
    if (req.query && req.query.site_id && req.query.process_id) {
        dashboardController.retrieveProgram(req.query.site_id, req.query.process_id)
            .then((result) => {
                res.status(200).json(result)
            })
            .catch((err) => {
                next(err);
            })
    }
    else {
        dashboardController.retrieveAll()
            .then((result) => {
                res.status(200).json(result)
            })
            .catch((err) => {
                next(err);
            })
    }
});

router.get('/programNewVer', function (req, res, next) {
    if (req.query && req.query.site_id && req.query.process_id) {
        dashboardController.retrieveProgramNewVer(req.query.site_id, req.query.process_id)
            .then((result) => {               
                res.status(200).json(result)
            })
            .catch((err) => {
                next(err);
            })
    }
    else {
        dashboardController.retrieveAll()
            .then((result) => {
                res.status(200).json(result)
            })
            .catch((err) => {
                next(err);
            })
    }
})

router.get('/pc/:id', function (req, res, next) {

    dashboardController.retrievePc(req.params.id)
        .then((result) => {
            res.status(200).json(result)
        })
        .catch(err => {
            next(err)
        })

});


module.exports = router;
