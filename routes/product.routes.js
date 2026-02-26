const express = require("express");
const router = express.Router();
const upload = require("../middleware/middleware");

const {
  getProducts,
  addProduct,
  deleteProduct,
  updateProduct,
} = require("../controllers/product.controller");

// GET all products
router.get("/", getProducts);

// ADD product
router.post("/", upload.single("image"), addProduct);

// DELETE product
router.delete("/:id", deleteProduct);

// UPDATE product (with image support)
router.put("/:id", upload.single("image"), updateProduct);

module.exports = router;
