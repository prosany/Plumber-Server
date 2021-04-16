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


    // Check user using email
    app.get('/verify-email-address', (req, res) => {
        const verifyUserEmail = req.query.email;
        console.log(verifyUserEmail)
        usersCollection.find({ email: verifyUserEmail })
            .toArray((err, data) => {
                console.log('Eita ami',data)
                if(data === []){
                    res.send("email: nai@gmail.com")
                }else {
                    res.send(data)
                }
            })
    });

    // Create User Automatically
    app.post('/addNewUser', (req, res) => {
        console.log(req.body)
        const newUserDetails = req.body;
        usersCollection.insertOne(newUserDetails)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })
});




app.listen(port, () => {
    console.log(`App Listening at http://localhost:${port}`)
});