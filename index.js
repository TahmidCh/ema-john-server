const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()



const app = express()

app.use(bodyParser.json());
app.use(cors());

const port = 5000




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fbsgn.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
console.log(process.env.DB_NAME, process.env.DB_PASS, process.env.DB_USER);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const productsCollection = client.db("emaJohnStore").collection("products");

    app.post('/addProduct', (req, res) => {
        const products = req.body;
        productsCollection.insertMany(products)
            .then(result => {
                console.log(result);
                console.log(result.insertedCount);
                res.send(result.insertedCount)
            })
            .catch(e = () => {
                console.log('error');
            })
    })
    app.get('/', (req, res) => {
        res.send('Hello World!')
    })

    app.get('/products', (req, res) => {
        productsCollection.find({}).limit(20)
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    app.get('/product/:key', (req, res) => {
        productsCollection.find({ key: req.params.key })
            .toArray((err, documents) => {
                res.send(documents[0]);
            })
    })

});


app.listen(process.env.PORT || port)