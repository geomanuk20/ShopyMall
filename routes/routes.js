const express = require('express')
const session = require('express-session');
const User = require('../src/configure');
const multer = require('multer');
const bcrypt = require('bcrypt');
const { next } = require('cli');
const { title } = require('process');
const { type } = require('os');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
require('dotenv').config()  // env
const  router = express();

const JWT_SECRET = process.env.JWT_SECRET;
const EMAIL = process.env.EMAIL;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;


// Parse application/x-www-form-urlencoded
router.use(bodyParser.urlencoded({ extended: true }));

// Parse application/json
router.use(bodyParser.json());
//router session
router.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
}));

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads') // Specify the directory where uploaded files should be stored
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now()) // Define how uploaded files should be named
    }
  });
  
  var upload = multer({ storage: storage }).single('fileFieldName'); // Specify the field name used for file uploads
  

// insert an user into database route
router.post('/add', upload, async (req, res) => {
    try {
        const saltRounds = 10; // Number of salt rounds for bcrypt
        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

        const user = new User({
            Name: req.body.Name,
            email:req.body.email,
            phone:req.body.phone,
            password: hashedPassword, // Assign the hashed password to the user object
        });

        await user.save(); // Save the user with the hashed password to the database

        // Set session message for success
        req.session.message = {
            type: 'success',
            message: 'User added successfully',
        };
        res.redirect('/');
    } catch (err) {
        // Set session message for error
        req.session.message = {
            type: 'danger',
            message: err.message,
        };
        res.redirect('/');
    }
});


// get all users route
router.get('/add',(req,res)=>{
    res.render('add_user',{title:'add users'})
})
router.get('/', async (req, res) => {
    try {
        const users = await User.find(); // Assuming User is your Mongoose model
        res.render('adminhome', { user: users ,title:'admin' }); // Pass 'users' or any other relevant data
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send('Internal Server Error');
    }
});

// edit an user routes
router.get('/adminedit/:id', (req, res) => {
    let id = req.params.id;
    User.findById(id)
        .then(user => {
            if (user == null) {
                res.redirect('/');
            } else {
                res.render('adminedit_user', {
                    title: "adminedit user",
                    user: user,
                });
            }
        })
        .catch(err => {
            console.error(err);
            res.redirect('/');
        });
});
// update user routes
router.post('/update/:id', upload, async (req, res) => {
    try {
        let id = req.params.id;

        // Hash the password using bcrypt
        const saltRounds = 10;
        const hashedpassword = await bcrypt.hash(req.body.password, saltRounds);

        const updateData = {
            email:req.body.email,
            phone:req.body.phone,
            Name: req.body.Name,
            password: hashedpassword,
        };

        const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedUser) {
            return res.json({ message: 'User not found', type: 'danger' });
        }

        req.session.message = {
            type: 'success',
            message: 'User updated',
        };
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error', type: 'danger' });
    }
});
// user delete
router.get('/delete/:id', async (req, res) => {
    try {
        const userId = req.params.id;

        // Find the user by ID and delete
        const deletedUser = await User.findByIdAndDelete(userId);

        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found', type: 'danger'});
        }

        req.session.message = {
            type: 'success',
            message: 'User deleted',
        };
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error', type: 'danger'});
    }
});

// user block method
// GET route to display block/unblock confirmation
router.get('/block/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if user is already blocked
        if (user.blocked) {
            return res.render('confirm_unblock', { user }); // Render unblock confirmation page/modal
        } else {
            return res.render('confirm_block', { user }); // Render block confirmation page/modal
        }
    } catch (error) {
        console.error('Error initiating user block:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

// POST route to toggle block status (block or unblock) based on current status
router.post('/block/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Toggle block status
        user.blocked = !user.blocked;
        await user.save();

        const action = user.blocked ? 'blocked' : 'unblocked';
        return res.status(200).json({ message: `User ${action} successfully`, user });
    } catch (error) {
        console.error('Error toggling user block:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});
// POST route to unblock a user
router.post('/unblock/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Ensure the user is blocked before attempting to unblock
        if (!user.blocked) {
            return res.status(400).json({ message: 'User is not blocked' });
        }

        // Unblock the user
        user.blocked = false;
        await user.save();

        return res.status(200).json({ message: 'User unblocked successfully', user });
    } catch (error) {
        console.error('Error unblocking user:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

 // forgot password

 router.get('/forgot-password', (req, res) => {
     res.render('forgot-password');
 });
 
 router.post('/forgot-password', async (req, res) => {
     const { email } = req.body;
 
     try {
         // Check if the user exists in the database
         const user = await User.findOne({ email });
         if (!user) {
             return res.render('message',{message:'User not registered',type:'error'});
         }
 
         // User exists, generate JWT token
         const secret = JWT_SECRET + user.password;
         const payload = {
            email: user.email,
             id: user.id
         };
         const token = jwt.sign(payload, secret, { expiresIn: '5min' });
         const resetLink = `http://localhost:3011/reset-password/${user.id}/${token}`;
 
         // Send password reset link via email
         const transporter = nodemailer.createTransport({
             service: 'gmail',
             auth: {
                 user: process.env.EMAIL, // Replace with your email
                 pass: process.env.EMAIL_PASSWORD,// Replace with your email password
             }
         });
 
         const mailOptions = {
             from: EMAIL, // Replace with your email
             to: user.email,
             subject: 'Password Reset Link',
             html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`
         };
         transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('Error sending email:', error);
                return res.render('message', { message: 'An error occurred while sending the email.', type: 'error' });
            } else {
                console.log('Email sent:', info.response);
                return res.render('message', { message: 'Password reset link has been sent to your email.', type: 'success' });
            }
        });
    } catch (error) {
        console.log('Error:', error);
        res.render('message', { message: 'An error occurred while processing your request.', type: 'error' });
    }
});
 
 router.get('/reset-password/:id/:token', async (req, res, next) => {
     const { id, token } = req.params;
     try {
         // Find the user by ID
         const user = await User.findById(id);
         if (!user) {
             res.send('Invalid id...');
             return;
         }
 
         // Validate the token using user's password as part of the secret
         const secret = JWT_SECRET + user.password;
         const payload = jwt.verify(token, secret);
 
         // Render the reset password form with user's email
         res.render('reset-password', { email: user.email });
     } catch (error) {
         console.log(error.message);
         res.send(error.message);
     }
 });
 
 
 router.post('/reset-password/:id/:token', async (req, res) => {
     const { id, token } = req.params;
     const { password, password2 } = req.body;
 
     if (password !== password2) {
         return res.render('message', { message: 'Passwords do not match.', type: 'error' });
     }
 
     try {
         const user = await User.findById(id);
         if (!user) {
            return res.render('message', { message: 'User not found', type: 'error' });
         }
 
         const secret = JWT_SECRET + user.password;
         const payload = jwt.verify(token, secret);
 
         // Update the user's password
         const saltRounds = 10;
         const hashedPassword = await bcrypt.hash(password, saltRounds);
         user.password = hashedPassword;
         await user.save();

         return res.render('message', { message: 'Password successfully reset', type: 'success' });
     } catch (error) {
         console.log('Error:', error);
         return res.render('message', { message: 'Error resetting password.', type: 'error' });
     }
 });
 
// logout
router.get('/userlogout',(req,res)=>{
    res.render('userlogout')
})
router.post('/userlogout',(req,res)=>{
    req.session.destroy(err =>{
        if(err){
            console.log(err)
        }else{
            res.redirect('/home')
        }
    })
})

module.exports = router;

