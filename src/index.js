require('dotenv').config()  // env
const express = require('express')
const mongoose = require('mongoose');
const path = require('path')
const bcrypt = require('bcrypt')
const multer = require('multer');
const session = require('express-session')
const flash = require('connect-flash');
const bodyParser = require('body-parser');
const collection = require('./configure')
const Address = require('./address-configure')
const Product = require('./configure_product');
const Cart = require('./cart-configure');
const Buy = require('./buy-configure')
const payment = require('./paymentmode')
const Favourite = require('./favourite')
const { title } = require('process')
const { name } = require('ejs');
const passport = require('passport');

const app = express()

require('./config/passport')(passport);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

const SECRET = process.env.SECRET;
const PORT = process.env.PORT || 3011;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
// routes prefix
app.use('',require('../routes/routes'))
app.use('',require('../routes/product'))
// Middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use("/public", express.static('public'));
app.use("/uploads", express.static('uploads'));


// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', require('../routes/auth'));

app.use(flash());

// Make flash messages available in views
app.use((req, res, next) => {
    res.locals.alert = req.flash('alert');
    next();
});

app.use(
    session({
        secret: SECRET,
        saveUninitialized: true,
        resave:false,
        cookie: { secure: false },
    })
)
app.use((req,res,next)=>{
    res.locals.message = req.session.message;
    delete req.session.message;
    next()
})
// Middleware to check if the user is authenticated
const authenticateUser = (req, res, next) => {
    if (req.session && req.session.authenticated) {
      return next();
    } else {
      res.redirect('/login');
    }
  };


// Middleware to check if the user is authenticated
const authenticate = (req, res, next) => {
    if (req.session && req.session.authenticated) {
      return next();
    } else {
      res.redirect('/');
    }
  };

// Routes
app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/signup', (req, res) => {
    res.render('signup');
});

app.get('/admin', (req, res) => {
    res.render('admin');
});

app.get('/', authenticateUser, (req, res) => {
    res.render('/');
});

app.get('/forgot-password', (req, res) => {
    res.render('forgot-password');
});

app.get('/adminhome', (req, res) => {
    res.render('adminhome');
});

app.get('/admin_product', async (req, res) => {
  try {
      const products = await Product.find();
      const brands = products.map(product => product.brand); // Extract brands
      res.render('admin_product', { products, brands });
  } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
  }
});

app.get('/admin-mobile', async (req, res) => {
  try {
      const products = await Product.find({ category: 'mobile' });
      const brands = products.map(product => product.brand); // Extract brands
      res.render('admin-mobile', { products, brands });
  } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
  }
});

app.get('/admin-watch', async (req, res) => {
  try {
      const products = await Product.find({ category: 'watch' });
      const brands = products.map(product => product.brand); // Extract brands
      res.render('admin-watch', { products, brands });
  } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
  }
});

app.get('/admin-earphone', async (req, res) => {
  try {
      const products = await Product.find({ category: 'earPhone' });
      const brands = products.map(product => product.brand); // Extract brands
      res.render('admin-earphone', { products, brands });
  } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
  }
});

app.get('/admin-speaker', async (req, res) => {
  try {
      const products = await Product.find({ category: 'speaker' });
      const brands = products.map(product => product.brand); // Extract brands
      res.render('admin-speaker', { products, brands });
  } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
  }
});

app.get('/admin-charger', async (req, res) => {
  try {
      const products = await Product.find({ category: 'charger' });
      const brands = products.map(product => product.brand); // Extract brands
      res.render('admin-charger', { products, brands });
  } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
  }
});

app.get('/admin-storagedevice', async (req, res) => {
  try {
      const products = await Product.find({ category: 'storagedevice' });
      const brands = products.map(product => product.brand); // Extract brands
      res.render('admin-storagedevice', { products, brands });
  } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
  }
});

app.get('/admin-powerbank', async (req, res) => {
  try {
      const products = await Product.find({ category: 'powerbank' });
      const brands = products.map(product => product.brand); // Extract brands
      res.render('admin-powerbank', { products, brands });
  } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
  }
});

