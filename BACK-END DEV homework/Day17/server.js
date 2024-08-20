const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient, ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const redis = require('redis');
require('dotenv').config();

const uri = "mongodb://localhost:27017";
const app = express();
const redisClient = redis.createClient();

app.use(bodyParser.json());

// ฟังก์ชันเช็คข้อมูลใน Redis
const checkCache = (req, res, next) => {
    const { id } = req.params;
    redisClient.get(id, (err, data) => {
        if (err) throw err;
        if (data) {
            res.send(JSON.parse(data));
        } else {
            next();
        }
    });
};

//register
app.post('/register', async (req, res) => {
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const database = client.db('mydb');
        const collection = database.collection('users');
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = { username: req.body.username, password: hashedPassword };
        const result = await collection.insertOne(user);
        res.send(result);
    } catch (error) {
        console.log(error);
        res.send({ error: 'An error has occurred' });
    } finally {
        await client.close();
    }
});

//login
app.post('/login', checkCache, async (req, res) => {
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const database = client.db('mydb');
        const collection = database.collection('users');
        const user = await collection.findOne({ username: req.body.username });
        if (user && await bcrypt.compare(req.body.password, user.password)) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

            // เก็บข้อมูล user ใน Redis
            redisClient.set(user._id.toString(), 3600, JSON.stringify(user));

            res.send({ message: 'Login successful', token });
        } else {
            res.status(401).send({ message: 'Login failed' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ error: 'An error has occurred' });
    } finally {
        await client.close();
    }
});

// ดูรายการสินค้า
app.get('/products', async (req, res) => {
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const database = client.db('mydb');
        const collection = database.collection('products');
        const products = await collection.find().toArray();
        res.send(products);
    } catch (error) {
        console.log(error);
        res.send({ error: 'An error has occurred' });
    } finally {
        await client.close();
    }
});

// เพิ่มสินค้า
app.post('/products', async (req, res) => {
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const database = client.db('mydb');
        const collection = database.collection('products');
        const product = {
            name: req.body.name,
            price: req.body.price,
        };
        const result = await collection.insertOne(product);
        res.send(result);
    } catch (error) {
        console.log(error);
        res.status(500).send({ error: 'An error has occurred' });
    } finally {
        await client.close();
    }
});

// ค้นหาสินค้าโดยใช้ ID
app.get('/products/:id', checkCache, async (req, res) => {
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const database = client.db('mydb');
        const collection = database.collection('products');

        const { id } = req.params;
        const product = await collection.findOne({ _id: new ObjectId(id) });

        if (product) {
            // เก็บข้อมูลสินค้าใน Redis
            redisClient.set(id, JSON.stringify(product), { EX: 3600 });
            res.send(product);
        } else {
            res.status(404).send({ message: 'Product not found' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ error: 'An error has occurred' });
    } finally {
        await client.close();
    }
});





app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
