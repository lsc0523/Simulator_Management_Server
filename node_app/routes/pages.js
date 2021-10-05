const express  = require('express');
const router   = express.Router();

const standardPage = require('./pages/standard');
const resultPage = require('./pages/result');
const simulatorPage = require('./pages/simulator');
const dashboardPage = require('./pages/dashboard');

router.use('/', dashboardPage);  // DashBoard
router.use('/standard', standardPage);  //기준정보관리
router.use('/result', resultPage);              //교육결과
router.use('/simulator', simulatorPage);  // 시뮬레이터


module.exports = router;
