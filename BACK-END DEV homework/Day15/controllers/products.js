const db = require("../db");
const express = require("express");

const app = express();

exports.getProductById = async (req, res) => {
  const id = Number(req.params.id);
  const sql = "SELECT * FROM products WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      res.status(500).json({
        message: "Error occurred while retrieving product.",
        error: err,
      });
    } else {
      if (result.length === 0) {
        res.status(404).json({ message: "Product not found." });
      } else {
        res
          .status(200)
          .json({ message: "Product retrieved successfully.", data: result });
      }
    }
  });
};

exports.getAllProducts = async (req, res) => {
  const sql = "SELECT * FROM products";
  db.query(sql, (err, result) => {
    if (err) {
      res.status(500).json({
        message: "Error occurred while retrieving products.",
        error: err,
      });
    } else {
      res.status(200).json(result);
    }
  });
};

exports.insertProduct = async (req, res) => {
  const product = req.body;
  const sql =
    "INSERT INTO products (name, price, discount, review_count, image_url) VALUES (?, ?, ?, ?, ?)";
  db.query(
    sql,
    [
      product.name,
      product.price,
      product.discount,
      product.review_count,
      product.image_url,
    ],
    (err, result) => {
      if (err) {
        res.status(500).json({
          message: "Error occurred while inserting product.",
          error: err,
        });
      } else {
        res.status(201).json({ message: "Product inserted successfully." });
      }
    }
  );
};

exports.updateProduct = async (req, res) => {
  const id = Number(req.params.id);
  const product = req.body;
  const sql =
    "UPDATE products SET name = ?, price = ?, discount = ?, review_count = ?, image_url = ? WHERE id = ?";
  db.query(
    sql,
    [
      product.name,
      product.price,
      product.discount,
      product.review_count,
      product.image_url,
      id,
    ],
    (err, result) => {
      if (err) {
        res.status(500).json({
          message: "Error occurred while updating product.",
          error: err,
        });
      } else {
        res.status(200).json({ message: "Product updated successfully." });
      }
    }
  );
};

exports.deleteProduct = async (req, res) => {
  const id = Number(req.params.id);
  const sql = "DELETE FROM products WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      res.status(500).json({
        message: "Error occurred while deleting product.",
        error: err,
      });
    } else {
      res.status(200).json({ message: "Product deleted successfully." });
    }
  });
};

exports.searchProducts = async (req, res) => {
  const keyword = req.params.keyword;
  const sql = "SELECT * FROM products WHERE name LIKE ?";
  db.query(sql, [`%${keyword}%`], (err, result) => {
    if (err) {
      res.status(500).json({
        message: "Error occurred while retrieving products.",
        error: err,
      });
    } else {
      res.status(200).json(result);
    }
  });
};
