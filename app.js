const express = require("express");

const app = express();

const bodyParser = require("body-parser");
const mongodb = require("mongodb");
const mongoClient = mongodb.MongoClient;
const url =
  "mongodb+srv://pran34:praneeth7474292@assign-mentor.xutey.mongodb.net/test?retryWrites=true&w=majority";
const cors = require("cors");

app.use(
  cors({
    origin: "https://condescending-poincare-9e23ea.netlify.app/",
  })
);

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("welcome");
});
app.get("/students", async (req, res) => {
  try {
    let client = await mongoClient.connect(url);
    let db = client.db("test");
    let studentsList = await db.collection("students").find().toArray();
    client.close();
    res.json(studentsList);
  } catch (error) {
    res.json("something went wrong with error" + error);
  }
});
app.post("/student", async (req, res) => {
  try {
    let client = await mongoClient.connect(url);
    let db = client.db("test");
    let insertedStudent = await db
      .collection("students")
      .insertOne({ name: req.body.name, mentor: req.body.mentor });
    client.close();
    res.json({
      message: "student created",
      id: insertedStudent.insertedId,
    });
  } catch (error) {
    res.json("something went wrong with error" + error);
  }
});
app.get("/student/:id", async (req, res) => {
  try {
    let client = await mongoClient.connect(url);
    let db = client.db("test");
    let studet = await db
      .collection("students")
      .findOne({ _id: mongodb.ObjectId(req.params.id) });
    client.close();
    if (studet) {
      res.json(studet);
    } else {
      res.json({
        message: "no data match",
      });
    }
  } catch (error) {
    res.json("something went wrong with error" + error);
  }
});

app.put("/student/:id", async (req, res) => {
  try {
    let client = await mongoClient.connect(url);
    let db = client.db("test");
    let student = await db
      .collection("students")
      .findOneAndUpdate(
        { _id: mongodb.ObjectId(req.params.id) },
        { $set: { name: req.body.name, mentor: req.body.mentor } }
      );
    client.close();
    res.json(student);
  } catch (error) {
    res.json("something went wrong with error" + error);
  }
});
app.delete("/student/:id", async (req, res) => {
  try {
    let client = await mongoClient.connect(url);
    let db = client.db("test");
    await db
      .collection("students")
      .findOneAndDelete({ _id: mongodb.ObjectId(req.params.id) });
    client.close();
    res.json("student deleted");
  } catch (error) {
    res.json("something went wrong with error" + error);
  }
});

app.listen(process.env.PORT || 3030, () => {});
