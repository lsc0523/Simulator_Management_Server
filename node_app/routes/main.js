const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const userLogController = require('../controllers/userLogController');
/**
 * 로그인한 다음 나오는 최초 메인 화면, 비로그인 이면 LOGIN 화면으로 리다이렉팅 함.
 */
router.post('/', function (req, res, next) {

	if (req.headers['user-agent'].indexOf('Chrome') == -1 && req.headers['user-agent'].indexOf('Edg') == -1) {
		res.render('browserWarn');
	} else {
	if (req.body.empNo) {
		userController.retrieveAll(req.body.empNo)
			.then((result) => {
				console.log("@#@#@   result11",result[0].name)
				req.session.user = {
					//type:'ADM',
					empNo:req.body.empNo,
					mail:req.body.mail,
					userId: req.body.userId,
					userName:result[0].name,
					userTeam:result[0].team,
					grade:result[0].grade,
					type:result[0].auth
					//type:'ADMIN'
				};
				console.log("@#@#@   session.user   ",req.session.user)
				
				var firstMenuNm = 'DASHBOARD';
				var subMenu = req.params.subMenu;
				var subMenuNm = 'DASHBOARD';
				const attr = {						
					user: req.session.user
					//, users: users
					, firstMenuNm: firstMenuNm
					, subMenu: subMenu
					, subMenuNm: subMenuNm
					, headTitle: firstMenuNm
					// , users_cnt: users_cnt
					// , users_pages_cnt: users_pages_cnt
					
				};
				//res.render('dashboard', attr);
				if(req.session.user.type==null  || req.session.user.type==''){
					res.render('logout');
					return;
				}
				else{
					res.render('dashboard', attr);
				}
			})
			.then((attr) => {
				let data ={
					log_ctn:'login',
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
				next(err)
			})
		
		
	

	} else {


	console.log("로그인 정보 없을 때~~~");	

	res.render('login');

	}
     }
});

router.get('/login', function (req, res, next) {
	if (req.session && req.session.user) {
		res.redirect('/');
	} else {
		res.render('login', {});
	}
});

router.get('/logout', function (req, res, next) {
/*	if (req.session && req.session.user) {
		res.redirect('/');
	} else {
		res.render('logout', {});
	}
*/
//	res.render('logout', {});
	console.log('1');
});

/**	
 * APK 다운로드 받을 수 있는 모바일 페이지(현재 APK는 구버전임)
 */
router.get('/download', function (req, res) {
	res.render('download/index');
});

module.exports = router;
