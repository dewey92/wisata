var express = require('express');
var router  = express.Router();
var fs      = require('fs');

/* GET city listing. */
router.get('/:city', function(req, res, next) {
	var db   = req.db;
	var city = db.get('city');

	// Fetch database
	var cityName = req.params.city;
	city.findOne({ name : cityName }, function( err, result ) {
		if(err) return res.send(err);

		// ketika sudah ada hasilnya
		// load foto2 di kota tersebut
		var images = [];

		require('fs').readdirSync('./public/images/place').forEach( function( folder ) {
			require('fs').readdirSync('./public/images/place/' + folder ).forEach( function( file ) {
				images.push( '/images/place/' + folder + '/' + file );
			});
		});

		console.log(images);

		return res.render('main-app', {
			city   : result,
			images : images
		});

	});
});

module.exports = router;