app.get('/admin-smartpoint', async (req, res) => {
  try {
    const address = await Address.find();
      const products = await Product.find({ category: 'smartpoint' });
      const brands = products.map(product => product.brand); // Extract brands
      res.render('admin-smartpoint', { products, brands,address });
  } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
  }
});

app.get('/admin-cart', async (req, res) => {
  try {
      const carts = await Cart.find();
      res.render('admin-cart', { title: 'Admin Cart', carts: carts });
  } catch (err) {
      console.error(err);
      res.status(500).send('Error fetching user address');
  }
});

app.get('/admin-buy', async (req, res) => {
  try {
      const buy = await Buy.find();
      res.render('admin-buy', { title: 'Admin buy', buy: buy });
  } catch (err) {
      console.error(err);
      res.status(500).send('Error fetching user address');
  }
});
app.get('/admin-checkout', async (req, res) => {
  try {
      const pay = await payment.find();
      res.render('admin-checkout', { title: 'admin-checkout', pay: pay });
  } catch (err) {
      console.error(err);
      res.status(500).send('Error fetching user address');
  }
});

app.get('/admin-favourite', async (req, res) => {
  try {
      const favourite = await Favourite.find();
      res.render('admin-favourite', { title: 'Admin Cart', favourite: favourite });
  } catch (err) {
      console.error(err);
      res.status(500).send('Error fetching user address');
  }
});

app.get('/', (req, res) => {
  res.send('Welcome! <a href="/auth/google">Login with Google</a>');
});

// signup

app.post('/signup', async (req, res) => {
  const data = {
      Name: req.body.Name,
      phone: req.body.phone,
      email: req.body.email,
      password: req.body.password,
      repassword: req.body.repassword,
  };

  if (data.password !== data.repassword) {
      res.render('signup', { alert: { type: 'danger', message: 'Passwords do not match. Please try again.' } });
  } else {
      const existingUser = await collection.findOne({ email: data.email });
      if (existingUser) {
          res.render('signup', { alert: { type: 'danger', message: 'User already exists' } });
      } else {
          const salt = 10;
          const hashPassword = await bcrypt.hash(data.password, salt);
          data.password = hashPassword;

          await collection.insertMany(data);  // Use insertOne instead of insertMany for a single document
          res.render('login', { alert: { type: 'success', message: 'User registered successfully.' } });
      }
  }
});


//login user

app.post('/login', async (req, res) => {
  try {
      const check = await collection.findOne({ email: req.body.email });
      if (!check) {
          res.render('login', { alert: { type: 'danger', message: 'Username not found' } });
          return;
      }

      const passwordMatch = await bcrypt.compare(req.body.password, check.password);
      if (passwordMatch) {
          req.session.user = { Name: check.Name, phone: check.phone, email: check.email, _id: check._id };
          res.redirect('/home');  // Redirect to home after successful login
      } else {
          res.render('login', { alert: { type: 'danger', message: 'Wrong password' } });
      }
  } catch (error) {
      console.error(error);
      res.render('login', { alert: { type: 'danger', message: 'Internal server error' } });
  }
});


app.get('/home', async (req, res) => {
  try {
    const user = req.user;
    const products = await Product.find();
    const carts = req.session.user ? await Cart.find({ user_id: req.session.user._id }) : []; // Return an empty array if user is not authenticated
    const favoriteItems = req.session.user  ? await Favourite.find({ user_id: req.session.user._id }) : []; // Return an empty array if user is not authenticated

    // Calculate total products in cart
    const totalProductsInCart = carts.reduce((total, item) => total + item.quantity, 0);
    const displayName = user && user.Name ? user.Name : '';
    // Render the home page with data
    res.render('home', {
      title: 'SHOPY MALL',
      Name: req.session.user ? req.session.user.Name : displayName,
      products: products,
      carts: carts,
      favoriteItems: favoriteItems,
      totalProductsInCart,
    });
  } catch (err) {
    // Log the error and send a response
    console.error('Error fetching data for /home route:', err);
    res.render('home', { alert: { type: 'danger', message: 'Wrong password' } });
  }
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated() && req.session.user) {
    return next();
  } else {
    res.redirect('/login');
  }
}

