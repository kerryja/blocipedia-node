"use strict";

const faker = require("faker");
const User = require("../models").User;

 let wikis = [
   {
     title: faker.hacker.noun(),
     body: faker.hacker.phrase(),
     private: true,
     createdAt: new Date(),
     updatedAt: new Date(),
     userId: 1
   },
   {
     title: faker.hacker.noun(),
     body: faker.hacker.phrase(),
     private: false,
     createdAt: new Date(),
     updatedAt: new Date(),
     userId: 1
   },
   {
     title: faker.hacker.noun(),
     body: faker.hacker.phrase(),
     private: false,
     createdAt: new Date(),
     updatedAt: new Date(),
     userId: 1
   },
   {
     title: faker.hacker.noun(),
     body: faker.hacker.phrase(),
     private: true,
     createdAt: new Date(),
     updatedAt: new Date(),
     userId: 1
	 },
 ]; 

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let users = await User.findAll ();
    let user = users[0];
    for (let i = 0; i < wikis.length; i++)
      wikis[i].userId = user.id;
    await queryInterface.bulkInsert ("Wikis", wikis, {});
  },

  down: (queryInterface, Sequelize) => {
		return queryInterface.bulkDelete("Wikis", null, {});
  }
};
