const express = require('express');
const router = express.Router();
const userLogController = require('../../controllers/userLogController');
/**
 * SITE MANAGEMENT PAGE
 */
router.get('/:subMenu', function (req, res, next) {    
    if (req.session && req.session.user) {
      
        const user = req.session.user;
        
        if (user.type === 'MG_ENGINEER' || user.type === 'ADMIN') {

            var firstMenuNm = '기초정보 관리';
            var subMenu = req.params.subMenu;
            var subMenuNm = '그룹 코드 관리';
            
            if(subMenu === 'codeMgmt' ){
                subMenuNm = '코드 관리';
                let data ={
                    log_ctn:'코드 관리 메뉴 클릭',
                    rgst_id:req.session.user.userName+'('+req.session.user.userId+')'
                };
                userLogController.create(data)
                .then((result) => {
        
                })
                .catch((err) => {
                    next(err)
                })    
            }
            if(subMenu === 'siteMgmt' ){
                subMenuNm = 'Site 관리';
                let data ={
                    log_ctn:'사이트 관리 메뉴 클릭',
                    rgst_id:req.session.user.userName+'('+req.session.user.userId+')'
                };
                userLogController.create(data)
                .then((result) => {
        
                })
                .catch((err) => {
                    next(err)
                })  
            }
            if(subMenu === 'ifHist'){
                subMenuNm = '인터페이스 이력조회';
            }
            if(subMenu === 'pcMgmt' ){
                firstMenuNm = '시뮬레이터 PC 관리';
                
                subMenuNm = '시뮬레이터 PC 관리';
                let data ={
                    log_ctn:'시뮬레이터 PC 관리 메뉴 클릭',
                    rgst_id:req.session.user.userName+'('+req.session.user.userId+')'
                };
                userLogController.create(data)
                .then((result) => {
        
                })
                .catch((err) => {
                    next(err)
                })  
                
            }
            if(subMenu === 'userMgmt' || subMenu === 'userLog' ){
                firstMenuNm = '사용자 관리';
                if(subMenu === 'userMgmt'){
                    subMenuNm = '사용자 권한 관리';
                    let data ={
                        log_ctn:'사용자 권한 관리 메뉴 클릭',
                        rgst_id:req.session.user.userName+'('+req.session.user.userId+')'
                    };
                    userLogController.create(data)
                    .then((result) => {
            
                    })
                    .catch((err) => {
                        next(err)
                    })  
                }else{
                    subMenuNm = '사용자 로그';
                }
            }

            res.render('standard', {
                user: req.session.user,
                firstMenuNm: firstMenuNm,
                subMenu: subMenu,
                subMenuNm: subMenuNm,
                headTitle: subMenuNm + ' | ' + firstMenuNm
            });
        }
        else {
            res.status(401).send();
        }

    } else {
        res.redirect('/login');
    }
});

module.exports = router;
