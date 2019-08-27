const express = require("express");
const router = express.Router();
const wikiQueries = require("../db/queries.wikis");
const collaboratorQueries = require("../db/queries.collaborators");
// const Authorizer = require("../policies/application");

module.exports = {
  add(req, res, next) {
    collaboratorQueries.add(req, (err, collaborator) => {
      if (err) {
        req.flash("error", err);
      }
      res.redirect(req.headers.referer);
    });
  },

  edit(req, res, next) {
    wikiQueries.getWiki(
      req.params.wikiId,
      (err, wiki) => {
        if (err || wiki == null) {
          res.redirect(404, "/");
        } else {
          // const authorized = new Authorizer(req.user, wiki, collaborators).edit();
          // if (authorized)
          res.render("collaborators/edit", { wiki });

          // req.flash("You are not authorized to do that.");
          // res.redirect(`/wikis/${req.params.wikiId}`);
        }
      },
      true
    );
  },

  remove(req, res, next) {
    if (req.user) {
      collaboratorQueries.remove(req, (err, collaborator) => {
        if (err) {
          req.flash("error", err);
        }
        res.redirect(req.headers.referer);
      });
    } else {
      req.flash("notice", "You must be signed in to remove collaborators!");
      res.redirect(req.headers.referer);
    }
  }
};
