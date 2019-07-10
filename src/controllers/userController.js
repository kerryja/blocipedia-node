const userQueries = require("../db/queries.users.js");
const passport = require("passport");
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = {
	signUp(req, res, next) {
		res.render("users/signup");
	},
	signInForm(req, res, next) {
		res.render("users/signin");
	},
	signIn(req, res, next) {
		passport.authenticate("local", (err, user, info) => {
			if (!user) {
				req.flash("notice", "Sign in failed. Please try again.")
				res.redirect("/users/signin");
			} else {
				req.flash("notice", "You've successfully signed in!");
				req.logIn(user, function(err) {
					if (err) { return next(err); }
					return res.redirect("/");
				});
			}
		})(req, res, next);
	},
	signOut(req, res, next) {
		req.logout();
		req.flash("notice", "You've successfully signed out!");
		res.redirect("/");
	},
	create(req, res, next) {
		let newUser = {
			username: req.body.username,
			email: req.body.email,
			password: req.body.password,
			passwordConfirmation: req.body.passwordConfirmation
		};

		userQueries.createUser(newUser, (err, user) => {
			if (err) {
				req.flash("error", err);
				res.redirect("/users/signup");
			} else {

				passport.authenticate("local", (err, user, info) => {
					req.flash("notice", "You've successfully signed in!");

					const msg = {
						to: user.email,
						from: 'blocipedia@kerry.dev',
						subject: `Welcome ${user.username} to Blocipedia`,
						text: 'The super cool encyclopedia',
						html: 'The <strong>super</strong> cool encyclopedia',
					};
					sgMail.send(msg).catch(sgErr => {
						console.log(sgErr)
					});

					req.logIn(user, function(err) {
						if (err) { return next(err); }
						return res.redirect("/");
					});
				})(req, res, next);
			}
		});
	}
}
