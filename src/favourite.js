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

const FavouriteSchema = new mongoose.Schema({
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
    imagePath1:{
        type: String,
        
    },
    user_id: mongoose.Schema.Types.ObjectId,
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
});

const Favourite = mongoose.model('Favourite', FavouriteSchema);

module.exports = Favourite;