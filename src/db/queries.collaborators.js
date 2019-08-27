const User = require("./models").User;
const Wiki = require("./models").Wiki;
const Collaborator = require("./models").Collaborator;
const Authorizer = require("../policies/application");

module.exports = {
  async add(req, callback) {
    try {
      let wikiId = req.params.wikiId * 1;
      if (req.user.username == req.body.collaborator) {
        callback("You cannot add yourself to collaborators!");
        return;
      }
      let users = await User.findAll({
        where: {
          username: req.body.collaborator
        }
      });
      if (!users[0]) {
        callback("User not found.");
        return;
      }
      let collaborators = await Collaborator.findAll({
        where: {
          userId: users[0].id,
          wikiId: wikiId
        }
      });
      if (collaborators.length != 0) {
        callback(
          `${req.body.collaborator} is already a collaborator on this wiki.`
        );
        return;
      }
      let newCollaborator = {
        userId: users[0].id,
        wikiId: wikiId
      };
      let collaborator = await Collaborator.create(newCollaborator);
      callback(null, collaborator);
    } catch (err) {
      callback(err);
    }
  },

  remove(req, callback) {
    const collaboratorId = req.body.collaborator;
    let wikiId = req.params.wikiId;
    // const authorized = new Authorizer(req.user, wiki, collaboratorId).destroy();
    // if (authorized) {
    Collaborator.destroy({
      where: {
        userId: collaboratorId,
        wikiId: wikiId
      }
    })
      .then(deletedRecordsCount => {
        callback(null, deletedRecordsCount);
      })
      .catch(err => {
        callback(err);
      });
    // } else {
    //   req.flash("notice", "You are not authorized to do that.");
    //   callback(401);
  }
};
