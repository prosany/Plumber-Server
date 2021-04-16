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



// MongoDB Connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hgubw.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log(`${!!err ? 'Database Connection Failed' : 'Database Connection Successful'}`);
    const usersCollection = client.db("Plumbing").collection("users");
    const servicesCollection = client.db("Plumbing").collection("services");
    const ordersCollection = client.db("Plumbing").collection("orders");
    const reviewsCollection = client.db("Plumbing").collection("reviews");


    // Verify New and Previous User Email Address
    app.get('/verify-email-address', (req, res) => {
        const verifyUserEmail = req.query.email;
        console.log(verifyUserEmail)
        usersCollection.find({ email: verifyUserEmail })
            .toArray((err, data) => {
                console.log('Eita ami', data)
                res.send(data)
            })
    });

    // Create User Automatically if new and Save on DB
    app.post('/addNewUser', (req, res) => {
        console.log(req.body)
        const newUserDetails = req.body;
        usersCollection.insertOne(newUserDetails)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    });

    // Save Service on database
    app.post('/addService', (req, res) => {
        const newService = req.body;
        console.log('adding new event: ', newService)
        servicesCollection.insertOne(newService)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    });

    // Get Service from database
    app.get('/services', (req, res) => {
        servicesCollection.find()
        .toArray((err, items) => {
            res.send(items);
        })
    });

    // Get Service from Database using ID
    app.get('/order/:id', (req, res) => {
        const id = ObjectID(req.params.id);
        servicesCollection.find({_id: id})
        .toArray((err, product) => {
            res.send(product);
        })
    });


    // Save Review on database
    app.post('/addReview', (req, res) => {
        const newService = req.body;
        console.log('adding new event: ', newService)
        reviewsCollection.insertOne(newService)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    });

    // Get Review from database
    app.get('/reviews', (req, res) => {
        reviewsCollection.find()
        .toArray((err, items) => {
            res.send(items);
        })
    });


});




app.listen(port, () => {
    console.log(`App Listening at http://localhost:${port}`)
});