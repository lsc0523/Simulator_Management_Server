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
        if(user.type === 'ENGINEER' || user.type === 'MG_ENGINEER' || user.type === 'ADMIN') {

            var firstMenuNm = '시뮬레이터';
            var subMenu = req.params.subMenu;
            var subMenuNm = '시뮬레이터';
            
            res.render('simulator', {
                user: req.session.user,
                firstMenuNm: firstMenuNm,
                subMenu: subMenu,
                subMenuNm: subMenuNm,
                headTitle: firstMenuNm
            });

            let data ={
                log_ctn:'시뮬레이터 메뉴 클릭',
                rgst_id:req.session.user.userName+'('+req.session.user.userId+')'
            };
            userLogController.create(data)
            .then((result) => {
    
            })
            .catch((err) => {
                next(err)
            })
        
        }
        else {
            res.status(401).send();
        }
        

    } else {
        res.redirect('/login');
    }
});

module.exports = router;
