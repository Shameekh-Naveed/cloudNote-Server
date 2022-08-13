const mongoose = require('mongoose');
const mongoURI = "mongodb://localhost:27017/iNotebook?";

const connectToMongo = ()=>{
    mongoose.connect(mongoURI,()=>{
        console.log('connected to mongo successfully');
    })
}

const db = mongoose.connection
db.once('open', _ => {
  console.log('Database connected:', mongoURI)
})

db.on('error', err => {
  console.error('connection error:', err)
})



module.exports = connectToMongo;