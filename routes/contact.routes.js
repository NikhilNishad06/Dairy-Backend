const express = require("express");
const router = express.Router();
const {
  getContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
} = require("../controllers/contact.controller");

// GET all contacts
router.get("/", getContacts);

// GET single contact by ID
router.get("/:id", getContactById);

// POST create contact
router.post("/", createContact);

// PUT update contact
router.put("/:id", updateContact);

// DELETE contact
router.delete("/:id", deleteContact);

module.exports = router;
