const express = require('express');
const router = express.Router();
const userLogController = require('../../controllers/userLogController');

/**
 * SITE MANAGEMENT PAGE
 */
router.get('/', function (req, res, next) {    
    if (req.session && req.session.user) {
      
        const user = req.session.user;
        
        // only admin user can access
       // if (user.type === 'ADM') {

            var firstMenuNm = '교육 결과';
            var subMenu = req.params.subMenu;
            var subMenuNm = '교육 결과';
            
            res.render('result', {
                user: req.session.user,
                firstMenuNm: firstMenuNm,
                subMenu: subMenu,
                subMenuNm: subMenuNm,
                headTitle: firstMenuNm
            });
            let data ={
                log_ctn:'교육결과 메뉴 클릭',
                rgst_id:req.session.user.userName+'('+req.session.user.userId+')'
            };
            userLogController.create(data)
            .then((result) => {
    
            })
            .catch((err) => {
                next(err)
            })    

    } else {
        res.redirect('/login');
    }
});

router.post('/resultDtl', function (req, res, next) {        
    if (req.session && req.session.user) {
      
        const user = req.session.user;
        
        // only admin user can access
       // if (user.type === 'ADM') {

            var firstMenuNm = '교육 결과';
            var subMenu = req.params.subMenu;
            var subMenuNm = '교육 결과';
            
            res.render('resultDtl', {
                user: req.session.user,
                firstMenuNm: firstMenuNm,
                subMenu: subMenu,
                subMenuNm: subMenuNm,
                headTitle: firstMenuNm,
                
                site: req.body.siteNm,
                pc: req.body.pcNm,
                proc: req.body.procNm,
                page: req.body.page,
                
                schSteCdIdxNo: req.body.schSteCdIdxNo,
                schProcCdIdxNo : req.body.schProcCdIdxNo,
                schPcIdxNo : req.body.schPcIdxNo,
                schType: req.body.schType,            
                schDataVal: req.body.schDataVal,                
                schStDt: req.body.schStDt,
                schEndDt: req.body.schEndDt                  
            });
        /*
        } else {
            res.status(401).send();
        } */       

    } else {
        res.redirect('/login');
    }
});




module.exports = router;
