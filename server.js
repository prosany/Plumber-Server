const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

// Define Port Number
const port = process.env.PORT || 8080;

// Use Cors and bodyParser
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World')
});





app.listen(port, () => {
    console.log(`App Listening at http://localhost:${port}`)
});