app.get('/user-profile', async (req, res) => {
  try {
    const user = req.session.user;

    if (!user || !user._id) {
      return res.redirect('/login');
    }

    // Pagination setup
    const perPage = 3; // Number of items per page
    const page = req.query.page || 1; // Current page number

    // Retrieve the total count of payment entries
    const totalPayments = await payment.countDocuments({ user_id: user._id });

    // Fetch the payments for the current page
    const carts = await Cart.find({ user_id: req.session.user._id });
    const products = await Product.find();
    const payments = await payment.find({ user_id: user._id })
      .skip((perPage * page) - perPage)
      .limit(perPage);

    // Calculate the total number of pages
    const totalPages = Math.ceil(totalPayments / perPage);

    // Calculate total products in cart
    const totalProductsInCart = carts.reduce((total, item) => total + item.quantity, 0);

    // Determine displayName (use `user.Name` if available)
    const displayName = user && user.Name ? user.Name : '';

    res.render('user-profile', {
      title: 'Profile',
      Name: req.session.user ? req.session.user.Name : displayName, // Use the determined displayName here
      payments: payments,
      carts: carts,
      currentPage: page,
      totalPages: totalPages,
      totalProductsInCart,
      products: products,
    });
  } catch (err) {
    console.error('Error retrieving user profile:', err);
    res.status(500).send('Error retrieving user profile');
  }
});



app.get('/user-personal-information', async(req,res)=>{
    const user = req.session.user;
    const carts = await Cart.find({ user_id: req.session.user._id });
    const products = await Product.find(); 
    const totalProductsInCart = carts.reduce((total, item) => total + item.quantity, 0);
    res.render('user-personal-information',{
        title : 'Account',
        carts:carts,
        Name:user.Name,
        phone:user.phone,
        email:user.email,
        id:user._id,
        products: products, 
        totalProductsInCart
    })
})

// GET route to render the user edit page
app.get('/user-personal-edit/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const user = await collection.findById(id);
        const carts = await Cart.find({ user_id: req.session.user._id });
        const products = await Product.find(); 

        if (!user) {
            return res.status(404).send('User not found');
        }
        const totalProductsInCart = carts.reduce((total, item) => total + item.quantity, 0);
        res.render('user-personal-edit', {
            title: 'User Edit',
            user: user,
            Name:user.Name,
            phone:user.phone,
            email:user.email,
            id:user._id,
            carts:carts,
            products: products, 
            totalProductsInCart
        });
    } catch (err) {
        console.error(err);
        res.render('user-personal-edit', { alert: { type: 'danger', message: 'Internal server error' } });
        //res.status(500).send('Internal server error');
    }
});

app.post('/user-personal-edit/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updatedUser = await collection.findByIdAndUpdate(
            id,
            {
                Name: req.body.Name,
                phone: req.body.phone,
            },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).send('User not found');
        }

        req.session.user = updatedUser;
        res.redirect('/user-personal-information');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error updating user');
    }
});

// address
app.get('/address',async (req, res) => {
    const user = req.session.user;
    const products = await Product.find(); 
    const carts = await Cart.find({ user_id: req.session.user._id });
    const totalProductsInCart = carts.reduce((total, item) => total + item.quantity, 0);
    res.render('address',{
        title:'address',
        Name:user.Name,
        carts:carts,
        products: products, 
        totalProductsInCart
    });
});
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads') // Specify the directory where uploaded files should be stored
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now()) // Define how uploaded files should be named
    }
  });
  
  var upload = multer({ storage: storage }).single('fileFieldName'); // Specify the field name used for file uploads

app.get('/user-address',upload, async (req, res) => {
    try {
        const newaddress = await Address.find(); // { user_id: req.session.user.user_id }// Assuming Address is your Mongoose model
        const carts = await Cart.find({ user_id: req.session.user._id });
        const products = await Product.find(); 
        const totalProductsInCart = carts.reduce((total, item) => total + item.quantity, 0);
        // Render the EJS template and pass the newaddress variable
        res.render('user-address', {
          carts:carts,
          totalProductsInCart,
          products: products, 
         newaddress: newaddress
         });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching user address');
    }
});

