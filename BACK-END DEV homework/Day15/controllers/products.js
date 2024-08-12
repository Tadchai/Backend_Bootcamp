const db = require("../db");

//Products
exports.getAllProducts = async (req, res) => {
  const query = 'SELECT * FROM Products';
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching products:', err);
      return res.status(500).json({ error: 'Failed to fetch products' });
    }

    res.status(200).json({
      message: 'Products retrieved successfully',
      products: results,
    });
  });
};


exports.insertProduct = async (req, res) => {
  const { Product_Name, Price, Description, Quantity } = req.body;

  if (!Product_Name || !Price || !Description || !Quantity) {
    return res.status(400).json({ error: 'Invalid request. All fields are required.' });
  }

  const query = 'INSERT INTO Products (Product_Name, Price, Description, Quantity) VALUES (?, ?, ?, ?)';
  db.query(query, [Product_Name, Price, Description, Quantity], (err, result) => {
    if (err) {
      console.error('Error inserting product:', err);
      return res.status(500).json({ error: 'Failed to insert product' });
    }

    res.status(201).json({ 
      message: 'Product created successfully',
      id: result.insertId, 
      Product_Name, 
      Price, 
      Description, 
      Quantity 
    });
  });
};

exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, price, description, quantity } = req.body;

  if (!id || !name || !price || !description || !quantity) {
    return res.status(400).json({ error: 'Invalid request. All fields are required.' });
  }

  const query = 'UPDATE Products SET Product_Name = ?, Price = ?, Description = ?, Quantity = ? WHERE Product_ID = ?';
  db.query(query, [name, price, description, quantity, id], (err, result) => {
    if (err) {
      console.error('Error updating product:', err);
      return res.status(500).json({ error: 'Failed to update product' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json({ 
      message: 'Product updated successfully',
      id, 
      name, 
      price, 
      description, 
      quantity 
    });
  });
};

exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM Products WHERE Product_ID = ?';

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error deleting product:', err);
      return res.status(500).json({ error: 'Failed to delete product' });
    }

    // Check if the product was found and deleted
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json({ message: 'Product deleted successfully' });
  });
};


//Orders
exports.insertOrder = async (req, res) => {
  const { Order_Date, Order_Status, Product_ID, User_ID } = req.body;

  if (!Order_Date || !Order_Status || !Product_ID || !User_ID) {
    return res.status(400).json({ error: 'Invalid request. All fields are required.'});
  }

  const sql = 'INSERT INTO Orders (Order_Date, Order_Status, Product_ID, User_ID) VALUES (?, ?, ?, ?)';
  
  db.query(sql, [Order_Date, Order_Status, Product_ID, User_ID], (err, result) => {
    if (err) {
      console.error('Error inserting order:', err);
      return res.status(500).json({ error: 'Failed to insert order' });
    }

    res.status(201).json({ 
      message: 'Order created successfully',
      order_id: result.insertId 
    });
  });
};

exports.getOrderById = async (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM Orders WHERE Ordes_ID = ?';

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error fetching order:', err);
      res.status(500).send('Error fetching order');
      return;
    }

    if (result.length === 0) {
      res.status(404).send('The order was not found');
      return;
    }

    res.status(200).send(result[0]);
  });
};
