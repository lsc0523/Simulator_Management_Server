const express = require('express');
const router = express.Router();
const userAuthController = require('../../controllers/userAuthController');
const userLogController = require('../../controllers/userLogController');


router.get('/', function (req, res, next) {
    if (req.query) {
        userAuthController.retrieveByQuery(req.query)
            .then((result) => {
                res.status(200).json(result)
            })
            .catch((err) => {
                next(err);
            })
    } 
    else {
        userAuthController.retrieveAll()
            .then((result) => { 
                res.status(200).json(result)
            })
            .catch(err => {
                next(err)
            })
    }

});

router.post('/', function (req, res, next) {
    
    userAuthController.create(req.body)
        .then((result) => {
            res.status(200).json(result)
        })
        .then(() => { 
            let data ={
                log_ctn:'사용자 권한 관리 등록 저장',
                rgst_id:req.session.user.userName+'('+req.session.user.userId+')'
            };
            userLogController.create(data)
            .then((result) => {

            })
            .catch((err) => {
                next(err)
            }) 
        }) 
        .catch((err) => {
            next(err);
        })
});

router.put('/:id', function (req, res, next) {
    userAuthController.update(req.params.id, req.body)
        .then((result) => {
            res.status(200).json(result)
        })
        .then(() => { 
            let data ={
                log_ctn:'사용자 권한 관리 수정 저장',
                rgst_id:req.session.user.userName+'('+req.session.user.userId+')'
            };
            userLogController.create(data)
            .then((result) => {

            })
            .catch((err) => {
                next(err)
            }) 
        }) 
        .catch((err) => {
            next(err);
        })
});

router.get('/:id', function (req, res, next) {       
    userAuthController.retrieveId(req.params.id)
        .then((result) => {
            res.status(200).json(result)
        })        
        .catch((err) => {
            next(err);
        })
});


module.exports = router;
