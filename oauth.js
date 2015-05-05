var ids = {
	facebook: {
		clientID: 'get_your_own',
		clientSecret: 'get_your_own',
		callbackURL: 'http://127.0.0.1:1337/auth/facebook/callback'
	},
	twitter: {
		consumerKey: 'MStxLV1Y1RDqo8t8hDShvI1Zf',
		consumerSecret: '3sXstzJoGrChIS74ssWsg5nUubKhi04ln4chSvd2qu467BzV5D',
		callbackURL: "http://127.0.0.1:3000/auth/twitter/callback"
	},
	google: {
		returnURL: 'http://127.0.0.1:1337/auth/google/callback',
		realm: 'http://127.0.0.1:1337'
	}
}

module.exports = ids;