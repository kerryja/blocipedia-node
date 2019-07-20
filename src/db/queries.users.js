require("dotenv").config();
const User = require("./models").User;
const bcrypt = require("bcryptjs");
const Collaborator = require('./models').Collaborator;

module.exports = {

  createUser(newUser, callback){

    const salt = bcrypt.genSaltSync();
    const hashedPassword = bcrypt.hashSync(newUser.password, salt);

    return User.create({
			username: newUser.username,
      email: newUser.email,
      password: hashedPassword
    })
    .then((user) => {
      callback(null, user);
    })
    .catch((err) => {
      callback(err);
    });
  },

  getUser(id, callback) {
    let result = {};
    User.findByPk(id)
    .then((user) => {
      if(!user) {
        callback(404);
      } else {
        result["user"] = user;
        Collaborator.scope({method: ["collaboratorFor", id]}).findAll()
        .then((collaborator) => {
          result["collaborator"] = collaborator;
          callback(null, result);
        })
        .catch((err) => {
          callback(err);
        })
      }
    })
  },

  upgrade(id) {
    return User.findByPk(id)
      .then(user => {
        if (!user) {
          return callback("User does not exist!");
        } else {
          return user.update({ role: "premium" });
        }
      })
      .catch(err => {
        console.log(err);
      });
  },

downgrade(id) {
    return User.findByPk(id)
      .then(user => {
        if (!user) {
          return callback("User does not exist!");
        } else {
          return user.update({ role: "standard" });
        }
      })
      .catch(err => {
        console.log(err);
      });
  }
};

