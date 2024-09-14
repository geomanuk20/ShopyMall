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

const buySchema = new mongoose.Schema({
    product:{
        type: String,
        
    },
    model:{
        type: String,
       
    },
    price:{
        type: Number,
       
    },
    discountPercentage:{
        type: Number,
       
    },
    Color: {
        type: String,
        
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
    totalAmount: Number,
    paymentMethod: {
        type: String,
        enum: ['Cash On Delivery', 'Online Payment', 'EMI & Pay Later'],
      },
      date: {
        type: String,
        default: function() {
            const now = new Date();
            return now.toLocaleDateString('en-GB'); // Format: DD/MM/YYYY
        },
    },
    time: {
        type: String,
        default: function() {
            const now = new Date();
            return now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase(); // Format: HH:MM am/pm
        },
    },
    user_id: mongoose.Schema.Types.ObjectId,
    product:  mongoose.Schema.Types.ObjectId,
    address_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Address' } 
});

const Buy = mongoose.model('Buy', buySchema);

module.exports = Buy;
