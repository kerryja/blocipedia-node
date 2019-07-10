const express = require("express");
const router = express.Router();
const validation = require("./validation");
const userController = require("../controllers/userController");

router.get("/users/signup", userController.signUp);//changed
router.get("/users/signin", userController.signInForm);
router.post("/users", validation.validateUsers, userController.create);
router.post("/users/signin", userController.signIn);
router.get("/users/signout", userController.signOut);

module.exports = router;