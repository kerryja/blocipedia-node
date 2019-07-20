const express = require("express");
const router = express.Router();
const validation = require("./validation");
const userController = require("../controllers/userController");

router.get("/users/signup", userController.signUp);
router.get("/users/signin", userController.signInForm);
router.post("/users", validation.validateUsers, userController.create);
router.post("/users/signin", userController.signIn);
router.get("/users/signout", userController.signOut);
router.get("/users/upgrade", userController.upgrade);
router.get("/users/upgrade_success", userController.upgrade_success);
router.get("/users/:id/upgrade", userController.payment);
router.post("/users/downgrade_success", userController.downgrade_success);
router.get("/users/downgrade", userController.downgrade);

module.exports = router;