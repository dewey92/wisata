// config/passport.js

// load all the things we need
var LocalStrategy    = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy  = require('passport-twitter').Strategy;

var social = require('./oauth');

module.exports = function(passport, db) {

	// used to serialize the user for the session
	passport.serializeUser(function(user, done) {
		done(null, user);
	});
	passport.deserializeUser(function(id, done) {
		db.get('user').findById(id, function(err, user) {
			done(err, user);
		});
	});

	// Login twitter
	passport.use(new TwitterStrategy({
			consumerKey    : social.twitter.consumerKey,
			consumerSecret : social.twitter.consumerSecret,
			callbackURL    : social.twitter.callbackURL
		},
		function(token, tokenSecret, profile, done) {

			console.log( 'id yg login: ' + profile.id );
			/*db.get('user').findAndModify({
				query  : { id : profile.id },
				update : { $setOnInsert : { foo : 'bar' } },
				new    : true,
				upsert : true
			}, {}, function( err, doc ) {
				if(err) return done( err );

				done( null, doc );
			});*/
		}
	));

	// Login local
	passport.use(new LocalStrategy(
		function(username, password, done) {
			User.findOne({ username: username }, function(err, user) {
				if(err) { return done(err); }
				if( ! user ) {
					return done(null, false, { message: 'Incorrect username.' });
				}
				if( ! user.validPassword(password) ) {
					return done(null, false, { message: 'Incorrect password.' });
				}
				return done(null, user);
			});
		}
	));

	// code for login (use('local-login', new LocalStategy))
	// code for signup (use('local-signup', new LocalStategy))
	// code for facebook (use('facebook', new FacebookStrategy))

	// =========================================================================
	// TWITTER =================================================================
	// =========================================================================
	/*passport.use(new TwitterStrategy({

			consumerKey: configAuth.twitterAuth.consumerKey,
			consumerSecret: configAuth.twitterAuth.consumerSecret,
			callbackURL: configAuth.twitterAuth.callbackURL

		},
		function(token, tokenSecret, profile, done) {

			// make the code asynchronous
			// User.findOne won't fire until we have all our data back from Twitter
			process.nextTick(function() {

				User.findOne({
					'twitter.id': profile.id
				}, function(err, user) {

					// if there is an error, stop everything and return that
					// ie an error connecting to the database
					if (err)
						return done(err);

					// if the user is found then log them in
					if (user) {
						return done(null, user); // user found, return that user
					} else {
						// if there is no user, create them
						var newUser = new User();

						// set all of the user data that we need
						newUser.twitter.id = profile.id;
						newUser.twitter.token = token;
						newUser.twitter.username = profile.username;
						newUser.twitter.displayName = profile.displayName;

						// save our user into the database
						newUser.save(function(err) {
							if (err)
								throw err;
							return done(null, newUser);
						});
					}
				});

			});

		}));*/

};
