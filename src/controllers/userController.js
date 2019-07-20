const userQueries = require("../db/queries.users.js");
const wikiQueries = require("../db/queries.wikis");
const passport = require("passport");
const sgMail = require("@sendgrid/mail");
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
        req.flash("notice", "Sign in failed. Please try again.");
        res.redirect("/users/signin");
      } else {
        req.flash("notice", "You've successfully signed in!");
        req.logIn(user, function(err) {
          if (err) {
            return next(err);
          }
          return res.redirect("/wikis");
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
        req.flash("notice", "Something was not right. Please try again!");
        res.redirect("/users/signup");
      } else {
        passport.authenticate("local", (err, user, info) => {
          req.flash("notice", "You've successfully signed in!");

          const msg = {
            to: user.email,
            from: "blocipedia@kerry.dev",
            subject: `Welcome ${user.username} to Blocipedia`,
            text: "The super cool encyclopedia",
            html: "The <strong>super</strong> cool encyclopedia"
          };
          sgMail.send(msg).catch(sgErr => {
            console.log(sgErr);
          });

          req.logIn(user, function(err) {
            if (err) {
              return next(err);
            }
            return res.redirect("/");
          });
        })(req, res, next);
      }
    });
  },
  upgrade(req, res, next) {
    res.render("users/upgrade", {
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY
    });
  },

  async upgrade_success(req, res, next) {
    await userQueries.upgrade(req.user.id);
    req.flash("notice", "Congratulations! You are now a Premium member!");
    res.redirect("/");
  },

  downgrade(req, res, next) {
    res.render("users/downgrade");
  },

  async downgrade_success(req, res, next) {
    await userQueries.downgrade(req.user.id);
    await wikiQueries.privateToPublic(req.user.id);
    req.flash("notice", "You are no longer a Premium member");
    res.redirect("/");
  },

  async payment(req, res, next) {
    try {
      const stripe = require("stripe")(process.env.STRIPE_API_KEY);
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            name: "Upgrade Blocipedia Membership",
            description:
              "Upgrade your Blocipedia membership from Standard to Premium",
            amount: 1500,
            currency: "usd",
            quantity: 1
          }
        ],
        success_url: "http://localhost:3000/users/upgrade_success",
        cancel_url: "http://localhost:3000"
      });
      res.render("stripe/index.ejs", {
        sessionId: session.id,
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY
      });
    } catch (error) {
      console.log(error);
      req.flash("notice", "Couldn't process Stripe payment");
      res.redirect("/");
    }
  },

  showcollaborator(req, res, next) {
    userQueries.getUser(req.user.id, (err, result) => {
      user = result["user"];
      collaborator = result["collaborator"];
      if (err || user == null) {
        res.redirect(404, "/");
      } else {
        res.render("users/collaborators", { collaborator });
      }
    });
  }
};