app.post('/user-address', upload, async (req, res) => {
    try {
      const userAddresses = await Address.find({ user_id: req.session.user._id });
      if (userAddresses.length >= 2) {
        return res.status(400).send('You can only add up to two addresses');
      }
  
      const newAddress = new Address({
        user_id: req.session.user._id,
        fullname: req.body.fullname,
        address: req.body.address,
        phonenumber: req.body.phonenumber,
        city: req.body.city,
        state: req.body.state,
        zip: req.body.zip,
        homework: req.body.homework,
        alternatenumber: req.body.alternatenumber
      });
  
      const savedAddress = await newAddress.save();
      console.log('Address added to the database:', savedAddress);
      req.session.address = savedAddress;
      res.redirect('/address-details');
    } catch (err) {
      console.error(err);
      res.status(500).send('Error saving address');
    }
  });

app.get('/address-details', async (req, res) => {
    try {
        if (!req.session.user) {
            res.redirect('/login');
            return;
        }

        const user = req.session.user;
        const address = await Address.find({ user_id: user._id });
        const carts = await Cart.find({ user_id: req.session.user._id });
        const products = await Product.find(); 
        const totalProductsInCart = carts.reduce((total, item) => total + item.quantity, 0);

        res.render('address-details', {
            title: "Address Details",
            Name: user.Name,
            addresses: address, // Pass the addresses array to the template
            id:address._id,   
            fullname: address.fullname,
            address:address.address,
             phonenumber:address.phonenumber,
             city:address.city,
             state:address.state,
             zip:address.zip,
             alternatenumber:address.alternatenumber,
             homework:address.homework,
             carts:carts,
             products: products, 
             totalProductsInCart
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching address details');
    }
});
// Route to display the edit form
app.get('/edited/:id', async (req, res) => {
    try {
      const address = await Address.findById(req.params.id);
      const products = await Product.find(); 
      if (!address) {
        return res.status(404).send('Address not found');
      }
      const user = req.session.user;
      res.render('edit-address', {title:"edit address", Name:user.Name, address: address,products: products });
    } catch (err) {
      console.error(err);
      res.status(500).send('Error fetching address for editing');
    }
  });
  
  // Route to handle the update form submission
  app.post('/edited/:id', upload, async (req, res) => {
    try {
      const updatedAddress = await Address.findByIdAndUpdate(
        req.params.id,
        {
          fullname: req.body.fullname,
          address: req.body.address,
          phonenumber: req.body.phonenumber,
          city: req.body.city,
          state: req.body.state,
          zip: req.body.zip,
          homework: req.body.homework,
          alternatenumber: req.body.alternatenumber
        },
        { new: true }
      );
      if (!updatedAddress) {
        return res.status(404).send('Address not found');
      }
      res.redirect('/address-details');
    } catch (err) {
      console.error(err);
      res.status(500).send('Error updating address');
    }
  });
// Assume you have a delete route
app.get('/deleted/:id', async (req, res) => {
    try {
      await Address.findByIdAndDelete(req.params.id);
      res.redirect('/address-details');
    } catch (err) {
      console.error(err);
      res.status(500).send('Error deleting address');
    }
  });
//cart

// GET route to display the cart
app.get('/cart', async (req, res) => {
  try {
    if (!req.session.user || !req.session.user._id ) {
      return  res.redirect('/login')
    }
    const carts = await Cart.find({ user_id: req.session.user._id });
    const products = await Product.find();
    const newaddress = await Address.find({ user_id: req.session.user._id });

    const totalProductsInCart = carts.reduce((total, item) => total + item.quantity, 0);
    res.render('cart', { 
      title: 'Cart', 
      carts: carts,
      products: products,
      newaddress:newaddress,
      Name: req.session.user.Name,
      totalProductsInCart
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching user cart or products');
  }
});

// POST route to add an item to the cart
app.post('/cart', upload, async (req, res) => {
  console.log('Request Body:', req.body);

  try {
    if (!req.session.user || !req.session.user._id) {
      return res.redirect('/login')
    }

    const carts = await Cart.find({ user_id: req.session.user._id });
    if (carts.length >= 5) {
      return res.status(400).send('You can only add up to two items to cart');
    }

    const newCartItem = new Cart({
      user_id: req.session.user._id,
      product: req.body.product,
      model: req.body.model,
      price: req.body.price,
      Color:req.body.Color,
      quantity:req.body.quantity,
      fullname:req.body.fullname,
      address:req.body.address ,
      phonenumber:req.body.phonenumber ,
      city:req.body.city ,
      state:req.body.state ,
      zip:req.body.zip ,
      homework:req.body.homework ,
      alternatenumber:req.body.alternatenumber ,
      discountPercentage: req.body.discountPercentage,
      imagePath1: req.body.imagePath1,
    });

    const savedCartItem = await newCartItem.save();
    console.log('Item added to the cart:', savedCartItem);

    req.session.cart = savedCartItem;

    res.redirect('/cart');
  } catch (err) {
    console.error('Error adding item to cart:', err);
    res.status(500).send('Error adding item to cart');
  }
});

// Route to delete a cart item by ID
app.get('/deleted-cart/:id', async (req, res) => {
  try {
    if (!req.session.user || !req.session.user._id) {
      return res.status(401).send('User not authenticated');
    }

    await Cart.findByIdAndDelete(req.params.id);
    res.redirect('/cart');
  } catch (err) {
    console.error('Error deleting cart item:', err);
    res.status(500).send('Error deleting cart item');
  }
});
app.get('/remove-cartall', async (req, res) => {
  try {
    if (!req.session.user || !req.session.user._id) {
      return res.status(401).send('User not authenticated');
    }

    await Favourite.deleteMany(req.params.id);
    res.redirect('/wishlist');
  } catch (err) {
    console.error('Error deleting cart item:', err);
    res.status(500).send('Error deleting cart item');
  }
});

// // Route to admindelete a cart item by ID
app.get('/deleted-admin-cart/:id', async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    res.redirect('/admin-cart');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting address');
  }
});

app.post('/cart/update', async (req, res) => {
  try {
      const { product, quantity } = req.body;

      // Find the cart item by ID
      let cartItem = await Cart.findById(product);

      // If the item is not found, handle it (optional)
      if (!cartItem) {
          return res.status(404).send('Cart item not found');
      }

      // Update the quantity
      cartItem.quantity += parseInt(quantity, 10);

      // Ensure the quantity doesn't drop below 1
      if (cartItem.quantity < 1) {
          cartItem.quantity = 1;
      }

      // Save the updated cart item
      await cartItem.save();

      // Redirect back to the cart page after updating
      res.redirect('/cart');
  } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
  }
});
app.post('/buy/update', async (req, res) => {
  try {
      const { product, quantity } = req.body;
      console.log('Product ID:', product);  // Log the product ID
      console.log('Request Body:', req.body);  // Log the entire request body

      // Check if the product ID is valid
      if (!mongoose.Types.ObjectId.isValid(product)) {
          console.log('Invalid product ID format');
          return res.status(400).send('Invalid product ID');
      }

      // Try using findOne if findById isn't working
      let buyItem = await Buy.findById(product);  // Assuming product is the _id

      if (!buyItem) {
          console.log('Buy item not found');  // Log when the item is not found
          return res.status(404).send('Buy item not found');
      }

      // Update quantity
      buyItem.quantity += parseInt(quantity, 10);
      if (buyItem.quantity < 1) {
          buyItem.quantity = 1;
      }

      await buyItem.save();
      res.redirect('/buy');
  } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
  }
});


