const express = require("express");
const router = express.Router();
const {
  getAllProducts,
  insertProduct,
  updateProduct,
  deleteProduct,
  insertOrder,
  getOrderById
} = require("../controllers/products");

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
 *                 $ref: '#/components/schemas/Products'
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
 *             $ref: '#/components/schemas/Products'
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
 *             $ref: '#/components/schemas/Products'
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
 * /products/orders:
 *  post:
 *     summary: Insert a new order
 *     description: Insert a new order
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Orders'
 *     responses:
 *       201:
 *         description: The order was created successfully
 *       400:
 *         description: The request was invalid
 *       500:
 *         description: Some error happened
 */
 router.post("/orders", insertOrder);

 /**
 * @swagger
 * /products/orders/{id}:
 *  get:
 *     summary: Get a order by id
 *     description: Get a order by id
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the order to get
 *     responses:
 *       200:
 *         description: A order object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Orders'
 *       404:
 *         description: The order was not found
 *       500:
 *         description: Some error happened
 */
 router.get("/orders/:id", getOrderById);

module.exports = router;
