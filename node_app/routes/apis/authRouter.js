const express = require('express');
const router = express.Router();
const authController = require('../../controllers/authController');

router.post('/login', function (req, res, next) {
    const { email, password } = req.body;
    authController.login(email, password)
        .then((result) => {
            req.session.user = result;
            res.status(200).json(result)
        })
        .catch((err) => {
            next(err);
        })
})

router.post('/logout', function (req, res, next) {

    if (req.session && req.session.user) {
        req.session.destroy(function (err) {
            if (err) {
                console.log(err);
            }

        });
        // 세션 쿠키 삭제
        res.clearCookie('sid');
        res.json({code: 200})
    } else {
        res.status(400).json()
    }
    console.log('post');
})


module.exports = router;
