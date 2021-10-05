const express = require('express');
const router = express.Router();
const codeController = require('../../controllers/codeController');
const userLogController = require('../../controllers/userLogController');

router.get('/', function (req, res, next) {

    if (req.query && req.query.page) {
        codeController.retrieveByQuery({
            page: req.query.page,
            groupcode: req.query.groupcode
        })
            .then((result) => {
                res.status(200).json(result)
            })
            .catch((err) => {
                next(err);
            })
    }
    else if (req.query && req.query.groupcode) {
        codeController.retrieveByGroupCode(req.query.groupcode)
            .then((result) => {
                res.status(200).json(result)
            })
            .catch((err) => {
                next(err);
            })
    }
    else {
        codeController.retrieveAll({})
            .then((result) => {
                res.status(200).json(result)
            })
            .catch((err) => { 
                next(err);
            })
    }
})

router.get('/:id', function (req, res, next) {
    codeController.retrieveById(req.params.id)
        .then((result) => {
            res.status(200).json(result)
        })  
        .catch((err) => {
            next(err);
        }) 
})

router.post('/', function (req, res, next) {
    codeController.create(req.body)
        .then((result) => { 
            res.status(200).json(result)
        })
        .then(() => { 
            let data ={
                log_ctn:'코드 관리 등록 저장',
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
})

router.put('/:id', function (req, res, next) {
    codeController.update(req.params.id, req.body)
        .then((result) => {
            res.status(200).json(result)
        })
        .then(() => { 
            let data ={
                log_ctn:'코드 관리 수정 저장',
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
})

// router.delete('/:id', function (req, res, next) {
//     codeController.delete(req.params.id)
//         .then((result) => {
//             res.status(200).json(result)
//         })
//         .catch((err) => {
//             next(err);
//         })
// })

module.exports = router;
