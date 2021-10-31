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

        //GET API load all tours data
        app.get("/tours", async (req, res) => {
            const result = await toursCollection.find({}).toArray();
            res.send(result);
        });

        //load a specific tour data by it's id
        app.get("/tour/:id", async (req, res) => {
            const id = req.params.id;
            const result = await toursCollection.findOne({ _id: ObjectId(id) });
            res.send(result);
        });

        //create or post a single tour 
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

        //book a tour 
        app.post("/booking", async (req, res) => {
            const tour = req.body;
            const result = await bookingCollection.insertOne(tour);
            res.send(result);
        });

        //GET API load my booking tours by my email
        app.get("/myBookings/:email", async (req, res) => {
            const email = req.params.email
            const result = await bookingCollection.find({ email: (email) }).toArray();
            res.send(result);
        });

        // delete a single booking from my bookings
        app.delete("/myBookings/:id", async (req, res) => {
            const id = req.params.id
            const result = await bookingCollection.deleteOne({ _id: ObjectId(id) });
            res.send(result);
        });


        // load all bookings
        app.get("/allBookings", async (req, res) => {
            const result = await bookingCollection.find({}).toArray();
            res.send(result);
        });

        // find specific data to update
        app.get("/allBookings/:id", async (req, res) => {
            const id = req.params.id;
            const result = await bookingCollection.findOne({ _id: ObjectId(id) });
            res.send(result);
        });
        // update Status
        app.put("/allBookings/:id", async (req, res) => {
            const id = req.params.id;
            const updateStatus = req.body;
            const filter = { _id: ObjectId(id) };
            const updateDoc = {
                $set: {
                    status: updateStatus.status,
                },
            };
            const result = await bookingCollection.updateOne(
                filter,
                updateDoc,
            );
            res.json(result);
        });

        // delete a single booking from all bookings
        app.delete("/allBookings/:id", async (req, res) => {
            const id = req.params.id;
            const result = await bookingCollection.deleteOne({ _id: ObjectId(id) });
            res.send(result);
        });

    }
    finally {
        // await client.close()
    }
}
run().catch(console.dir)

app.get("/", (req, res) => {
    res.send("Server is running successfully");
});

app.listen(port, () => {
    console.log("listening on port", port);
});
