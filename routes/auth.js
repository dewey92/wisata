var router          = require('express').Router();
var passport        = require('passport');

/* GET auth page. */
router.get('/', function(req, res, next) {
	res.render('index', { title : 'Travey' });
});

/**
 * GET /auth/twitter
 * Use passport.authenticate() as route middleware to authenticate the
 * request.  The first step in Twitter authentication will involve redirecting
 * the user to twitter.com.  After authorization, the Twitter will redirect
 * the user back to this application at /auth/twitter/callback
 */
router.get('/twitter', passport.authenticate('twitter'), function(req, res, next) {
	console.log('user: ' + req.user );
	res.render('index', { title: 'Travey' });
});

router.get(
	'/twitter/callback',
	passport.authenticate( 'twitter', {
		failureRedirect : '/' ,
		successRedirect : '/',
		failureFlash    : 'Gagal login broh',
		successFlash    : 'Sukses login broh'
	}),
	function(req, res) {
		console.log('haha sukses login broh, nih usernya: ' + req.account);
		//res.redirect('/account');
});

router.get('/facebook', passport.authenticate('facebook'), function(req, res, next) {
	res.render('index', { title: 'Travey' });
});

module.exports = router;