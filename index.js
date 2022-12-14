const connectToMongo = require("./db");
const express = require("express");
var cors = require('cors')

connectToMongo();

// console.log(process.env.REACT_APP_mongoURI)


const app = express();
const port = 5000;

 
app.use(cors())
app.use(express.json());

// Available Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));

// app.get('/', (req, res) => {
//   res.send('Hello Worlds!')
// })

app.listen(process.env.PORT || port, () => {
  console.log(`Example app listening on port ${port}`);
});
