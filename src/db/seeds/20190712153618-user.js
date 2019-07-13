"use strict";

// const faker = require("faker");

// let users = [
// 	{
// 		username: "koala12",
// 		email: "koala12@koala.com",
// 		password: "koala123",
// 		createdAt: new Date(),
// 		updatedAt: new Date(),
// 		role: "standard"
// 	},
// 	{
// 		username: "panda13",
// 		email: "panda13@panda.com",
// 		password: "panda123",
// 		createdAt: new Date(),
// 		updatedAt: new Date(),
// 		role: "standard"
// 	},
// 	{
// 		username: "kerry28",
// 		email: "kerry@gmail.com",
// 		password: "kerry123",
// 		createdAt: new Date(),
// 		updatedAt: new Date(),
// 		role: "standard"
// 	}
// ];

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.bulkInsert("Users", [{
		username: "koala12",
		email: "koala12@koala.com",
		password: "koala123",
		createdAt: new Date(),
		updatedAt: new Date(),
		role: "standard"
		}], {});
	},

	down: (queryInterface, Sequelize) => {
		return queryInterface.bulkDelete("Users", null, {});
	}
};
