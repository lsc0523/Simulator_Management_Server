const express = require('express');
const router = express.Router();
const userController = require('../../controllers/userController');


router.get('/', function (req, res, next) {

    if (req.query.page) {
        userController.retrieveByQuery(req.query)
            .then((result) => {
                res.json(result)
            })
            .catch(err => {
                next(err)
            })
    }
    else if (req.query.type) {
        userController.retrieveByType(req.query.type)
            .then((result) => {
                res.json(result)
            })
            .catch(err => {
                next(err)
            })
    }
    else {
        userController.retrieveAll()
            .then((result) => {
                res.json(result)
            })
            .catch(err => {
                next(err)
            })
    }
});

router.get('/:id', function (req, res, next) {

    userController.retrieveById(req.params.id)
        .then((result) => {
            res.json(result)
        })
        .catch(err => {
            next(err)
        })

});

router.post('/', function (req, res, next) {

    userController.create(req.body)
        .then((result) => {
            res.status(200).json(result)
        })
        .catch((err) => {
            next(err)
        })
})

router.put('/:id', function (req, res, next) {
    userController.update(req.params.id, req.body)
        .then((result) => {
            res.status(200).json(result)
        })
        .catch((err) => {
            next(err)
        })
})

router.delete('/:id', function (req, res, next) {
    userController.delete(req.params.id)
        .then((result) => {
            res.status(200).json(result)
        })
        .catch((err) => {
            next(err)
        })
})

module.exports = router;
