const db = require("../db");
const express = require("express");

const app = express();

exports.getAllProducts = async (req, res) => {
  const query = 'SELECT * FROM Products';
  db.query(query, (err, results) => {
      if (err) throw err;
      res.json(results);
  });
};

exports.insertProduct = async  (req, res) => {
  const { name, price, description, quantity } = req.body;
  const query = 'INSERT INTO Products (Product_Name, Price, Description, Quantity) VALUES (?, ?, ?, ?)';
  db.query(query, [name, price, description, quantity], (err, result) => {
      if (err) throw err;
      res.json({ id: result.insertId, name, price, description, quantity });
  });
};


exports.updateProduct = async  (req, res) => {
  const { id } = req.params;
  const { name, price, description, quantity  } = req.body;
  const query = 'UPDATE Products SET Product_Name = ?, Price = ?, Description = ?, Quantity = ? WHERE Product_ID = ?';
  db.query(query, [ id, name, price, description, quantity ], (err) => {
      if (err) throw err;
      res.json({ id, name, price, description, quantity  });
  });
};

exports.deleteProduct = async  (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM Products WHERE Product_ID = ?';
  db.query(query, [id], err => {
      if (err) throw err;
      res.status(204).send();
  });
};

