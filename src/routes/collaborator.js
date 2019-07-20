const express = require("express");
const router = express.Router();
const collabController = require("../controllers/collabController");
const User = require("../../src/db/models").User;

router.post("/wikis/:wikiId/collaborators/add", collabController.add);
router.get("/wikis/:wikiId/collaborators", collabController.edit);
router.post("/wikis/:wikiId/collaborators/remove", collabController.remove);

module.exports = router;
