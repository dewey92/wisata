var express      = require('express');
var path         = require('path');
var favicon      = require('serve-favicon');
var logger       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var stylus       = require('stylus');
var nib          = require('nib');

// connection to mongoDB
var mongo = require('mongodb');
var db    = require('monk')('localhost:27017/trippy');

// setup login page
var passport        = require('passport');
var social          = require('./oauth.js');
var TwitterStrategy = require('passport-twitter').Strategy;

passport.serializeUser(function(user, done) {
	done(null, user);
});
passport.deserializeUser(function(obj, done) {
	done(null, obj);
});
passport.use(new TwitterStrategy({
		consumerKey    : social.twitter.consumerKey,
		consumerSecret : social.twitter.consumerSecret,
		callbackURL    : social.twitter.callbackURL
	},
	function(accessToken, refreshToken, profile, done) {
		process.nextTick(function() {
			return done(null, profile);
		});
	}
));

// routes mmiddleware
var routes = require('./routes/index');
var city   = require('./routes/city');
var place  = require('./routes/place');
var auth   = require('./routes/auth');

var app    = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : false }));
app.use(cookieParser());

// Stylus
app.use(stylus.middleware({
	src     : __dirname + '/res',
	dest    : __dirname + '/public',
	debug   : true,
	compile : function(str, path) {
		return stylus(str)
			.set('filename', path)
			.set('compress', true)
			.use(nib())
			.import('nib');
	}
}));

app.use(express.static(path.join(__dirname, 'public')));

// biar object db-nya bisa dipake disemua router
app.use(function (req, res, next) {
	req.db = db;
	next();
});

app.use(express.session({ secret: 'wisata_lelele' }));
app.use(passport.initialize());
app.use(passport.session());

// routing API
app.use('/', routes);
app.use('/city', city);
app.use('/place', place);
app.use('/auth', auth);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err    = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message : err.message,
			error   : err
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {
		message : err.message,
		error   : {}
	});
});


module.exports = app;
