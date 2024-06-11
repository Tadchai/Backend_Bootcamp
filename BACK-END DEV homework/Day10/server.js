const express = require('express');
const bodyParser = require('body-parser');
const mysql =require('mysql2');
const dotenv =require('dotenv');
const cors = require("cors");
const { swaggerUi, swaggerSpec } = require("./swagger.js");

dotenv.config();

const app = express();
const port = 3000;

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

//Logging Middleware
app.use((req, res, next) =>{
    console.log(`${new Date()} - ${req.method} - ${req.url}`);
    next();
})


app.use(bodyParser.json());
app.use(cors());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

//test Error handing middleware
app.get('/error', (req,res,next) => {
    const err = new Error('This is a test error');
    next(err);
})

//get all products
app.get('/products', (req, res) => {
    const sql = "SELECT * FROM products";
    db.query(sql, (err, result) => {
        if(err) {
            res.status(500).json({ message: 'Error!!', error:err});
        }else {
            res.status(200).json(result);
        }
    });
});
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
app.get('/products/:id', (req, res) => {
    const id = Number(req.params.id);
    const sql = "SELECT * FROM products WHERE id = ?";
    db.query(sql, [id], (err, result) => {
                res.json(result);}   
    );
});

// get product by id
app.get('/products/:id', (req, res) => {
    const id = Number(req.params.id);
    const sql = "SELECT * FROM products WHERE id = ?";
    db.query(sql, [id], (err, result) => {
        if(err) {
            res.status(500).json({ message: 'Error!!', error:err});
        }else {
            if (result.length === 0) {
                res.status(404).json({message: 'product not found!'});
            }else {
                res.status(200).json(result);
            }   
        }
    });
});
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


//create product
app.post('/products', (req, res) => {
    const product = req.body;
    const sql = "INSERT INTO products (name, price, discount, review_count, image_url) VALUES (?, ?, ?, ?, ?)";
    db.query(sql, [product.name ,product.price, product.discount, product.review_count, product.image_url], (err, result) => {
        if(err) {
            res.status(500).json({ message: 'Error!!', error:err});
        }else {
            res.status(201).json({ message: 'create success!!'});
        }
    });
});
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


//update product by id
app.put('/products/:id', (req, res) => {
    const id = Number(req.params.id);
    const product = req.body;
    const sql = "UPDATE products SET name = ?, price = ?, discount = ?, review_count = ?, image_url = ? WHERE id = ?";
    db.query(sql, [product.name ,product.price, product.discount, product.review_count, product.image_url, id], (err, result) => {
        if(err) {
            res.status(500).json({ message: 'Error!!', error:err});
        }else {
            res.status(200).json({ message: 'update success!!'});
        }
    });
});
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


//delete product by id
app.delete('/products/:id', (req, res) => {
    const id = Number(req.params.id);
    const sql = "DELETE FROM products WHERE id = ?";
    db.query(sql, [id], (err, result) => {
        if(err) {
            res.status(500).json({ message: 'Error!!', error:err});
        }else {
            res.status(200).json({ message: 'delete success!!'});
        }
    });
});
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

//search product name
app.get('/products/search/:keyword', (req, res) => {
    const keyword = req.params.keyword;
    const sql = "SELECT * FROM products WHERE name LIKE ?";
    db.query(sql, [`%${keyword}%`], (err, result) => {
        if(err) {
            res.status(500).json({ message: 'Error!!', error:err});
        }else {
            res.status(200).json(result);
        }
    });
});
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

//Error Handling Middleware
app.use((err, req, res, next) =>{
    console.error(err.stack);
    // res.status(500).send('Something broke?');
    res.status(500).json({
        message:'Internal Server Error',
        error: err.message
    });
});


app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}/products`);
  });