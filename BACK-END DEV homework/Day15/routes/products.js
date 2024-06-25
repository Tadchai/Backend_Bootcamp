const express = require("express");
const router = express.Router();
const {
  getProductById,
  getAllProducts,
  insertProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
} = require("../controllers/products");

//router.get("/:id", getProductById);
router.get("/", getAllProducts);
 router.post("/", insertProduct);
 router.put("/:id", updateProduct);
 router.delete("/:id", deleteProduct);
// router.get("/search/:keyword", searchProducts);

module.exports = router;
