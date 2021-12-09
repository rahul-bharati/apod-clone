const express = require("express");
const router = express.Router();

const mainController = require("../controllers/routesController");

router.get("/", mainController.renderHome);

module.exports = router;
