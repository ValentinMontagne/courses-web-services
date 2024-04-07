const { MongoClient, ObjectId } = require("mongodb");
const express = require("express");
const z = require("zod");

const app = express();
const port = 8000;
// Connection URL
const url = "mongodb://localhost:27020";
const client = new MongoClient(url);
let db;

app.use(express.json());

app.post("/views", async (req, res) => {
  const { visitor } = req.body;

  const ack = await db.collection("views").insertOne({ visitor });

  res.send({
    _id: ack.insertedId,
    visitor,
  });
});

app.post("/actions", async (req, res) => {
  const { visitor } = req.body;

  const ack = await db.collection("actions").insertOne({ visitor });

  res.send({
    _id: ack.insertedId,
    visitor,
  });
});

app.post("/goals", async (req, res) => {
  const { goal, visitor } = req.body;

  const ack = await db.collection("goals").insertOne({ goal, visitor });

  res.send({
    _id: ack.insertedId,
    goal,
    visitor,
  });
});

app.get("/goals/:goalId/details", async (req, res) => {
  const result = await db
    .collection("goals")
    .aggregate([
      {
        $lookup: {
          from: "views",
          let: { goalVisitor: "$visitor" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$visitor", "$$goalVisitor"],
                },
              },
            },
          ],
          as: "associatedViews",
        },
      },
      {
        $lookup: {
          from: "actions",
          let: { goalVisitor: "$visitor" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$visitor", "$$goalVisitor"],
                },
              },
            },
          ],
          as: "associatedActions",
        },
      },
    ])
    .toArray();

  res.send(result);
});

// Init mongodb client connection
client.connect().then(() => {
  // Select db to use in mongodb
  db = client.db("myDBAnalytics");
  app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`);
  });
});
