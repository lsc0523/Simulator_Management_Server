const express = require('express');
const excel = require('exceljs');
const router = express.Router();
const resultController = require('../../controllers/resultController');

const dayjs = require('dayjs');
const xlsx = require( "xlsx" );


router.get('/', function (req, res, next) {
    
    resultController.retrieveByQuery(req.query)
    .then((result) => {
        res.status(200).json(result)
    })
    .catch((err) => { 
        next(err);
    })
  
});

router.get('/detail', function (req, res, next) {
    
    resultController.retrieveId(req.query)
        .then((result) => {
            res.status(200).json(result)
        })
        .catch((err) => {
            next(err); 
        })
});

router.get('/pcList', function (req, res, next) {
    
    resultController.retrievePcList(req.query) 
    .then((result) => {
        res.status(200).json(result)
    })
    .catch((err) => { 
        next(err);
    })
  
});


router.get('/excelDown', function (req, res, next) {       
    if(req.query.callType === "dtl"){
        resultController.retrieveIdExcel(req.query)
        .then((result) => {
            if(result){
                let workbook = new excel.Workbook(); //creating workbook
                let worksheet = workbook.addWorksheet('Customers'); //creating worksheet
    
                //  WorkSheet Header
                worksheet.columns = [                   
                    { header: 'Id', key: 'user_id', width: 30 },
                    { header: 'Missions', key: 'misn_nm', width: 50},
                // { header: 'Age', key: 'age', width: 10, outlineLevel: 1},
                    { header: 'Machine', key: 'etc1', width: 30 },
                    { header: 'Start Time', key: 'etc2', width: 30 },
                    { header: 'End Time', key: 'etc3', width: 30 },
                    { header: 'Play Time', key: 'etc4', width: 30 },
                    { header: 'Result', key: 'etc5', width: 30 },
                    { header: 'Score', key: 'etc6', width: 30 }                   
                ];
    
                // Add Array Rows
                worksheet.addRows(result);
    
                res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                res.setHeader('Content-Disposition', 'attachment; filename=' + 'result_'+dayjs().format("YYYYMMDD")+'.xlsx');
                
                workbook.xlsx.write(res)
                    .then(function() {
                        res.status(200).end();
                });  
            }
        })
        .catch((err) => {
            next(err);
        })
    }else{
        resultController.retrieveByQueryExcel(req.query)
            .then((result)=> {   

                if(result){
                    let workbook = new excel.Workbook(); //creating workbook
                    let worksheet = workbook.addWorksheet('Customers'); //creating worksheet
                    let schTypeSet = '';
 
                    if(req.query.schType === 'Users') {
                        schTypeSet = 'E-mail (ID)';
                    }else{
                        schTypeSet = 'Missions';
                    }
        
                    //  WorkSheet Header
                    worksheet.columns = [
                        { header: '사이트', key: 'ste_cd', width: 10 },
                        { header: 'PC-ID', key: 'pc_nm', width: 30 },
                        { header: '공정', key: 'proc_cd', width: 30},                        
                        { header: schTypeSet, key: 'sch_type_data', width: 50 },
                        { header: 'Count', key: 'cnt', width: 30 }
                    ];
        
                    // Add Array Rows
                    worksheet.addRows(result);
        
                    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                    res.setHeader('Content-Disposition', 'attachment; filename=' + 'result_'+dayjs().format("YYYYMMDD")+'.xlsx');
                    
                    workbook.xlsx.write(res)
                        .then(function() {
                            res.status(200).end();
                    });  
                }
                
                
        });
    }   
    
});

module.exports = router;
