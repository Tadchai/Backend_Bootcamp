const express = require("express");
const router = express.Router();
const {
  getProductById,
  getAllProducts,
  insertProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
} = require("../BACK-END DEV homework/Day15/controllers/products");

/**
 * @swagger
 * /products/{id}:
 *  get:
 *     summary: Get a product by id
 *     description: Get a product by id
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the product to get
 *     responses:
 *       200:
 *         description: A product object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: The product was not found
 *       500:
 *         description: Some error happened
 */
router.get("/:id", getProductById);
/**
 * @swagger
 * /products:
 *  get:
 *     summary: Get all products
 *     description: Get all products
 *     responses:
 *       200:
 *         description: An array of product objects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       500:
 *         description: Some error happened
 */
router.get("/", getAllProducts);

/**
 * @swagger
 * /products:
 *  post:
 *     summary: Insert a new product
 *     description: Insert a new product
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: The product was created successfully
 *       400:
 *         description: The request was invalid
 *       500:
 *         description: Some error happened
 */
router.post("/", insertProduct);

/**
 * @swagger
 * /products/{id}:
 *  put:
 *     summary: Update a product by id
 *     description: Update a product by id
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the product to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: The product was updated successfully
 *       400:
 *         description: The request was invalid
 *       404:
 *         description: The product was not found
 *       500:
 *         description: Some error happened
 */
router.put("/:id", updateProduct);

/**
 * @swagger
 * /products/{id}:
 *  delete:
 *     summary: Delete a product by id
 *     description: Delete a product by id
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the product to delete
 *     responses:
 *       200:
 *         description: The product was deleted successfully
 *       404:
 *         description: The product was not found
 *       500:
 *         description: Some error happened
 */
router.delete("/:id", deleteProduct);

/**
 * @swagger
 * /products/search/{keyword}:
 *  get:
 *     summary: Search products by keyword
 *     description: Search products by keyword
 *     parameters:
 *       - in: path
 *         name: keyword
 *         schema:
 *           type: string
 *         required: true
 *         description: The keyword to search for
 *     responses:
 *       200:
 *         description: An array of product objects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       500:
 *         description: Some error happened
 */
router.get("/search/:keyword", searchProducts);

module.exports = router;
