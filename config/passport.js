// config/passport.js

// load all the things we need
var LocalStrategy    = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy  = require('passport-twitter').Strategy;

var social = require('./oauth');

module.exports = function(passport, db) {

	// used to serialize the user for the session
	passport.serializeUser(function(user, done) {
		console.log('serialize user: ' + user);
		done(null, user);
	});
	passport.deserializeUser(function(id, done) {
		console.log('deserialize id: ' + id );
		db.get('user').findById(id, function(err, user) {
			console.log('deserialize user: ' + user );
			done(err, user);
		});
	});

	// Login twitter
	passport.use(new TwitterStrategy({
			consumerKey    : social.twitter.consumerKey,
			consumerSecret : social.twitter.consumerSecret,
			callbackURL    : social.twitter.callbackURL
		},
		function (token, tokenSecret, profile, done) {

			// make function run asyncly
			process.nextTick(function() {

				console.log( 'ambil dr db id yg lg login: ' + profile.id );
				// Find or create
				db.get('user').findOne({ twitterID : profile.id }, function (err, doc) {
					if (err) return done(err);
					// Kalo ada usernya
					if (doc) return done(null, doc);
					else {
						// Kalo ga ada usernya, tambahin
						console.log('ga ada user, tambahin aja');

						db.get('user').insert({
							twitterID : profile.id
						}, function(err, doc) {
							if (err) return done(err);

							return done(null, doc); 
						});
					}
				});

			});

			/*db.get('user').findAndModify({
				query  : { id : profile.id },
				update : { $setOnInsert : {
					twitterID : profile.id
				}},
				new    : true,
				upsert : true
			}, {}, function( err, doc ) {
				if(err) return done( err );

				done( null, doc );
			});*/
		}
	));

	// Login local
	/*passport.use(new LocalStrategy(
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
	));*/

};
