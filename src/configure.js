const mongoose = require('mongoose');
const { type } = require('os');
const dotenv = require('dotenv');

dotenv.config();

const connect = mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 30000 // Increase timeout to 30 seconds
  });
connect.then(()=>{
    console.log('connect')
})
.catch(()=>{
    console.log('not connect')
})

const loginschema = new mongoose.Schema({
    Name:{
        type: String,
        required: false,
    },
    phone:{
        type: String,
        required: false,
    },
    email:{
        type: String,
        unique: true,
        required: false,
    },
    password:{
        type: String,
        required: false
    },
    blocked: {
         type: Boolean,
          default: false
    },
    googleId: {
        type: String,
        required: false
    },
    profileImage: String,
})

//collection part
const collection =  mongoose.model('data',loginschema);

module.exports = collection;
