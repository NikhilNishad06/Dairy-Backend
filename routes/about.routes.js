const express = require("express");
const router = express.Router();

const { getAbout } = require("../controllers/about.controller");

// GET about/team data
router.get("/", getAbout);

module.exports = router;
