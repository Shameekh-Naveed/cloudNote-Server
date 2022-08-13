require('dotenv').config();
const mongoose = require("mongoose");


const connectToMongo = () => {
  mongoose.connect(
    process.env.REACT_APP_mongoURI,
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
  console.log("Database connected:");
  
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
