const express = require("express");
const router = express.Router();
const {
  getProductById,
  getAllProducts,
  insertProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
  insertOrder,
  getOrderById
} = require("../controllers/products");

//router.get("/:id", getProductById);
router.get("/", getAllProducts);
 router.post("/", insertProduct);
 router.put("/:id", updateProduct);
 router.delete("/:id", deleteProduct);
 router.post("/orders", insertOrder);
 router.get("/orders/:id", getOrderById);

// router.get("/search/:keyword", searchProducts);

module.exports = router;
