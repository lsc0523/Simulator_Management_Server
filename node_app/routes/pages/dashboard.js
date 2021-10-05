const express = require('express');
const router = express.Router();
const userLogController = require('../../controllers/userLogController');

router.get('/', function (req, res, next) {        
    if (req.session && req.session.user) {
      
        const user = req.session.user;
      console.log("user.type>>>>",user.type)
        // only admin user can access
      //  if (user.type === 'ADM') {

            var firstMenuNm = 'DASHBOARD';
            var subMenu = req.params.subMenu;
            var subMenuNm = 'DASHBOARD';
            
            res.render('dashboard', {
                user: req.session.user,
                firstMenuNm: firstMenuNm,
                subMenu: subMenu,
                subMenuNm: subMenuNm,
                headTitle: firstMenuNm
            });
       
     /*   }
        else {
            res.status(401).send();
        }
        */
        

    } else {
        res.redirect('/login');
    }
});

/**
 * SITE MANAGEMENT PAGE
 */
router.get('/dashboard', function (req, res, next) {    
    if (req.session && req.session.user) {
       
        const user = req.session.user;
        
        // only admin user can access
       // if (user.type === 'ADM') {

            var firstMenuNm = 'DASHBOARD';
            var subMenu = req.params.subMenu;
            var subMenuNm = 'DASHBOARD';
            
            res.render('dashboard', {
                user: req.session.user,
                firstMenuNm: firstMenuNm,
                subMenu: subMenu,
                subMenuNm: subMenuNm,
                headTitle: firstMenuNm
            });

            let data ={
                log_ctn:'대시 보드 메뉴 클릭',
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

module.exports = router;
