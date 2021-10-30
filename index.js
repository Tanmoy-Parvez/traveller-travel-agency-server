const express = require("express");
const cors = require("cors");
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wh888.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();
        const database = client.db("travelAgency")
        const toursCollection = database.collection("tours");
        const newsCollection = database.collection("news");
        const bookingCollection = database.collection("bookings");

        //GET API load all packages data
        app.get("/tours", async (req, res) => {
            const result = await toursCollection.find({}).toArray();
            res.send(result);
        });
        app.get("/tour/:id", async (req, res) => {
            const id = req.params.id;
            const result = await toursCollection.findOne({ _id: ObjectId(id) });
            res.send(result);
        });
        app.post("/add", async (req, res) => {
            const newTour = req.body;
            const result = await toursCollection.insertOne(newTour);
            res.send(result);
        });
        //GET API load all news data
        app.get("/news", async (req, res) => {
            const result = await newsCollection.find({}).toArray();
            res.send(result);
        });

        //
        app.post("/booking", async (req, res) => {
            const tour = req.body;
            const result = await bookingCollection.insertOne(tour);
            res.send(result);
        });

        //GET API load all news data
        app.get("/myBookings/:email", async (req, res) => {
            const email = req.params.email
            const result = await bookingCollection.find({ email: (email) }).toArray();
            res.send(result);
        });

        // delete a single booking from myBookings
        app.delete("/myBookings/:id", async (req, res) => {
            const id = req.params.id
            const result = await bookingCollection.deleteOne({ _id: ObjectId(id) });
            res.send(result);
        });

        // delete a single booking from myBookings
        app.delete("/allBookings/:id", async (req, res) => {
            const id = req.params.id;
            const result = await bookingCollection.deleteOne({ _id: ObjectId(id) });
            res.send(result);
        });

        // load all bookings
        app.get("/allBookings", async (req, res) => {
            const result = await bookingCollection.find({}).toArray();
            res.send(result);
        });


    }
    finally {
        // await client.close()
    }
}
run().catch(console.dir)

app.get("/", (req, res) => {
    res.send("Getting successfully");
});

app.listen(port, () => {
    console.log("listening on port", port);
});