// buy

app.get('/buy', async (req, res) => {
  try {
    if (!req.session.user || !req.session.user._id) {
      return res.status(401).send('User not authenticated');
    }

    const buy = await Buy.find({ user_id: req.session.user._id });
    const products = await Product.find();
    const newaddress = await Address.find({ user_id: req.session.user._id });
    const carts = await Cart.find({ user_id: req.session.user._id });

    const totalProductsInCart = carts.reduce((total, item) => total + item.quantity, 0);

    if (buy.length === 0) {
      // Redirect to the cart page if there are no items in the cart
      return res.redirect('/cart');
    }

    res.render('buy', { 
      title: 'order summery', 
      buy: buy,
      products: products,
      newaddress:newaddress,
      Name: req.session.user.Name,
      carts:carts,
      totalProductsInCart
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching user cart or products');
  }
});
app.post('/buy', upload, async (req, res) => {
  console.log('Request Body:', req.body);

  try {
    if (!req.session.user || !req.session.user._id) {
      return res.status(401).send('User not authenticated');
    }

    // Check if the user already has too many items in the buy collection
    const buyCount = await Buy.countDocuments({ user_id: req.session.user._id });
    if (buyCount >= 20) {
      return res.status(400).send('You can only add up to 20 items to cart');
    }

    // Helper function to ensure req.body fields are arrays
    const ensureArray = (field) => Array.isArray(req.body[field]) ? req.body[field] : [req.body[field]];

    // Define fields to be processed
    const fields = [
      'product', 'model', 'price', 'Color', 'quantity', 'fullname', 'address',
      'phonenumber', 'city', 'state', 'zip', 'homework', 'alternatenumber',
      'discountPercentage', 'imagePath1'
    ];

    const arrays = fields.reduce((acc, field) => {
      acc[field] = ensureArray(field);
      return acc;
    }, {});

    // Prepare items to be added
    const addedItems = await Promise.all(arrays.product.map(async (product, i) => {
      const newBuyItem = new Buy({
        user_id: req.session.user._id,
        product,
        model: arrays.model[i],
        price: arrays.price[i],
        Color: arrays.Color[i],
        quantity: arrays.quantity[i],
        fullname: arrays.fullname[i],
        address: arrays.address[i],
        phonenumber: arrays.phonenumber[i],
        city: arrays.city[i],
        state: arrays.state[i],
        zip: arrays.zip[i],
        homework: arrays.homework[i],
        alternatenumber: arrays.alternatenumber[i],
        discountPercentage: arrays.discountPercentage[i],
        imagePath1: arrays.imagePath1[i],
        paymentMethod: req.body.paymentMethod, // Assuming paymentMethod is not array-based
        totalAmount: req.body.totalAmount, // Assuming totalAmount is not array-based
        date: req.body.date,
        time: req.body.time,
      });

      const savedBuyItem = await newBuyItem.save();
      console.log('Item added to the buy:', savedBuyItem);
      return savedBuyItem;
    }));

    req.session.buy = req.session.buy ? req.session.buy.concat(addedItems) : addedItems;
 // Store all added items in the session

    res.redirect('/buy');
  } catch (err) {
    console.error('Error adding item(s) to buy:', err);
    res.status(500).send('Error adding item(s) to buy');
  }
});

app.post('/remove-buy-items', async (req, res) => {
  try {
    if (!req.session.user || !req.session.user._id) {
      return res.status(401).send('User not authenticated');
    }

    // Remove all items for the current user
    await Buy.deleteMany({ user_id: req.session.user._id });

    // Redirect or send a response as needed
    res.redirect('/home');
  } catch (err) {
    console.error('Error removing items:', err);
    res.status(500).send('Error removing items');
  }
});

//payment
app.get('/checkout', async (req, res) => {
  try {
    if (!req.session.user || !req.session.user._id) {
      return res.status(401).send('User not authenticated');
    }

    const pay = await payment.find({ user_id: req.session.user._id });
    const products = await Product.find();
    const newaddress = await Address.find({ user_id: req.session.user._id });
    const carts = await Cart.find({ user_id: req.session.user._id });

    const totalProductsInCart = carts.reduce((total, item) => total + item.quantity, 0);

    res.render('checkout', { 
      title: 'order summery', 
      pay: pay,
      products: products,
      newaddress:newaddress,
      Name: req.session.user.Name,
      carts:carts,
      totalProductsInCart
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching user cart or products');
  }
});
app.post('/checkout', upload, async (req, res) => {
  console.log('Request Body:', req.body);

  try {
    if (!req.session.user || !req.session.user._id) {
      return res.status(401).send('User not authenticated');
    }

    // Check if the user already has too many items in the payment collection
    const pay = await payment.find({ user_id: req.session.user._id });
    if (pay.length >= 20) {
      return res.status(400).send('You can only add up to 20 items to the payment collection');
    }

    // Ensure req.body.product is an array
    const products = Array.isArray(req.body.product) ? req.body.product : [req.body.product];
    const models = Array.isArray(req.body.model) ? req.body.model : [req.body.model];
    const prices = Array.isArray(req.body.price) ? req.body.price : [req.body.price];
    const colors = Array.isArray(req.body.Color) ? req.body.Color : [req.body.Color];
    const quantities = Array.isArray(req.body.quantity) ? req.body.quantity : [req.body.quantity];
    const fullnames = Array.isArray(req.body.fullname) ? req.body.fullname : [req.body.fullname];
    const addresses = Array.isArray(req.body.address) ? req.body.address : [req.body.address];
    const phonenumbers = Array.isArray(req.body.phonenumber) ? req.body.phonenumber : [req.body.phonenumber];
    const cities = Array.isArray(req.body.city) ? req.body.city : [req.body.city];
    const states = Array.isArray(req.body.state) ? req.body.state : [req.body.state];
    const zips = Array.isArray(req.body.zip) ? req.body.zip : [req.body.zip];
    const homeworks = Array.isArray(req.body.homework) ? req.body.homework : [req.body.homework];
    const alternatenumbers = Array.isArray(req.body.alternatenumber) ? req.body.alternatenumber : [req.body.alternatenumber];
    const discountPercentages = Array.isArray(req.body.discountPercentage) ? req.body.discountPercentage : [req.body.discountPercentage];
    const imagePaths = Array.isArray(req.body.imagePath1) ? req.body.imagePath1 : [req.body.imagePath1];

    if (products.length === 0) {
      return res.status(400).send('No products provided');
    }

    let addedItems = [];

    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('en-GB'); // Format: DD/MM/YYYY
    const formattedTime = currentDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase();

    // Iterate over the items array and process each item
    for (let i = 0; i < products.length; i++) {
      const newPaymentItem = new payment({
        user_id: req.session.user._id,
        product: products[i],
        model: models[i],
        price: prices[i],
        Color: colors[i],
        quantity: quantities[i],
        fullname: fullnames[i],
        address: addresses[i],
        phonenumber: phonenumbers[i],
        city: cities[i],
        state: states[i],
        zip: zips[i],
        homework: homeworks[i],
        alternatenumber: alternatenumbers[i],
        discountPercentage: discountPercentages[i],
        imagePath1: imagePaths[i],
        paymentMethod: req.body.paymentMethod, // Assuming paymentMethod is not array-based
        totalAmount: req.body.totalAmount, // Assuming totalAmount is not array-based
        date: formattedDate, // Save the formatted date
        time: formattedTime,
      });

      const savedPaymentItem = await newPaymentItem.save();
      console.log('Item added to the payment collection:', savedPaymentItem);
      addedItems.push(savedPaymentItem);
    }

    // Automatically delete items from the 'buy' collection after saving the order
    await Buy.deleteMany({ user_id: req.session.user._id });
    console.log('Items removed from the buy collection after order success');

    req.session.buy = null; // Clear the buy session

    //res.status(200).send('Order successful');
    res.redirect('/checkout')
  } catch (err) {
    console.error('Error processing checkout:', err);
    res.status(500).send('Error processing checkout');
  }
});


//favorite

app.get('/wishlist', async (req, res) => {
  try {
    if (!req.session.user || !req.session.user._id) {
      return res.redirect('/login')
    }

    const favourite = await Favourite.find({ user_id: req.session.user._id });
    const products = await Product.find();
    const carts = await Cart.find({ user_id: req.session.user._id });

    const totalProductsInCart = carts.reduce((total, item) => total + item.quantity, 0);

    res.render('wishlist', { 
      title: 'Cart', 
      favourite: favourite,
      products: products,
      Name: req.session.user.Name,
      carts:carts,
      totalProductsInCart
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching user cart or products');
  }
});

// POST route to add an item to the cart
app.post('/wishlist', upload, async (req, res) => {
  console.log('Request Body:', req.body);

  try {
    if (!req.session.user || !req.session.user._id) {
      return res.status(401).send('User not authenticated');
    }

    // Ensure the product field is a valid ObjectId
    let productId;
    try {
      productId = new mongoose.Types.ObjectId(req.body.product);
    } catch (err) {
      return res.status(400).send('Invalid product ID');
    }

    const favouriteCount = await Favourite.countDocuments({ user_id: req.session.user._id });
    if (favouriteCount >= 25 && !await Favourite.findOne({ user_id: req.session.user._id, product: productId })) {
      return res.status(400).send('You can only add up to five items to the favorite');
    }

    // Check if the item is already in the favorites
    const existingItem = await Favourite.findOne({ 
      user_id: req.session.user._id,
      product: productId 
    });

    if (existingItem) {
      await Favourite.deleteOne({ _id: existingItem._id });
      console.log('Item removed from the favorites:', existingItem);
      return res.redirect(req.get('referer')); // Redirect to the same page after removing the item
    }

    const newFavoriteItem = new Favourite({
      user_id: req.session.user._id,
      product: productId,
      model: req.body.model,
      price: req.body.price,
      Color: req.body.Color,
      discountPercentage: req.body.discountPercentage,
      imagePath1: req.body.imagePath1,
    });

    const savedFavoriteItem = await newFavoriteItem.save();
    console.log('Item added to the favorites:', savedFavoriteItem);

    res.redirect(req.get('referer')); // Redirect to the same page after adding the item
  } catch (err) {
    console.error('Error adding item to favorites:', err);
    res.status(500).send('Error adding item to favorites');
  }
});


// Route to delete a cart item by ID
app.get('/deleted-favourite/:id', async (req, res) => {
  try {
    if (!req.session.user || !req.session.user._id) {
      return res.status(401).send('User not authenticated');
    }

    await Favourite.findByIdAndDelete(req.params.id);
    res.redirect('/wishlist');
  } catch (err) {
    console.error('Error deleting cart item:', err);
    res.status(500).send('Error deleting cart item');
  }
});
// // Route to admindelete a cart item by ID
app.get('/deleted-admin-favourite/:id', async (req, res) => {
  try {
    await Favourite.findByIdAndDelete(req.params.id);
    res.redirect('/admin-favourite');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting address');
  }
});
//search bar integration
app.get('/search', async (req, res) => {
  try {
      const searchQuery = req.query.q || '';
      const searchRegex = new RegExp(searchQuery, 'i'); // Case-insensitive search

      const products = await Product.find({ name: searchRegex }); // Replace 'name' with the field you want to search

      res.json(products);
  } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
  }
});



//admin login

app.post('/admin', (req, res) => {
    const { username, password } = req.body;
  
    // Check for a predefined username and password (replace with a more secure method in production)
    if (username === process.env.ADMIN && password === process.env.ADMIN_PASS) {
      // Set session to mark the user as authenticated
      req.session.authenticated = true;
      res.redirect('/');
    }else {
      res.send('Incorrect username or password. <a href="/admin">Try again</a>');
    }
  });
  
// logout
app.get('/logout',(req,res)=>{
    req.session.destroy(err =>{
        if(err){
            console.log(err)
        }else{
            res.redirect('/home')
        }
    })
})
app.post('/logout',(req,res)=>{
    req.session.destroy(err =>{
        if(err){
            console.log(err)
        }else{
            res.redirect('/home')
        }
    })
})
app.get('/admin-logout',(req,res)=>{
  req.session.destroy(err =>{
      if(err){
          console.log(err)
      }else{
          res.redirect('/admin')
      }
  })
})
app.post('/admin-logout',(req,res)=>{
  req.session.destroy(err =>{
      if(err){
          console.log(err)
      }else{
          res.redirect('/admin')
      }
  })
})

// User mobiles route
app.get('/user-mobiles', async (req, res) => {
  try {
      const products = await Product.find(); // { user_id: req.session.user.user_id }// Assuming Address is your Mongoose model
      const user = req.session.user;
      // Render the EJS template and pass the newaddress variable
      res.render('user-mobiles', {
        title:'mobiles',
         Name:user.Name,
         mobile:products.mobile,
         model:products.model,
         price:products.price,
         brand:products.brand,
         products: products,
        });
  } catch (err) {
      console.error(err);
      res.status(500).send('Error fetching user mobiles');
  }
});

const port = PORT;
app.listen(port,()=>{
    console.log(`successfull ${PORT}`)
})






