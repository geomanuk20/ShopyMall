const express = require("express");
const session = require("express-session");
const Product = require("../src/configure_product"); // Adjust the path as necessary
const Address = require("../src/address-configure")
const multer = require("multer");
const bcrypt = require("bcrypt");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const bodyParser = require("body-parser");
const Favourite = require('../src/favourite');
const Cart = require('../src/cart-configure');
const Buy = require('../src/buy-configure')
const { title } = require("process");
const router = express.Router();

// Parse application/x-www-form-urlencoded
router.use(bodyParser.urlencoded({ extended: true }));
router.use(express.static("uploads"));

// Parse application/json
router.use(bodyParser.json());

// Router session
router.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: true,
  })
);

// Multer configuration for file upload
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage }).fields([
  { name: 'imagePath1', maxCount: 1 },
  { name: 'imagePath2', maxCount: 1 },
  { name: 'imagePath3', maxCount: 1 },
  { name: 'imagePath4', maxCount: 1 },
  { name: 'imagePath5', maxCount: 1 },
  { name: 'imagePath6', maxCount: 1 }
]);

// Get all products for the admin product page
router.get("/admin_product", async (req, res) => {
  try {
    const products = await Product.find();
    const brands = products.map((product) => product.brand);
    res.render("admin_product", { products, brands });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});
router.get("/admin-watch", async (req, res) => {
  try {
    const products = await Product.find({ category: "watch" });
    const brands = products.map((product) => product.brand);
    res.render("admin-watch", { products, brands });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

router.get("/user-mobiles", async (req, res) => {
  try {
    const user = req.session.user;
    const products = await Product.find(); // { user_id: req.session.user.user_id }// Assuming Address is your Mongoose model
    const favoriteItems = await Favourite.find({ user_id: user._id });
    const brands = products.map((product) => product.brand);
    const carts = await Cart.find({ user_id: req.session.user._id });

    const totalProductsInCart = carts.reduce((total, item) => total + item.quantity, 0);
    // Render the EJS template and pass the newaddress variable
    res.render("user-mobiles", {
      products,
      brands,
      title: "mobiles",
      Name: user.Name,
      mobile: products.mobile,
      model: products.model,
      price: products.price,
      discountPercentage: products.discountPercentage,
      brand: products.brand,
      description: products.description,
      ram: products.ram,
      rom: products.rom,
      battery: products.battery,
      display: products.display,
      processor: products.processor,
      camera: products.camera,
      Color: products.Color,
      BrowseType: products.BrowseType,
      SimType: products.SimType,
      HybridsimSlot: products.HybridsimSlot,
      touchscreen: products.touchscreen,
      OTGCompatible: products.OTGCompatible,
      QuickCharging: products.QuickCharging,
      SoundEnhancements: products.SoundEnhancements,
      DisplayFeatures: products.DisplayFeatures,
      DisplaySize: products.DisplaySize,
      ResolutionType: products.ResolutionType,
      DisplayType: products.DisplayType,
      OtherDisplayFeatures: products.OtherDisplayFeatures,
      OsProcessorFeature: products.OsProcessorFeature,
      OperationSystem: products.OperationSystem,
      ProcessorType: products.ProcessorType,
      OperationFrequency: products.OperationFrequency,
      MemoryStorageFeatures: products.MemoryStorageFeatures,
      InternalStorage: products.InternalStorage,
      CameraFeatures: products.CameraFeatures,
      PrimaryCameraAvailable: products.PrimaryCameraAvailable,
      PrimaryCamera: products.PrimaryCamera,
      PrimaryCameraFeatures: products.PrimaryCameraFeatures,
      SecondaryCameraAvailable: products.SecondaryCameraAvailable,
      SecondaryCamera: products.SecondaryCamera,
      SecondaryCameraFeature: products.SecondaryCameraFeature,
      HDRecording: products.HDRecording,
      FullHDRecording: products.FullHDRecording,
      VideoRecordingResolution: products.VideoRecordingResolution,
      DigitalZoom: products.DigitalZoom,
      FrameRate: products.FrameRate,
      DualCameraLens: products.DualCameraLens,
      CallFeatures: products.CallFeatures,
      SpeakerPhone: products.SpeakerPhone,
      ConnectivityFeatures: products.ConnectivityFeatures,
      NetworkType: products.NetworkType,
      SupportedNetwork: products.SupportedNetwork,
      InternetConnectivity: products.InternetConnectivity,
      PreinstalledBrowser: products.PreinstalledBrowser,
      MicroUSBVersion: products.MicroUSBVersion,
      BluetoothSupport: products.BluetoothSupport,
      BluetoothVersion: products.BluetoothVersion,
      WifiVersion: products.WifiVersion,
      WiFiHotspot: products.WiFiHotspot,
      NFC: products.NFC,
      GPSSupport: products.GPSSupport,
      OtherDetails: products.OtherDetails,
      SmartPhone: products.SmartPhone,
      SIMSize: products.SIMSize,
      SMS: products.SMS,
      VoiceInput: products.VoiceInput,
      GraphicPPI: products.GraphicPPI,
      Sensors: products.Sensors,
      OtherFeatures: products.OtherFeatures,
      GPSType: products.GPSType,
      MultimediaFeatures: products.MultimediaFeatures,
      VideoFormats: products.VideoFormats,
      BatteryPowerFeatures: products.BatteryPowerFeatures,
      BatteryCapacity: products.BatteryCapacity,
      Dimensions: products.Dimensions,
      Width: products.Width,
      Height: products.Height,
      Depth: products.Depth,
      Weight: products.Weight,
      Warranty: products.Warranty,
      products: products,
      favoriteItems: favoriteItems,
      carts:carts,
      totalProductsInCart
    });
  } catch (err) {
    console.error(err);
    return res.redirect('/login')
  }
});
router.get("/detail-product/:id", async (req, res) => {
  try {
    // Assuming Address is your Mongoose model
    const products = await Product.find(); // { user_id: req.session.user.user_id }
    const address = await Address.findOne({ user_id: req.session.user._id });
    const user = req.session.user;
    const buy = await Buy.find({ user_id: req.session.user._id });
    const brands = products.map((product) => product.brand);
    const productId = req.params.id;
    const carts = await Cart.find({ user_id: req.session.user._id });

    const totalProductsInCart = carts.reduce((total, item) => total + item.quantity, 0);


    // Render the EJS template and pass the selected product details
    res.render("detail-product", {
      product: products.find((product) => product._id == req.params.id),
      brands,
      title: "mobiles",
      Name: user.Name,
      mobile: products.mobile,
      model: products.model,
      price: products.price,
      discountPercentage: products.discountPercentage,
      brand: products.brand,
      description: products.description,
      ram: products.ram,
      rom: products.rom,
      battery: products.battery,
      display: products.display,
      processor: products.processor,
      camera: products.camera,
      Color: products.Color,
      BrowseType: products.BrowseType,
      SimType: products.SimType,
      HybridsimSlot: products.HybridsimSlot,
      touchscreen: products.touchscreen,
      OTGCompatible: products.OTGCompatible,
      QuickCharging: products.QuickCharging,
      SoundEnhancements: products.SoundEnhancements,
      DisplayFeatures: products.DisplayFeatures,
      DisplaySize: products.DisplaySize,
      ResolutionType: products.ResolutionType,
      DisplayType: products.DisplayType,
      OtherDisplayFeatures: products.OtherDisplayFeatures,
      OsProcessorFeature: products.OsProcessorFeature,
      OperationSystem: products.OperationSystem,
      ProcessorType: products.ProcessorType,
      OperationFrequency: products.OperationFrequency,
      MemoryStorageFeatures: products.MemoryStorageFeatures,
      InternalStorage: products.InternalStorage,
      CameraFeatures: products.CameraFeatures,
      PrimaryCameraAvailable: products.PrimaryCameraAvailable,
      PrimaryCamera: products.PrimaryCamera,
      PrimaryCameraFeatures: products.PrimaryCameraFeatures,
      SecondaryCameraAvailable: products.SecondaryCameraAvailable,
      SecondaryCamera: products.SecondaryCamera,
      SecondaryCameraFeature: products.SecondaryCameraFeature,
      HDRecording: products.HDRecording,
      FullHDRecording: products.FullHDRecording,
      VideoRecordingResolution: products.VideoRecordingResolution,
      DigitalZoom: products.DigitalZoom,
      FrameRate: products.FrameRate,
      DualCameraLens: products.DualCameraLens,
      CallFeatures: products.CallFeatures,
      SpeakerPhone: products.SpeakerPhone,
      ConnectivityFeatures: products.ConnectivityFeatures,
      NetworkType: products.NetworkType,
      SupportedNetwork: products.SupportedNetwork,
      InternetConnectivity: products.InternetConnectivity,
      PreinstalledBrowser: products.PreinstalledBrowser,
      MicroUSBVersion: products.MicroUSBVersion,
      BluetoothSupport: products.BluetoothSupport,
      BluetoothVersion: products.BluetoothVersion,
      WifiVersion: products.WifiVersion,
      WiFiHotspot: products.WiFiHotspot,
      NFC: products.NFC,
      GPSSupport: products.GPSSupport,
      OtherDetails: products.OtherDetails,
      SmartPhone: products.SmartPhone,
      SIMSize: products.SIMSize,
      SMS: products.SMS,
      VoiceInput: products.VoiceInput,
      GraphicPPI: products.GraphicPPI,
      Sensors: products.Sensors,
      OtherFeatures: products.OtherFeatures,
      GPSType: products.GPSType,
      MultimediaFeatures: products.MultimediaFeatures,
      VideoFormats: products.VideoFormats,
      BatteryPowerFeatures: products.BatteryPowerFeatures,
      BatteryCapacity: products.BatteryCapacity,
      Dimensions: products.Dimensions,
      Width: products.Width,
      Height: products.Height,
      Depth: products.Depth,
      Weight: products.Weight,
      Warranty: products.Warranty,
      fullname: address.fullname,
      address:  address.address ,
      phonenumber:  address.phonenumber ,
      city:  address.city ,
      state:  address.state ,
      zip:  address.zip ,
      homework:  address.homework ,
      alternatenumber:  address.alternatenumber ,
      productId: productId,
      products: products,
      address:address,
      buy:buy,
      carts:carts,
      totalProductsInCart
    });
  } catch (err) {
    console.error(err);
    //res.status(500).send("Error fetching user mobiles");
    res.redirect('/address-details')
  }
});

router.get("/cart/:id", async (req, res) => {
  try {
    const products = await Product.find(); // { user_id: req.session.user.user_id }// Assuming Address is your Mongoose model
    const user = req.session.user;
    const brands = products.map((product) => product.brand);
    const productId = req.params.id;
    const address = await Address.findOne({ user_id: req.session.user._id });
    // Render the EJS template and pass the newaddress variable
    res.render("cart", {
      products,
      brands,
      title: "cart",
      Name: user.Name,
      mobile: products.mobile,
      model: products.model,
      price: products.price,
      discountPercentage: products.discountPercentage,
      brand: products.brand,
      quantity:products.quantity,
      description: products.description,
      ram: products.ram,
      rom: products.rom,
      battery: products.battery,
      display: products.display,
      processor: products.processor,
      camera: products.camera,
      productId: productId,
      products: products,
      fullname:address.fullname,
      address:  address.address ,
      phonenumber:  address.phonenumber ,
      city:  address.city ,
      state:  address.state ,
      zip:  address.zip ,
      homework:  address.homework ,
      alternatenumber:  address.alternatenumber ,
      address:address,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching user mobiles");
  }
});
router.get("/buy/:id", async (req, res) => {
  try {
    const products = await Product.find(); // { user_id: req.session.user.user_id }// Assuming Address is your Mongoose model
    const user = req.session.user;
    const brands = products.map((product) => product.brand);
    const productId = req.params.id;
    const address = await Address.findOne({ user_id: req.session.user._id });
    // Render the EJS template and pass the newaddress variable
    res.render("buy", {
      products,
      brands,
      title: "buy",
      Name: user.Name,
      mobile: products.mobile,
      model: products.model,
      price: products.price,
      discountPercentage: products.discountPercentage,
      brand: products.brand,
      quantity:products.quantity,
      description: products.description,
      ram: products.ram,
      rom: products.rom,
      battery: products.battery,
      display: products.display,
      processor: products.processor,
      camera: products.camera,
      fullname: address.fullname,
      address:  address.address ,
      phonenumber:  address.phonenumber ,
      city:  address.city ,
      state:  address.state ,
      zip:  address.zip ,
      homework:  address.homework ,
      alternatenumber:  address.alternatenumber ,
      productId: productId,
      products: products,
      address:address,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching user mobiles");
  }
});

router.get("/checkout/:id", async (req, res) => {
  try {
    const products = await Product.find(); // { user_id: req.session.user.user_id }// Assuming Address is your Mongoose model
    const user = req.session.user;
    const brands = products.map((product) => product.brand);
    const productId = req.params.id;
    const address = await Address.findOne({ user_id: req.session.user._id });
    // Render the EJS template and pass the newaddress variable
    res.render("checkout", {
      products,
      brands,
      title: "checkout",
      Name: user.Name,
      mobile: products.mobile,
      model: products.model,
      price: products.price,
      discountPercentage: products.discountPercentage,
      brand: products.brand,
      quantity:products.quantity,
      description: products.description,
      ram: products.ram,
      rom: products.rom,
      battery: products.battery,
      display: products.display,
      processor: products.processor,
      camera: products.camera,
      fullname: address.fullname,
      address:  address.address ,
      phonenumber:  address.phonenumber ,
      city:  address.city ,
      state:  address.state ,
      zip:  address.zip ,
      homework:  address.homework ,
      alternatenumber:  address.alternatenumber ,
      productId: productId,
      products: products,
      address:address,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching user mobiles");
  }
});
router.get("/user-watch", async (req, res) => {
  try {
    const user = req.session.user;
    const products = await Product.find(); // { user_id: req.session.user.user_id }// Assuming Address is your Mongoose model
    const favoriteItems = await Favourite.find({ user_id: user._id });
    const brands = products.map((product) => product.brand);
    const carts = await Cart.find({ user_id: req.session.user._id });

    const totalProductsInCart = carts.reduce((total, item) => total + item.quantity, 0);
    // Render the EJS template and pass the newaddress variable
    res.render("user-watch", {
      products,
      brands,
      title: "mobiles",
      Name: user.Name,
      mobile: products.mobile,
      model: products.model,
      price: products.price,
      discountPercentage: products.discountPercentage,
      brand: products.brand,
      description: products.description,
      ram: products.ram,
      rom: products.rom,
      battery: products.battery,
      display: products.display,
      processor: products.processor,
      camera: products.camera,
      Usage: products.Usage,
      Screen: products.Screen,
      Batteryruntime: products.Batteryruntime,
      products: products,
      favoriteItems: favoriteItems,
      carts:carts,
      totalProductsInCart
    });
  } catch (err) {
    console.error(err);
    return res.redirect('/login')
  }
});

router.get("/user-earphone", async (req, res) => {
  try {
    const user = req.session.user;
    const products = await Product.find(); // { user_id: req.session.user.user_id }// Assuming Address is your Mongoose model
    const favoriteItems = await Favourite.find({ user_id: user._id });
    const brands = products.map((product) => product.brand);
    const carts = await Cart.find({ user_id: req.session.user._id });

    const totalProductsInCart = carts.reduce((total, item) => total + item.quantity, 0);
    // Render the EJS template and pass the newaddress variable
    res.render("user-earphone", {
      products,
      brands,
      title: "earphone",
      Name: user.Name,
      mobile: products.mobile,
      model: products.model,
      price: products.price,
      discountPercentage: products.discountPercentage,
      brand: products.brand,
      description: products.description,
      ram: products.ram,
      rom: products.rom,
      battery: products.battery,
      display: products.display,
      processor: products.processor,
      camera: products.camera,
      Usage: products.Usage,
      Screen: products.Screen,
      Batteryruntime: products.Batteryruntime,
      products: products,
      favoriteItems: favoriteItems,
      carts:carts,
      totalProductsInCart
    });
  } catch (err) {
    console.error(err);
    return res.redirect('/login')
  }
});

router.get("/user-speaker", async (req, res) => {
  try {
    const user = req.session.user;
    const products = await Product.find(); // { user_id: req.session.user.user_id }// Assuming Address is your Mongoose model
    const favoriteItems = await Favourite.find({ user_id: user._id });
    const brands = products.map((product) => product.brand);
    const carts = await Cart.find({ user_id: req.session.user._id });

    const totalProductsInCart = carts.reduce((total, item) => total + item.quantity, 0);
    // Render the EJS template and pass the newaddress variable
    res.render("user-speaker", {
      products,
      brands,
      title: "earphone",
      Name: user.Name,
      mobile: products.mobile,
      model: products.model,
      price: products.price,
      discountPercentage: products.discountPercentage,
      brand: products.brand,
      description: products.description,
      ram: products.ram,
      rom: products.rom,
      battery: products.battery,
      display: products.display,
      processor: products.processor,
      camera: products.camera,
      Usage: products.Usage,
      Screen: products.Screen,
      Batteryruntime: products.Batteryruntime,
      products: products,
      favoriteItems: favoriteItems,
      carts:carts,
      totalProductsInCart
    });
  } catch (err) {
    console.error(err);
    return res.redirect('/login')
  }
});

router.get("/user-charger", async (req, res) => {
  try {
    const user = req.session.user;
    const products = await Product.find(); // { user_id: req.session.user.user_id }// Assuming Address is your Mongoose model
    const favoriteItems = await Favourite.find({ user_id: user._id });
    const brands = products.map((product) => product.brand);
    const carts = await Cart.find({ user_id: req.session.user._id });

    const totalProductsInCart = carts.reduce((total, item) => total + item.quantity, 0);
    // Render the EJS template and pass the newaddress variable
    res.render("user-charger", {
      products,
      brands,
      title: "earphone",
      Name: user.Name,
      mobile: products.mobile,
      model: products.model,
      price: products.price,
      discountPercentage: products.discountPercentage,
      brand: products.brand,
      description: products.description,
      ram: products.ram,
      rom: products.rom,
      battery: products.battery,
      display: products.display,
      processor: products.processor,
      camera: products.camera,
      Usage: products.Usage,
      Screen: products.Screen,
      Batteryruntime: products.Batteryruntime,
      products: products,
      favoriteItems: favoriteItems,
      carts:carts,
      totalProductsInCart
    });
  } catch (err) {
    console.error(err);
    return res.redirect('/login')
  }
});

router.get("/user-powerbank", async (req, res) => {
  try {
    const user = req.session.user;
    const products = await Product.find(); // { user_id: req.session.user.user_id }// Assuming Address is your Mongoose model
    const favoriteItems = await Favourite.find({ user_id: user._id });
    const brands = products.map((product) => product.brand);
    const carts = await Cart.find({ user_id: req.session.user._id });

    const totalProductsInCart = carts.reduce((total, item) => total + item.quantity, 0);
    // Render the EJS template and pass the newaddress variable
    res.render("user-powerbank", {
      products,
      brands,
      title: "earphone",
      Name: user.Name,
      mobile: products.mobile,
      model: products.model,
      price: products.price,
      discountPercentage: products.discountPercentage,
      brand: products.brand,
      description: products.description,
      ram: products.ram,
      rom: products.rom,
      battery: products.battery,
      display: products.display,
      processor: products.processor,
      camera: products.camera,
      Usage: products.Usage,
      Screen: products.Screen,
      Batteryruntime: products.Batteryruntime,
      products: products,
      favoriteItems: favoriteItems,
      carts:carts,
      totalProductsInCart
    });
  } catch (err) {
    console.error(err);
    return res.redirect('/login')
  }
});

router.get("/user-smartpoint", async (req, res) => {
  try {
    const user = req.session.user;
    const products = await Product.find(); // { user_id: req.session.user.user_id }// Assuming Address is your Mongoose model
    const favoriteItems = await Favourite.find({ user_id: user._id });
    const brands = products.map((product) => product.brand);
    const carts = await Cart.find({ user_id: req.session.user._id });

    const totalProductsInCart = carts.reduce((total, item) => total + item.quantity, 0);
    // Render the EJS template and pass the newaddress variable
    res.render("user-smartpoint", {
      products,
      brands,
      title: "earphone",
      Name: user.Name,
      mobile: products.mobile,
      model: products.model,
      price: products.price,
      discountPercentage: products.discountPercentage,
      brand: products.brand,
      description: products.description,
      ram: products.ram,
      rom: products.rom,
      battery: products.battery,
      display: products.display,
      processor: products.processor,
      camera: products.camera,
      Usage: products.Usage,
      Screen: products.Screen,
      Batteryruntime: products.Batteryruntime,
      products: products,
      favoriteItems: favoriteItems,
      carts:carts,
      totalProductsInCart
    });
  } catch (err) {
    console.error(err);
    return res.redirect('/login')
  }
});

router.get("/user-storagedevice", async (req, res) => {
  try {
    const user = req.session.user;
    const products = await Product.find(); // { user_id: req.session.user.user_id }// Assuming Address is your Mongoose model
    const favoriteItems = await Favourite.find({ user_id: user._id });
    const brands = products.map((product) => product.brand);
    const carts = await Cart.find({ user_id: req.session.user._id });

    const totalProductsInCart = carts.reduce((total, item) => total + item.quantity, 0);
    // Render the EJS template and pass the newaddress variable
    res.render("user-storagedevice", {
      products,
      brands,
      title: "earphone",
      Name: user.Name,
      mobile: products.mobile,
      model: products.model,
      price: products.price,
      discountPercentage: products.discountPercentage,
      brand: products.brand,
      description: products.description,
      ram: products.ram,
      rom: products.rom,
      battery: products.battery,
      display: products.display,
      processor: products.processor,
      camera: products.camera,
      Usage: products.Usage,
      Screen: products.Screen,
      Batteryruntime: products.Batteryruntime,
      products: products,
      favoriteItems: favoriteItems,
      carts:carts,
      totalProductsInCart
    });
  } catch (err) {
    console.error(err);
    return res.redirect('/login')
  }
});
// Insert a product into database route
router.post("/add_product", upload, async (req, res) => {
  try {
    const product = new Product({
      product: req.body.product,
      model: req.body.model,
      price: req.body.price,
      discountPercentage: req.body.discountPercentage,
      imagePath1: req.files.imagePath1 ? req.files.imagePath1[0].filename : null,
      imagePath2: req.files.imagePath2 ? req.files.imagePath2[0].filename : null,
      imagePath3: req.files.imagePath3 ? req.files.imagePath3[0].filename : null,
      imagePath4: req.files.imagePath4 ? req.files.imagePath4[0].filename : null,
      imagePath5: req.files.imagePath5 ? req.files.imagePath5[0].filename : null,
      imagePath6: req.files.imagePath6 ? req.files.imagePath6[0].filename : null,
      category: req.body.category,
      brand: req.body.brand,
      description: req.body.description,
      ram: req.body.ram,
      rom: req.body.rom,
      battery: req.body.battery,
      display: req.body.display,
      processor: req.body.processor,
      camera: req.body.camera,
      Color: req.body.Color,
      BrowseType: req.body.BrowseType,
      SimType: req.body.SimType,
      HybridsimSlot: req.body.HybridsimSlot,
      touchscreen: req.body.touchscreen,
      OTGCompatible: req.body.OTGCompatible,
      QuickCharging: req.body.QuickCharging,
      SoundEnhancements: req.body.SoundEnhancements,
      DisplayFeatures: req.body.DisplayFeatures,
      DisplaySize: req.body.DisplaySize,
      ResolutionType: req.body.ResolutionType,
      DisplayType: req.body.DisplayType,
      OtherDisplayFeatures: req.body.OtherDisplayFeatures,
      OsProcessorFeature: req.body.OsProcessorFeature,
      OperationSystem: req.body.OperationSystem,
      ProcessorType: req.body.ProcessorType,
      OperationFrequency: req.body.OperationFrequency,
      MemoryStorageFeatures: req.body.MemoryStorageFeatures,
      InternalStorage: req.body.InternalStorage,
      CameraFeatures: req.body.CameraFeatures,
      PrimaryCameraAvailable: req.body.PrimaryCameraAvailable,
      PrimaryCamera: req.body.PrimaryCamera,
      PrimaryCameraFeatures: req.body.PrimaryCameraFeatures,
      SecondaryCameraAvailable: req.body.SecondaryCameraAvailable,
      SecondaryCamera: req.body.SecondaryCamera,
      SecondaryCameraFeatures: req.body.SecondaryCameraFeatures,
      HDRecording: req.body.HDRecording,
      FullHDRecording: req.body.FullHDRecording,
      VideoRecordingResolution: req.body.VideoRecordingResolution,
      DigitalZoom: req.body.DigitalZoom,
      FrameRate: req.body.FrameRate,
      DualCameraLens: req.body.DualCameraLens,
      CallFeatures: req.body.CallFeatures,
      SpeakerPhone: req.body.SpeakerPhone,
      ConnectivityFeatures: req.body.ConnectivityFeatures,
      NetworkType: req.body.NetworkType,
      SupportedNetwork: req.body.SupportedNetwork,
      InternetConnectivity: req.body.InternetConnectivity,
      PreinstalledBrowser: req.body.PreinstalledBrowser,
      MicroUSBVersion: req.body.MicroUSBVersion,
      BluetoothSupport: req.body.BluetoothSupport,
      BluetoothVersion: req.body.BluetoothVersion,
      WifiVersion: req.body.WifiVersion,
      WiFiHotspot: req.body.WiFiHotspot,
      NFC: req.body.NFC,
      GPSSupport: req.body.GPSSupport,
      OtherDetails: req.body.OtherDetails,
      SmartPhone: req.body.SmartPhone,
      SIMSize: req.body.SIMSize,
      SMS: req.body.SMS,
      VoiceInput: req.body.VoiceInput,
      GraphicPPI: req.body.GraphicPPI,
      Sensors: req.body.Sensors,
      OtherFeatures: req.body.OtherFeatures,
      GPSType: req.body.GPSType,
      MultimediaFeatures: req.body.MultimediaFeatures,
      VideoFormats: req.body.VideoFormats,
      BatteryPowerFeatures: req.body.BatteryPowerFeatures,
      BatteryCapacity: req.body.BatteryCapacity,
      Dimensions: req.body.Dimensions,
      Width: req.body.Width,
      Height: req.body.Height,
      Depth: req.body.Depth,
      Weight: req.body.Weight,
      Warranty: req.body.Warranty,
      //watch
      DialColor: req.body.DialColor,
      DialShape: req.body.DialShape,
      StrapColor: req.body.StrapColor,
      StrapMaterial: req.body.StrapMaterial,
      Size: req.body.Size,
      touchscreenWatch: req.body.touchscreenWatch,
      WaterResistant: req.body.WaterResistant,
      WaterResistanceDepth: req.body.WaterResistanceDepth,
      Usage: req.body.Usage,
      DialMaterial: req.body.DialMaterial,
      IdealFor: req.body.IdealFor,
      CompatibleOS: req.body.CompatibleOS,
      Closure: req.body.Closure,
      Notification: req.body.Notification,
      NotificationType: req.body.NotificationType,
      Talktime: req.body.Talktime,
      BatteryLife: req.body.BatteryLife,
      RechargeableBattery: req.body.RechargeableBattery,
      ChargerType: req.body.ChargerType,
      StandByTime: req.body.StandByTime,
      CallFunction: req.body.CallFunction,
      Bluetooth: req.body.Bluetooth,
      MessagingSupport: req.body.MessagingSupport,
      DisplayResolution: req.body.DisplayResolution,
      BacklightDisplay: req.body.BacklightDisplay,
      ScratchResistant: req.body.ScratchResistant,
      CalorieCount: req.body.CalorieCount,
      StepCount: req.body.StepCount,
      HeartRateMonitor: req.body.HeartRateMonitor,
      OtherFitnessFeatures: req.body.OtherFitnessFeatures,
      Calendar: req.body.Calendar,
      AlarmClock: req.body.AlarmClock,
      NumberofButtons: req.body.NumberofButtons,
      Speaker: req.body.Speaker,
      Microphone: req.body.Microphone,
      VoiceControl: req.body.VoiceControl,
      Thickness: req.body.Thickness,
      Diameter: req.body.Diameter,
      //earphone
      WithMicEP: req.body.WithMicEP,
      BatteryLifeEP: req.body.BatteryLifeEP,
      HeadphoneTypeEP: req.body.HeadphoneTypeEP,
      SalesPackageEP: req.body.SalesPackageEP,
      ConnectivityEP: req.body.ConnectivityEP,
      HeadphoneDesignEP: req.body.HeadphoneDesignEP,
      AccessoriesIncludedEP: req.body.AccessoriesIncludedEP,
      CompatatibleDevicesEP: req.body.CompatatibleDevicesEP,
      NetQuantityEP: req.body.NetQuantityEP,
      SweatProofEP: req.body.SweatProofEP,
      DeepBassEP: req.body.DeepBassEP,
      DesignForEP: req.body.DesignForEP,
      SystemRequirmentsEP: req.body.SystemRequirmentsEP,
      IndicatorEP: req.body.IndicatorEP,
      ControlsEP: req.body.ControlsEP,
      HeadphoneDriveUnitsEP: req.body.HeadphoneDriveUnitsEP,
      WithMicrophoneEP: req.body.WithMicrophoneEP,
      WirelessRangeEP: req.body.WirelessRangeEP,
      BluetoothVersionEP: req.body.BluetoothVersionEP,
      BluetoothRangeEP: req.body.BluetoothRangeEP,
      ChargingTimeEP: req.body.ChargingTimeEP,
      PlayTimeEP: req.body.PlayTimeEP,
      StandbytimeEP: req.body.StandbytimeEP,
      WidthEP: req.body.WidthEP,
      HeightEP: req.body.HeightEP,
      DepthEP: req.body.DepthEP,
      WeightEP: req.body.WeightEP,
      //speaker
      TypeSP:req.body.TypeSP,
      BluetoothSP:req.body.BluetoothSP,
      MemoryCardSlotSP:req.body.MemoryCardSlotSP,
      ConfigurationSP:req.body.ConfigurationSP,
      PowerOutputSP:req.body.PowerOutputSP,
      ColorSP:req.body.ColorSP,
      WiredWirelessSP:req.body.WiredWirelessSP,
      HeadphoneJackSP:req.body.HeadphoneJackSP,
      CompatibleDevicesSP:req.body.CompatibleDevicesSP,
      BatterySP:req.body.BatterySP,
      USBPortsSP:req.body.USBPortsSP,
      BluetoothVersionSP:req.body.BluetoothVersionSP,
      BatteryLifeSP:req.body.BatteryLifeSP,
      WirelessRangeSP:req.body.WirelessRangeSP,
      WidthSP:req.body.WidthSP,
      HeightSP:req.body.HeightSP,
      DepthSP:req.body.DepthSP,
      //powerbank
      PowerSourcePB:req.body.PowerSourcePB,
      CapacityPB:req.body.CapacityPB,
      NumberofOutputPortsPB:req.body.NumberofOutputPortsPB,
      ChargingCableIncludedPB:req.body.ChargingCableIncludedPB,
      PowerSupplyPB:req.body.PowerSupplyPB,
      OutputPowerPB:req.body.OutputPowerPB,
      OtherFeaturesPB:req.body.OtherFeaturesPB,
      widthPB:req.body.widthPB,
      DepthPB:req.body.DepthPB,
      WeightPB:req.body.WeightPB,
      //charger
      OutputInterfaceC:req.body.OutputInterfaceC,
      LEDIndicatorC :req.body.LEDIndicatorC ,
      DisplayC :req.body.DisplayC,
      ConnectorTypeC :req.body.ConnectorTypeC,
      NumberOfDeviceBatteriesChangedC :req.body.NumberOfDeviceBatteriesChangedC,
      DesignedForC :req.body.DesignedForC,
      NumberOfChargerPinsC :req.body.NumberOfChargerPinsC,
      WidthxHeightxDepthC :req.body.WidthxHeightxDepthC,
      WeightC :req.body.WeightC,
      OtherFeaturesC :req.body.OtherFeaturesC,
      CableTypeC :req.body.CableTypeC,
      PowerInputC :req.body.PowerInputC,
      PowerSourceC :req.body.PowerSourceC,
      OutputCurrentC :req.body.OutputCurrentC,
      SecondarySlotOutputC :req.body.SecondarySlotOutputC,
      OutputWattageC :req.body.OutputWattageC,
      OtherPowerFeaturesC :req.body.OtherPowerFeaturesC,
      //storagedevice
      ModelNumberSD :req.body.ModelNumberSD,
      WeightSD :req.body.WeightSD,
      RamSizeSD :req.body.RamSizeSD,
      MemoryStorageCapacitySD :req.body.MemoryStorageCapacitySD,
      FlashMemoryTypeSD :req.body.FlashMemoryTypeSD,
      DigitalStorageCapacitySD :req.body.DigitalStorageCapacitySD,
      HardWareInterfaceSD :req.body.HardWareInterfaceSD,
      CampatibleDevicesSD :req.body.CampatibleDevicesSD,
      SpecialFeatureSD :req.body.SpecialFeatureSD,
      ItemWeightSD :req.body.ItemWeightSD,
    });

    await product.save();
    console.log("Product saved successfully");
    req.session.message = {
      type: "success",
      message: "Product added successfully",
    };
    res.redirect("/admin_product");
  } catch (err) {
    console.error("Error saving product:", err);
    req.session.message = {
      type: "danger",
      message: err.message,
    };
    res.redirect("/admin_product");
  }
});

// Route to render add product form
router.get("/add_product", (req, res) => {
  res.render("add_product", { title: "Add Product", category: "", brand: "" });
});

// Edit product route
router.get("/edit_product/:id",upload, async (req, res) => {
  let id = req.params.id;
  try {
    const product = await Product.findById(id);
    if (!product) {
      res.redirect("/");
    } else {
      res.render("edit_product", {
        title: "Edit Product",
        product: product.product,
        model: product.model,
        price: product.price,
        discountPercentage: product.discountPercentage,
        imagePath1: product.imagePath1,
        imagePath2: product.imagePath2,
        imagePath3: product.imagePath3,
        imagePath4: product.imagePath4,
        imagePath5: product.imagePath5,
        imagePath6: product.imagePath6,
        category: product.category,
        brand: product.brand,
        ram: product.ram,
        rom: product.rom,
        battery: product.battery,
        display: product.display,
        processor: product.processor,
        camera: product.camera,
        description: product.description,
        Color: product.Color,
        BrowseType: product.BrowseType,
        SimType: product.SimType,
        HybridsimSlot: product.HybridsimSlot,
        touchscreen: product.touchscreen,
        OTGCompatible: product.OTGCompatible,
        QuickCharging: product.QuickCharging,
        SoundEnhancements: product.SoundEnhancements,
        DisplayFeatures: product.DisplayFeatures,
        DisplaySize: product.DisplaySize,
        ResolutionType: product.ResolutionType,
        DisplayType: product.DisplayType,
        OtherDisplayFeatures: product.OtherDisplayFeatures,
        OsProcessorFeature: product.OsProcessorFeature,
        OperationSystem: product.OperationSystem,
        ProcessorType: product.ProcessorType,
        OperationFrequency: product.OperationFrequency,
        MemoryStorageFeatures: product.MemoryStorageFeatures,
        InternalStorage: product.InternalStorage,
        CameraFeatures: product.CameraFeatures,
        PrimaryCameraAvailable: product.PrimaryCameraAvailable,
        PrimaryCamera: product.PrimaryCamera,
        PrimaryCameraFeatures: product.PrimaryCameraFeatures,
        SecondaryCameraAvailable: product.SecondaryCameraAvailable,
        SecondaryCamera: product.SecondaryCamera,
        SecondaryCameraFeatures: product.SecondaryCameraFeatures,
        HDRecording: product.HDRecording,
        FullHDRecording: product.FullHDRecording,
        VideoRecordingResolution: product.VideoRecordingResolution,
        DigitalZoom: product.DigitalZoom,
        FrameRate: product.FrameRate,
        DualCameraLens: product.DualCameraLens,
        CallFeatures: product.CallFeatures,
        SpeakerPhone: product.SpeakerPhone,
        ConnectivityFeatures: product.ConnectivityFeatures,
        NetworkType: product.NetworkType,
        SupportedNetwork: product.SupportedNetwork,
        InternetConnectivity: product.InternetConnectivity,
        PreinstalledBrowser: product.PreinstalledBrowser,
        MicroUSBVersion: product.MicroUSBVersion,
        BluetoothSupport: product.BluetoothSupport,
        BluetoothVersion: product.BluetoothVersion,
        WifiVersion: product.WifiVersion,
        WiFiHotspot: product.WiFiHotspot,
        NFC: product.NFC,
        GPSSupport: product.GPSSupport,
        OtherDetails: product.OtherDetails,
        SmartPhone: product.SmartPhone,
        SIMSize: product.SIMSize,
        SMS: product.SMS,
        VoiceInput: product.VoiceInput,
        GraphicPPI: product.GraphicPPI,
        Sensors: product.Sensors,
        OtherFeatures: product.OtherFeatures,
        GPSType: product.GPSType,
        MultimediaFeatures: product.MultimediaFeatures,
        VideoFormats: product.VideoFormats,
        BatteryPowerFeatures: product.BatteryPowerFeatures,
        BatteryCapacity: product.BatteryCapacity,
        Dimensions: product.Dimensions,
        Width: product.Width,
        Height: product.Height,
        Depth: product.Depth,
        Weight: product.Weight,
        Warranty: product.Warranty,
        product: product,
        //watch
        DialShape: product.DialShape,
        StrapColor: product.StrapColor,
        StrapMaterial: product.StrapMaterial,
        Size: product.Size,
        touchscreenWatch: product.touchscreenWatch,
        WaterResistant: product.WaterResistant,
        WaterResistanceDepth: product.WaterResistanceDepth,
        Usage: product.Usage,
        DialColor: product.DialColor,
        DialMaterial: product.DialMaterial,
        IdealFor: product.IdealFor,
        CompatibleOS: product.CompatibleOS,
        Closure: product.Closure,
        Notification: product.Notification,
        NotificationType: product.NotificationType,
        Talktime: product.Talktime,
        BatteryLife: product.BatteryLife,
        RechargeableBattery: product.RechargeableBattery,
        ChargerType: product.ChargerType,
        StandByTime: product.StandByTime,
        CallFunction: product.CallFunction,
        Bluetooth: product.Bluetooth,
        MessagingSupport: product.MessagingSupport,
        DisplayResolution: product.DisplayResolution,
        BacklightDisplay: product.BacklightDisplay,
        ScratchResistant: product.ScratchResistant,
        CalorieCount: product.CalorieCount,
        StepCount: product.StepCount,
        HeartRateMonitor: product.HeartRateMonitor,
        OtherFitnessFeatures: product.OtherFitnessFeatures,
        Calendar: product.Calendar,
        AlarmClock: product.AlarmClock,
        NumberofButtons: product.NumberofButtons,
        Speaker: product.Speaker,
        Microphone: product.Microphone,
        VoiceControl: product.VoiceControl,
        Thickness: product.Thickness,
        Diameter: product.Diameter,
        //earphone
        WithMicEP: product.WithMicEP,
        BatteryLifeEP: product.BatteryLifeEP,
        HeadphoneTypeEP: product.HeadphoneTypeEP,
        SalesPackageEP: product.SalesPackageEP,
        ConnectivityEP: product.ConnectivityEP,
        HeadphoneDesignEP: product.HeadphoneDesignEP,
        AccessoriesIncludedEP: product.AccessoriesIncludedEP,
        CompatatibleDevicesEP: product.CompatatibleDevicesEP,
        NetQuantityEP: product.NetQuantityEP,
        SweatProofEP: product.SweatProofEP,
        DeepBassEP: product.DeepBassEP,
        DesignForEP: product.DesignForEP,
        SystemRequirmentsEP: product.SystemRequirmentsEP,
        IndicatorEP: product.IndicatorEP,
        ControlsEP: product.ControlsEP,
        HeadphoneDriveUnitsEP: product.HeadphoneDriveUnitsEP,
        WithMicrophoneEP: product.WithMicrophoneEP,
        WirelessRangeEP: product.WirelessRangeEP,
        BluetoothVersionEP: product.BluetoothVersionEP,
        BluetoothRangeEP: product.BluetoothRangeEP,
        ChargingTimeEP: product.ChargingTimeEP,
        PlayTimeEP: product.PlayTimeEP,
        StandbytimeEP: product.StandbytimeEP,
        WidthEP: product.WidthEP,
        HeightEP: product.HeightEP,
        DepthEP: product.DepthEP,
        WeightEP: product.WeightEP,
        //speaker
        TypeSP:product.TypeSP,
        BluetoothSP:product.BluetoothSP,
        MemoryCardSlotSP:product.MemoryCardSlotSP,
        ConfigurationSP:product.ConfigurationSP,
        PowerOutputSP:product.PowerOutputSP,
        ColorSP:product.ColorSP,
        WiredWirelessSP:product.WiredWirelessSP,
        HeadphoneJackSP:product.HeadphoneJackSP,
        CompatibleDevicesSP:product.CompatibleDevicesSP,
        BatterySP:product.BatterySP,
        USBPortsSP:product.USBPortsSP,
        BluetoothVersionSP:product.BluetoothVersionSP,
        BatteryLifeSP:product.BatteryLifeSP,
        WirelessRangeSP:product.WirelessRangeSP,
        WidthSP:product.WidthSP,
        HeightSP:product.HeightSP,
        DepthSP:product.DepthSP,
        //powerbank
        PowerSourcePB:product.PowerSourcePB,
        CapacityPB:product.CapacityPB,
        NumberofOutputPortsPB:product.NumberofOutputPortsPB,
        ChargingCableIncludedPB:product.ChargingCableIncludedPB,
        PowerSupplyPB:product.PowerSupplyPB,
        OutputPowerPB:product.OutputPowerPB,
        OtherFeaturesPB:product.OtherFeaturesPB,
        widthPB:product.widthPB,
        DepthPB:product.DepthPB,
        WeightPB:product.WeightPB,
        //charger
        OutputInterfaceC:product.OutputInterfaceC,
        LEDIndicatorC :product.LEDIndicatorC ,
        DisplayC :product.DisplayC,
        ConnectorTypeC :product.ConnectorTypeC,
        NumberOfDeviceBatteriesChangedC :product.NumberOfDeviceBatteriesChangedC,
        DesignedForC :product.DesignedForC,
        NumberOfChargerPinsC :product.NumberOfChargerPinsC,
        WidthxHeightxDepthC :product.WidthxHeightxDepthC,
        WeightC :product.WeightC,
        OtherFeaturesC :product.OtherFeaturesC,
        CableTypeC :product.CableTypeC,
        PowerInputC :product.PowerInputC,
        PowerSourceC :product.PowerSourceC,
        OutputCurrentC :product.OutputCurrentC,
        SecondarySlotOutputC :product.SecondarySlotOutputC,
        OutputWattageC :product.OutputWattageC,
        OtherPowerFeaturesC :product.OtherPowerFeaturesC,
        //storagedevice
        ModelNumberSD :product.ModelNumberSD,
        WeightSD :product.WeightSD,
        RamSizeSD :product.RamSizeSD,
        MemoryStorageCapacitySD :product.MemoryStorageCapacitySD,
        FlashMemoryTypeSD :product.FlashMemoryTypeSD,
        DigitalStorageCapacitySD :product.DigitalStorageCapacitySD,
        HardWareInterfaceSD :product.HardWareInterfaceSD,
        CampatibleDevicesSD :product.CampatibleDevicesSD,
        SpecialFeatureSD :product.SpecialFeatureSD,
        ItemWeightSD :product.ItemWeightSD,
      });
    }
  } catch (err) {
    console.error(err);
    res.redirect("/");
  }
});

// Update product route
router.post("/update_product/:id", upload, async (req, res) => {
  try {
    let id = req.params.id;
    const updateData = {
      product: req.body.product,
      model: req.body.model,
      price: req.body.price,
      discountPercentage: req.body.discountPercentage,
      imagePath1: req.files.imagePath1 ? req.files.imagePath1[0].filename : req.body.ImagePath1,
      imagePath2: req.files.imagePath2 ? req.files.imagePath2[0].filename : req.body.ImagePath2,
      imagePath3: req.files.imagePath3 ? req.files.imagePath3[0].filename : req.body.ImagePath3,
      imagePath4: req.files.imagePath4 ? req.files.imagePath4[0].filename : req.body.ImagePath4,
      imagePath5: req.files.imagePath5 ? req.files.imagePath5[0].filename : req.body.ImagePath5,
      imagePath6: req.files.imagePath6 ? req.files.imagePath6[0].filename : req.body.ImagePath6,
      
      category: req.body.category,
      brand: req.body.brand,
      description: req.body.description,
      ram: req.body.ram,
      rom: req.body.rom,
      battery: req.body.battery,
      display: req.body.display,
      processor: req.body.processor,
      camera: req.body.camera,
      Color: req.body.Color,
      BrowseType: req.body.BrowseType,
      SimType: req.body.SimType,
      HybridsimSlot: req.body.HybridsimSlot,
      touchscreen: req.body.touchscreen,
      OTGCompatible: req.body.OTGCompatible,
      QuickCharging: req.body.QuickCharging,
      SoundEnhancements: req.body.SoundEnhancements,
      DisplayFeatures: req.body.DisplayFeatures,
      DisplaySize: req.body.DisplaySize,
      ResolutionType: req.body.ResolutionType,
      DisplayType: req.body.DisplayType,
      OtherDisplayFeatures: req.body.OtherDisplayFeatures,
      OsProcessorFeature: req.body.OsProcessorFeature,
      OperationSystem: req.body.OperationSystem,
      ProcessorType: req.body.ProcessorType,
      OperationFrequency: req.body.OperationFrequency,
      MemoryStorageFeatures: req.body.MemoryStorageFeatures,
      InternalStorage: req.body.InternalStorage,
      CameraFeatures: req.body.CameraFeatures,
      PrimaryCameraAvailable: req.body.PrimaryCameraAvailable,
      PrimaryCamera: req.body.PrimaryCamera,
      PrimaryCameraFeatures: req.body.PrimaryCameraFeatures,
      SecondaryCameraAvailable: req.body.SecondaryCameraAvailable,
      SecondaryCamera: req.body.SecondaryCamera,
      SecondaryCameraFeature: req.body.SecondaryCameraFeature,
      HDRecording: req.body.HDRecording,
      FullHDRecording: req.body.FullHDRecording,
      VideoRecordingResolution: req.body.VideoRecordingResolution,
      DigitalZoom: req.body.DigitalZoom,
      FrameRate: req.body.FrameRate,
      DualCameraLens: req.body.DualCameraLens,
      CallFeatures: req.body.CallFeatures,
      SpeakerPhone: req.body.SpeakerPhone,
      ConnectivityFeatures: req.body.ConnectivityFeatures,
      NetworkType: req.body.NetworkType,
      SupportedNetwork: req.body.SupportedNetwork,
      InternetConnectivity: req.body.InternetConnectivity,
      PreinstalledBrowser: req.body.PreinstalledBrowser,
      MicroUSBVersion: req.body.MicroUSBVersion,
      BluetoothSupport: req.body.BluetoothSupport,
      BluetoothVersion: req.body.BluetoothVersion,
      WifiVersion: req.body.WifiVersion,
      WiFiHotspot: req.body.WiFiHotspot,
      NFC: req.body.NFC,
      GPSSupport: req.body.GPSSupport,
      OtherDetails: req.body.OtherDetails,
      SmartPhone: req.body.SmartPhone,
      SIMSize: req.body.SIMSize,
      SMS: req.body.SMS,
      VoiceInput: req.body.VoiceInput,
      GraphicPPI: req.body.GraphicPPI,
      Sensors: req.body.Sensors,
      OtherFeatures: req.body.OtherFeatures,
      GPSType: req.body.GPSType,
      MultimediaFeatures: req.body.MultimediaFeatures,
      VideoFormats: req.body.VideoFormats,
      BatteryPowerFeatures: req.body.BatteryPowerFeatures,
      BatteryCapacity: req.body.BatteryCapacity,
      Dimensions: req.body.Dimensions,
      Width: req.body.Width,
      Height: req.body.Height,
      Depth: req.body.Depth,
      Weight: req.body.Weight,
      Warranty: req.body.Warranty,
      //watch
      DialColor: req.body.DialColor,
      DialShape: req.body.DialShape,
      StrapColor: req.body.StrapColor,
      StrapMaterial: req.body.StrapMaterial,
      Size: req.body.Size,
      touchscreenWatch: req.body.touchscreenWatch,
      WaterResistant: req.body.WaterResistant,
      WaterResistanceDepth: req.body.WaterResistanceDepth,
      Usage: req.body.Usage,
      DialMaterial: req.body.DialMaterial,
      IdealFor: req.body.IdealFor,
      CompatibleOS: req.body.CompatibleOS,
      Closure: req.body.Closure,
      Notification: req.body.Notification,
      NotificationType: req.body.NotificationType,
      Talktime: req.body.Talktime,
      BatteryLife: req.body.BatteryLife,
      RechargeableBattery: req.body.RechargeableBattery,
      ChargerType: req.body.ChargerType,
      StandByTime: req.body.StandByTime,
      CallFunction: req.body.CallFunction,
      Bluetooth: req.body.Bluetooth,
      MessagingSupport: req.body.MessagingSupport,
      DisplayResolution: req.body.DisplayResolution,
      BacklightDisplay: req.body.BacklightDisplay,
      ScratchResistant: req.body.ScratchResistant,
      CalorieCount: req.body.CalorieCount,
      StepCount: req.body.StepCount,
      HeartRateMonitor: req.body.HeartRateMonitor,
      OtherFitnessFeatures: req.body.OtherFitnessFeatures,
      Calendar: req.body.Calendar,
      AlarmClock: req.body.AlarmClock,
      NumberofButtons: req.body.NumberofButtons,
      Speaker: req.body.Speaker,
      Microphone: req.body.Microphone,
      VoiceControl: req.body.VoiceControl,
      Thickness: req.body.Thickness,
      Diameter: req.body.Diameter,
      //earphone
      WithMicEP: req.body.WithMicEP,
      BatteryLifeEP: req.body.BatteryLifeEP,
      HeadphoneTypeEP: req.body.HeadphoneTypeEP,
      SalesPackageEP: req.body.SalesPackageEP,
      ConnectivityEP: req.body.ConnectivityEP,
      HeadphoneDesignEP: req.body.HeadphoneDesignEP,
      AccessoriesIncludedEP: req.body.AccessoriesIncludedEP,
      CompatatibleDevicesEP: req.body.CompatatibleDevicesEP,
      NetQuantityEP: req.body.NetQuantityEP,
      SweatProofEP: req.body.SweatProofEP,
      DeepBassEP: req.body.DeepBassEP,
      DesignForEP: req.body.DesignForEP,
      SystemRequirmentsEP: req.body.SystemRequirmentsEP,
      IndicatorEP: req.body.IndicatorEP,
      ControlsEP: req.body.ControlsEP,
      HeadphoneDriveUnitsEP: req.body.HeadphoneDriveUnitsEP,
      WithMicrophoneEP: req.body.WithMicrophoneEP,
      WirelessRangeEP: req.body.WirelessRangeEP,
      BluetoothVersionEP: req.body.BluetoothVersionEP,
      BluetoothRangeEP: req.body.BluetoothRangeEP,
      ChargingTimeEP: req.body.ChargingTimeEP,
      PlayTimeEP: req.body.PlayTimeEP,
      StandbytimeEP: req.body.StandbytimeEP,
      WidthEP: req.body.WidthEP,
      HeightEP: req.body.HeightEP,
      DepthEP: req.body.DepthEP,
      WeightEP: req.body.WeightEP,
      //speaker
      TypeSP:req.body.TypeSP,
      BluetoothSP:req.body.BluetoothSP,
      MemoryCardSlotSP:req.body.MemoryCardSlotSP,
      ConfigurationSP:req.body.ConfigurationSP,
      PowerOutputSP:req.body.PowerOutputSP,
      ColorSP:req.body.ColorSP,
      WiredWirelessSP:req.body.WiredWirelessSP,
      HeadphoneJackSP:req.body.HeadphoneJackSP,
      CompatibleDevicesSP:req.body.CompatibleDevicesSP,
      BatterySP:req.body.BatterySP,
      USBPortsSP:req.body.USBPortsSP,
      BluetoothVersionSP:req.body.BluetoothVersionSP,
      BatteryLifeSP:req.body.BatteryLifeSP,
      WirelessRangeSP:req.body.WirelessRangeSP,
      WidthSP:req.body.WidthSP,
      HeightSP:req.body.HeightSP,
      DepthSP:req.body.DepthSP,
      //powerbank
      PowerSourcePB:req.body.PowerSourcePB,
      CapacityPB:req.body.CapacityPB,
      NumberofOutputPortsPB:req.body.NumberofOutputPortsPB,
      ChargingCableIncludedPB:req.body.ChargingCableIncludedPB,
      PowerSupplyPB:req.body.PowerSupplyPB,
      OutputPowerPB:req.body.OutputPowerPB,
      OtherFeaturesPB:req.body.OtherFeaturesPB,
      widthPB:req.body.widthPB,
      DepthPB:req.body.DepthPB,
      WeightPB:req.body.WeightPB,
      //charger
      OutputInterfaceC:req.body.OutputInterfaceC,
      LEDIndicatorC :req.body.LEDIndicatorC ,
      DisplayC :req.body.DisplayC,
      ConnectorTypeC :req.body.ConnectorTypeC,
      NumberOfDeviceBatteriesChangedC :req.body.NumberOfDeviceBatteriesChangedC,
      DesignedForC :req.body.DesignedForC,
      NumberOfChargerPinsC :req.body.NumberOfChargerPinsC,
      WidthxHeightxDepthC :req.body.WidthxHeightxDepthC,
      WeightC :req.body.WeightC,
      OtherFeaturesC :req.body.OtherFeaturesC,
      CableTypeC :req.body.CableTypeC,
      PowerInputC :req.body.PowerInputC,
      PowerSourceC :req.body.PowerSourceC,
      OutputCurrentC :req.body.OutputCurrentC,
      SecondarySlotOutputC :req.body.SecondarySlotOutputC,
      OutputWattageC :req.body.OutputWattageC,
      OtherPowerFeaturesC :req.body.OtherPowerFeaturesC,
      //storagedevice
      ModelNumberSD :req.body.ModelNumberSD,
      WeightSD :req.body.WeightSD,
      RamSizeSD :req.body.RamSizeSD,
      MemoryStorageCapacitySD :req.body.MemoryStorageCapacitySD,
      FlashMemoryTypeSD :req.body.FlashMemoryTypeSD,
      DigitalStorageCapacitySD :req.body.DigitalStorageCapacitySD,
      HardWareInterfaceSD :req.body.HardWareInterfaceSD,
      CampatibleDevicesSD :req.body.CampatibleDevicesSD,
      SpecialFeatureSD :req.body.SpecialFeatureSD,
      ItemWeightSD :req.body.ItemWeightSD,
    };

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedProduct) {
      return res.json({ message: "Product not found", type: "danger" });
    }

    req.session.message = {
      type: "success",
      message: "Product updated successfully",
    };
    res.redirect("/admin_product");
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error", type: "danger" });
  }
});

// Delete product route
router.get("/delete_product/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res
        .status(404)
        .json({ message: "Product not found", type: "danger" });
    }

    req.session.message = {
      type: "success",
      message: "Product deleted successfully",
    };
    res.redirect("/admin_product");
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error", type: "danger" });
  }
});

//razorpay
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

router.post('/create-order', async (req, res) => {
  const { amount } = req.body;

  try {
      // Convert amount to the smallest currency unit (e.g., paise for INR)
      const razorpayAmount = parseInt(amount * 100);

      const order = await razorpayInstance.orders.create({
          amount: razorpayAmount, // amount in the smallest currency unit
          currency: "INR",
          payment_capture: 1
      });

      res.json({
          orderId: order.id,
          amount: order.amount,
          currency: order.currency
      });
  } catch (error) {
      console.error('Error creating order:', error);
      res.status(500).json({ error: 'Failed to create order' });
  }
});

router.post("/payment-verification", (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    const hmac = crypto.createHmac("sha256", key_secret);

    hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
    const generatedSignature = hmac.digest("hex");

    if (generatedSignature === razorpay_signature) {
        // Payment is successful
        res.send({ status: "success" });
        res.redirect('/checkout')
    } else {
        // Payment failed
        res.send({ status: "failure" });
    }
});

module.exports = router;
