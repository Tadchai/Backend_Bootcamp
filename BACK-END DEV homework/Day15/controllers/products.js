const db = require("../db");
const express = require("express");

const app = express();

exports.getAllProducts = async (req, res) => {
  const query = 'SELECT * FROM Products';
  db.query(query, (err, results) => {
    if (err) {
        console.error('Error fetching products:', err);
        res.status(500).json({ error: 'Failed to fetch products' });
        return;
    }
    res.json(results);
});
};

exports.insertProduct = async (req, res) => {
  const { Product_Name, Price, Description, Quantity } = req.body;
  const query = 'INSERT INTO Products (Product_Name, Price, Description, Quantity) VALUES (?, ?, ?, ?)';
  db.query(query, [Product_Name, Price, Description, Quantity], (err, result) => {
    if (err) {
      console.error('Error inserting product:', err);
      res.status(500).json({ error: 'Failed to insert product' });
      return;
    }
    res.json({ id: result.insertId, Product_Name, Price, Description, Quantity });
  });
};



exports.updateProduct = async  (req, res) => {
  const { id } = req.params;
  const { name, price, description, quantity  } = req.body;
  const query = 'UPDATE Products SET Product_Name = ?, Price = ?, Description = ?, Quantity = ? WHERE Product_ID = ?';
  db.query(query, [ id, name, price, description, quantity ], (err) => {
    if (err) {
      console.error('Error updating product:', err);
      res.status(500).json({ error: 'Failed to update product' });
      return;
    }
    res.json({ id, name, price, description, quantity  });
  });
};

exports.deleteProduct = async  (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM Products WHERE Product_ID = ?';
  db.query(query, [id], err => {
    if (err) {
      console.error('Error deleting product:', err);
      res.status(500).json({ error: 'Failed to delete product' });
      return;
    }
    res.status(204).send();
  });
};

//Orders
exports.insertOrder = async (req, res) => {
  const { order_date, order_status, product_id, user_id } = req.body;
  const sql = 'INSERT INTO Orders (Order_Date, Order_Status, Product_ID, User_ID) VALUES (?, ?, ?, ?)';
  
  db.query(sql, [order_date, order_status, product_id, user_id], (err, result) => {
    if (err) {
      console.error('Error inserting order:', err);
      res.status(500).send('Error inserting order');
      return;
    }
    res.status(201).send({ order_id: result.insertId });
  });
};

exports.getOrderById = async (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM Orders WHERE Order_ID = ?';

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error fetching order:', err);
      res.status(500).send('Error fetching order');
      return;
    }
    res.status(200).send(result[0]);
  });
};
