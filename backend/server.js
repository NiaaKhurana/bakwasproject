const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const e = require("express");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const SECRET_KEY = 'your_secret_key';

// MySQL connection
const connection = mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: '1508',
    database: 'niaa'
});

connection.connect(err => {
    if (err) throw err;
    console.log('Database connected!');
});

// Middleware to check token
const verifyToken = (req, res, next) => {
    const token = req.headers['x-access-token'];
    if (!token) return res.status(403).send({ auth: false, message: 'No token provided.' });

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        req.userId = decoded.id;
        next();
    });
};

app.post('/api/register', async (req, res) => {
    const { username, password, role } = req.body;
    console.log(req.body)
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword)
    try {
        const rows = await connection.execute(
            'INSERT INTO Users (username, password, role) VALUES (?, ?, ?)',
            [username, hashedPassword, role]
        );
        res.status(201).json({ message: 'User registered successfully!' });
    } catch (error) {
        console.error(error);
        // Handle the error appropriately
        res.status(500).json({ error: 'User registration failed!' });
    }
});

// User login
app.post('/api/login', (req, res) => {
    const { id, password } = req.body;
    console.log(id,password)
    connection.query('SELECT * FROM Users WHERE username = ?', [id], (err, results) => {
        console.log(err);
        console.log(results)
        if (err) return res.status(500).send('Error on the server.');
        if (results.length === 0) return res.status(404).send('No user found.');

        const user = results[0];
        const passwordIsValid = bcrypt.compareSync(password, user.password);
        if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });

        const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: 86400 }); // expires in 24 hours
        console.log(token)
        res.status(200).send({ auth: true, token: token });
    });
});

// Get list of databases
app.get('/api/databases', verifyToken, (req, res) => {
    // In this case, it returns only one database
    connection.query('SHOW TABLES', (err, results) => {
        if (err) return res.status(500).send(err);
        let databases = [];
        results.forEach(row => {
            databases.push({"name": row.Tables_in_niaa})
        });
        let filteredArray = databases.filter(val => !["Users", "UID_Sequence"].includes(val.name))
        console.log(filteredArray)
        res.status(200).send(filteredArray);
    });
    // res.status(200).send([{ name: 'Principal_Database' }]);
});

// Get paginated entries
app.get('/api/:database', verifyToken, (req, res) => {
    const { database } = req.params;
    const { page, limit } = req.query;
    const offset = (page - 1) * limit;
    console.log("IN DATABASE");
    connection.query(`SELECT * FROM ${database} LIMIT ? OFFSET ?`, [ parseInt(limit), parseInt(offset)], (err, results) => {
        if (err) return res.status(500).send(err);
        res.status(200).send(results);
    });
});

// Get Structure
app.get('/structure/columns/:database',verifyToken, (req, res) => {
    const {database} = req.params;
    connection.query(`DESCRIBE ${database}`, (err, results) => {
        console.log(err)
        console.log(results)
        if (err) return res.status(500).send(err);
        res.status(200).send(results);
    });
})
app.get('/api/:database/:id', verifyToken, (req, res) => {
    const { database, id } = req.params;
    connection.query(`SELECT * FROM ${database} WHERE id = ?`, [ id], (err, results) => {
        if (err) return res.status(500).send(err);
        res.status(200).send(results);
    });
});

// Insert new entry
app.post('/api/:database', verifyToken, (req, res) => {
    const newEntry = req.body;
    connection.query(`INSERT INTO ${req.params.database} SET ?`, [ newEntry], (err, results) => {
        if (err) return res.status(500).send(err);
        res.status(201).send(results);
    });
});

// Update entry
app.put('/api/:database/:id', verifyToken, (req, res) => {
    const updatedEntry = req.body;
    connection.query(`UPDATE ${req.params.database} SET ? WHERE id = ?`, [ updatedEntry, req.params.id], (err, results) => {
        if (err) return res.status(500).send(err);
        res.status(200).send(results);
    });
});

// Delete entry
app.delete('/api/:database/:id', verifyToken, (req, res) => {
    connection.query(`DELETE FROM ${req.params.database} WHERE id = ?`, [ req.params.id], (err, results) => {
        if (err) return res.status(500).send(err);
        res.status(200).send(results);
    });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});

