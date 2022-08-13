const mongoose = require("mongoose");
const mongoURI =
  "mongodb+srv://shameekh:xZ7i4yLi9FDWjSG@cluster0.tepq9bp.mongodb.net/?retryWrites=true&w=majority";

const connectToMongo = () => {
  mongoose.connect(
    mongoURI,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    () => {
      console.log("connected to mongo successfully");
    }
  );
};

const db = mongoose.connection;
db.once("open", (_) => {
  console.log("Database connected:", mongoURI);
});

db.on("error", (err) => {
  console.error("connection error:", err);
});

module.exports = connectToMongo;

//
// const { MongoClient, ServerApiVersion } = require('mongodb');
// const uri = "mongodb+srv://shameekh:<password>@cluster0.tepq9bp.mongodb.net/?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });
