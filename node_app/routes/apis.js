const express  = require('express');
const router   = express.Router();

const userRouter = require('./apis/userRouter');
const authRouter = require('./apis/authRouter');
const codeRouter = require('./apis/codeRouter');
const groupCodeRouter = require('./apis/groupCodeRouter');
const dashboardRouter = require('./apis/dashboardRouter');
const siteRouter = require('./apis/siteRouter');
const ifRouter = require('./apis/ifRouter');
const pcRouter = require('./apis/pcRouter');
const userAuthRouter = require('./apis/userAuthRouter');
const userLogRouter = require('./apis/userLogRouter');
const simulatorRouter = require('./apis/simulatorRouter');
const resultRouter = require('./apis/resultRouter');
const fileRouter = require('./apis/fileRouter');

router.use('/user', userRouter);
router.use('/auth', authRouter);
router.use('/code', codeRouter);
router.use('/groupcode', groupCodeRouter);
router.use('/dashboard', dashboardRouter);
router.use('/site', siteRouter);
router.use('/if', ifRouter);
router.use('/pc', pcRouter);
router.use('/userAuth', userAuthRouter);
router.use('/userLog', userLogRouter);
router.use('/simulator', simulatorRouter);
router.use('/result', resultRouter);
router.use('/file', fileRouter);

module.exports = router;
