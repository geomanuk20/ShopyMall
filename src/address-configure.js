const mongoose = require('mongoose')
const dotenv = require('dotenv');

dotenv.config();
const connect = mongoose.connect(process.env.MONGO_URI);

connect.then(()=>{
    console.log('connect')
})
.catch(()=>{
    console.log('not connect')
})

const AddressSchema = new mongoose.Schema({
    fullname: String,
    address: String,
    phonenumber: String,
    city: String,
    state: String,
    zip: String,
    homework: String,
    alternatenumber:String,
    user_id: mongoose.Schema.Types.ObjectId,
});

const Address = mongoose.model('Address', AddressSchema);

module.exports = Address;
