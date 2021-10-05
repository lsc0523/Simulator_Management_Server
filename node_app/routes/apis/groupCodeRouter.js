const express = require('express');
const router = express.Router();
const groupCodeController = require('../../controllers/groupCodeController');

router.get('/', function (req, res, next) {

    if (req.query && req.query.page) {
        groupCodeController.retrieveByQuery({
            page: req.query.page
        })
            .then((result) => {
                res.status(200).json(result)
            })
            .catch((err) => {
                next(err);
            })
    }
    else {
        groupCodeController.retrieveAll()
            .then((result) => {
                res.status(200).json(result)
            })
            .catch((err) => {
                next(err);
            })
    }
})

router.get('/:id', function (req, res, next) {
    groupCodeController.retrieveById(req.params.id)
        .then((result) => {
            res.status(200).json(result)
        })
        .catch((err) => {
            next(err);
        })
})

router.post('/', function (req, res, next) {
    groupCodeController.create(req.body)
        .then((result) => {
            res.status(200).json(result)
        })
        .catch((err) => {
            next(err);
        })
})

router.put('/:id', function (req, res, next) {
    groupCodeController.update(req.params.id, req.body)
        .then((result) => {
            res.status(200).json(result)
        })
        .catch((err) => {
            next(err);
        })
})

// router.delete('/:id', function (req, res, next) {
//     groupCodeController.delete(req.params.id)
//         .then((result) => {
//             res.status(200).json(result)
//         })
//         .catch((err) => {
//             next(err);
//         })
// })

module.exports = router;
