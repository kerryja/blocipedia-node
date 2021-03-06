require("dotenv").config();
const Wiki = require("./models").Wiki;
const Collaborator = require("./models").Collaborator;
const User = require("./models").User;

module.exports = {
  getAllWikis(callback, includeCollaborators) {
    let options = {};
    if (includeCollaborators)
      options = { include: [{ model: Collaborator, as: "collaborators" }] };
    return Wiki.findAll(options)
      .then(wikis => {
        callback(null, wikis);
      })
      .catch(err => {
        callback(err);
      });
  },

  getWiki(id, callback, includeCollaborators) {
    let options = {};
    if (includeCollaborators)
      options = {
        include: [
          {
            model: Collaborator,
            as: "collaborators",
            include: [User]
          }
        ]
      };
    return Wiki.findByPk(id, options)
      .then(wiki => {
        callback(null, wiki);
      })
      .catch(err => {
        callback(err);
      });
  },

  addWiki(newWiki, callback) {
    return Wiki.create({
      title: newWiki.title,
      body: newWiki.body,
      private: newWiki.private,
      userId: newWiki.userId
    })
      .then(wiki => {
        callback(null, wiki);
      })
      .catch(err => {
        callback(err);
      });
  },

  privateToPublic(id) {
    return Wiki.findAll().then(wikis => {
      wikis.forEach(wiki => {
        if (wiki.userId == id && wiki.private == true) {
          wiki.update({
            private: false
          });
        }
      });
    });
  },

  deleteWiki(id, callback) {
    return (
      Wiki.findByPk(id)
        .then(wiki => {
          // const authorized = new Authorizer(req.user, wiki).destroy();
          // if (authorized) {
          wiki.destroy().then(res => {
            callback(null, wiki);
          });
          // } else {
          //req.flash("notice", "You are not authorized to do that.");
          //callback(401);
        })
        // })
        .catch(err => {
          callback(err);
        })
    );
  },

  updateWiki(id, updatedWiki, callback) {
    return Wiki.findByPk(id).then(wiki => {
      if (!wiki) {
        return callback("Wiki not found");
      }

      wiki
        .update(updatedWiki, {
          fields: Object.keys(updatedWiki)
        })
        .then(() => {
          callback(null, wiki);
        })
        .catch(err => {
          callback(err);
        });
    });
  }
};
