const express = require("express");
const router = express.Router();
const upload = require("../middleware/middleware");

const { 
    getAbout, 
    addTeamMember, 
    updateTeamMember, 
    deleteTeamMember 
} = require("../controllers/about.controller");

// GET about/team data
router.get("/", getAbout);

// ADD team member
router.post("/", upload.single("image"), addTeamMember);

// UPDATE team member
router.put("/:id", upload.single("image"), updateTeamMember);

// DELETE team member
router.delete("/:id", deleteTeamMember);

module.exports = router;
