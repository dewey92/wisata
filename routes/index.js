var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	console.log( req.user, req.session );

	res.render('index', { title: 'Travey' });
});

/* GET search page. */
router.post('/search', function(req, res, next) {
	res.redirect('/city/' + req.body.cityName);
});

module.exports = router;
