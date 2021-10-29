const express = require("express");
const cors = require("cors");
const { MongoClient } = require('mongodb');
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
        const toursCollections = database.collection("tours");
        const newsCollections = database.collection("news");

        //GET API load all packages data
        app.get("/tours", async (req, res) => {
            const result = await toursCollections.find({}).toArray();
            res.send(result);
        });
        //GET API load all news data
        app.get("/news", async (req, res) => {
            const result = await newsCollections.find({}).toArray();
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
