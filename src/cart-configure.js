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

const CartSchema = new mongoose.Schema({
    product:{
        type: String,
        required: true,
    },
    model:{
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true
    },
    discountPercentage:{
        type: Number,
        required: true
    },
    Color: {
        type: String,
         required: true
   },
    imagePath1:{
        type: String,
        
    },
    quantity: {
        type: Number,
        default: 1
    },
    fullname: String,
    address: String,
    phonenumber: String,
    city: String,
    state: String,
    zip: String,
    homework: String,
    alternatenumber:String,
    user_id: mongoose.Schema.Types.ObjectId,
    product:  mongoose.Schema.Types.ObjectId,
});

const Cart = mongoose.model('Cart', CartSchema);

module.exports = Cart;
