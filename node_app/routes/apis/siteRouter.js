const express = require('express');
const router = express.Router();
const siteController = require('../../controllers/siteController');
const userLogController = require('../../controllers/userLogController');

const dayjs = require('dayjs');
let utc = require('dayjs/plugin/utc')
let timezone = require('dayjs/plugin/timezone')

router.get('/', function (req, res, next) {

    dayjs.extend(utc)
    dayjs.extend(timezone)

    const date = new Date();    
    let day = dayjs(date).format('YYYY-MM-DD');
        
    siteController.retrieveAll()
        .then((result) => {
            
            if(result){
                result.map(val => {
                    if(val.site.cmn_cd === 'ESNA' || val.site.cmn_cd === 'ESNB'){   // 중국
                        val.local_tm = dayjs(day + ' ' + val.rels_tm).tz("Asia/Shanghai").format("HH:mm:ss");
                    }else if(val.site.cmn_cd === 'ESMI'){    // 미국
                        val.local_tm = dayjs(day + ' ' + val.rels_tm).tz("America/New_York").format("HH:mm:ss");
                    }else if(val.site.cmn_cd === 'ESWA'){    // 폴란드
                        val.local_tm = dayjs(day + ' ' + val.rels_tm).tz("Europe/Warsaw").format("HH:mm:ss");
                    }else if(val.site.cmn_cd === 'OC'){    //오창
                        val.local_tm = val.rels_tm;
                    }
                })
            }

            res.status(200).json(result);
        })
        .catch(err => {
            next(err)
        })
});

router.post('/', function (req, res, next) {
    siteController.create(req.body)
        .then((result) => {
            res.status(200).json(result)
        })
        .catch((err) => {
            next(err);
        })
});

router.put('/:id', function (req, res, next) {
    siteController.update(req.params.id, req.body)
        .then((result) => {
            res.status(200).json(result)
        })
        .then(() => { 
            let data ={
                log_ctn:'배포기준 시간 변경',
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


module.exports = router;
