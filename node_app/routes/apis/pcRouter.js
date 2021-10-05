const express = require('express');
const router = express.Router();
const pcController = require('../../controllers/pcController');
const userLogController = require('../../controllers/userLogController');
const ifLogController = require('../../controllers/ifController');
 

router.get('/', function (req, res, next) {
    if (req.query) {
        pcController.retrieveByQuery(req.query)
            .then((result) => {
                res.status(200).json(result)
            })
            .catch((err) => {
                next(err); 
            })
    }
    else {
        pcController.retrieveAll()
        .then((result) => {
            res.status(200).json(result)
        })
        .catch(err => {
            next(err)
        })
    }
});

router.post('/', function (req, res, next) {
    pcController.create(req.body)
        .then((result) => {
            res.status(200).json(result)
        })
        .then(() => { 
            let data ={
                log_ctn:'시뮬레이터 PC 등록 저장',
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
    pcController.update(req.params.id, req.body)
        .then((result) => {
            res.status(200).json(result)
        })
        .then(() => { 
            let data ={
                log_ctn:'시뮬레이터 PC 수정 저장',
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

//외부 api 
router.get('/check', function (req, res, next) {
    if (req.query.site && req.query.process) {
        pcController.searchCheck(req.query.site, req.query.process)
            .then((result) => {
                res.status(200).json(result)
            })
            .catch((err) => {
                let data ={
                    if_nm: '프로그램 최종 파일 체크 api호출',
                    log_ctn:err.msg,
                    rtn_data:'site:'+req.query.site+'process:'+req.query.process
                };
                ifLogController.create(data)
                .then((result) => {
    
                })
                .catch((err) => {
                    next(err)
                }) 
                next(err); 
            })
    }
    else {
        let data ={
            if_nm: '프로그램 최종 파일 체크 api호출',
            log_ctn:'파라미터 없음',
            rtn_data:'site:'+req.query.site+'process:'+req.query.process
        };
        ifLogController.create(data)
        .then((result) => {

        })
        .catch((err) => {
            next(err)
        }) 
        res.status(500).json(" No Parameter!")
    }
}); 

//외부 api 
router.get('/update', function (req, res, next) {

    /*
         program_id: 123456,
  ip: 100.100.100.100,
  type: D*/


    if (req.query.program_id && req.query.ip && req.query.type) {
        pcController.setUpdate(req.query.program_id, req.query.ip, req.query.type)
            .then((result) => {
                res.status(200).json(result)
            })
            .catch((err) => {
                let data ={
                    //if_nm: req.url,
                    if_nm: 'pc 정보 업데이트 api호출',
                    log_ctn:err.msg,
                    rtn_data:'program_id:'+req.query.program_id+' ip:'+req.query.ip+' type:'+req.query.type
                };
                ifLogController.create(data)
                .then((result) => {
                })
                .catch((err) => {
                    next(err)
                }) 
                next(err);
            })
    }
    else {
        let data ={
            if_nm: 'pc 정보 업데이트 api호출',
            log_ctn:'파라미터 없음',
            rtn_data:''
        };
        console.log('data    ====>',data)
        ifLogController.create(data)
        .then((result) => {
        })
        .catch((err) => {
            next(err)
        }) 
        res.status(500).json("  No Parameter!")
    }
});

router.delete('/:id', function (req, res, next) {
    pcController.delete(req.params.id)
        .then((result) => {
            res.status(200).json(result)
        })
        .then(() => { 
            let data ={
                log_ctn:'시뮬레이터 PC 삭제',
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


module.exports = router;
