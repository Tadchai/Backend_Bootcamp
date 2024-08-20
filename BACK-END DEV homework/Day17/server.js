const express = require('express');
const redis = require('redis');
const { MongoClient, ObjectId } = require("mongodb");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const uri = "mongodb://localhost:27017";
const app = express();
const PORT = 3000;
const REDIS_PORT = 6379;

// สร้าง Redis client และเชื่อมต่อ
const client = redis.createClient(REDIS_PORT);

client.on('error', (err) => {
    console.error('Redis Client Error', err);
});

client.connect().then(() => {
    console.log('Connected to Redis');
}).catch(err => {
    console.error('Could not connect to Redis', err);
});

// สร้าง MongoDB client
const mongo = new MongoClient(uri);

mongo.connect().then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Error connecting to MongoDB:', err);
});

app.use(express.json());

const User = mongo.db("mydb").collection("users");
const Product = mongo.db("mydb").collection("products");

// ฟังก์ชันสมัครสมาชิก
app.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = { username, password: hashedPassword };
        const result = await User.insertOne(newUser);
        res.status(201).send({ message: 'User registered successfully', userId: result.insertedId });
    } catch (err) {
        console.error('Error registering user', err);
        res.status(500).send('Error registering user');
    }
});

// ฟังก์ชันเข้าสู่ระบบ
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (user && await bcrypt.compare(password, user.password)) {
            const token = jwt.sign({ id: user._id }, 'your_jwt_secret', { expiresIn: '1h' });
            res.send({ message: 'Login successful', token });
        } else {
            res.status(401).send('Invalid username or password');
        }
    } catch (err) {
        console.error('Error logging in', err);
        res.status(500).send('Error logging in');
    }
});

// ฟังก์ชันดูรายการสินค้า
app.get('/products', async (req, res) => {
    try {
        const products = await Product.find().toArray();
        res.send(products);
    } catch (err) {
        console.error('Error fetching products', err);
        res.status(500).send('Error fetching products');
    }
});

// ฟังก์ชันเพิ่มรายการสินค้า
app.post('/products', async (req, res) => {
    try {
        const { name, price } = req.body;
        const newProduct = { name, price };
        const result = await Product.insertOne(newProduct);
        res.status(201).send({ message: 'Product added successfully', productId: result.insertedId });
    } catch (err) {
        console.error('Error adding product', err);
        res.status(500).send('Error adding product');
    }
});

// ฟังก์ชันค้นหารายการสินค้า
app.get('/products/:id', async (req, res) => {
    const productId = req.params.id;
    const redisKey = `product:${productId}`;

    try {
        const cachedData = await client.get(redisKey);

        if (cachedData) {
            return res.send(JSON.parse(cachedData));
        } else {
            const product = await Product.findOne({ _id: new ObjectId(productId) });

            if (product) {
                await client.setEx(redisKey, 3600, JSON.stringify(product));
                return res.send(product);
            } else {
                return res.status(404).send('Product not found');
            }
        }
    } catch (err) {
        console.error('Error fetching product or caching', err);
        return res.status(500).send('Internal Server Error');
    }
});

//ตัวอย่าง
app.get('/user/:username', async (req, res) => {
    const username = req.params.username;                     
    const redisKey = `user:${username}`; 
    try {
      const cachedData = await client.get(redisKey);
  
      if (cachedData) {
        // มี cache = ใช้ cache ก่อนไปเลย
        return res.send(JSON.parse(cachedData));
      }else{
        // User data not found in cache, fetch from MySQL
        const user = await User.findOne({ username: username });
        // Store user data in Redis cache
        await client.set(redisKey, JSON.stringify(user));
        //await client.setEx(redisKey, 3600, JSON.stringify(user));
        res.json(user);
      }
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "An error occurred" });
    }
  });

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});
