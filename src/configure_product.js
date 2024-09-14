const mongoose = require('mongoose')
const dotenv = require('dotenv');

dotenv.config();
const connect = mongoose.connect(process.env.MONGO_URI);
connect.then(() => {
    console.log('connect')
})
    .catch(() => {
        console.log('not connect')
    })

const productschema = new mongoose.Schema({
    product: {
        type: String,
        required: false,
    },
    model: {
        type: String,
        required: false
    },
    price: {
        type: String,
        required: false
    },
    discountPercentage: {
        type: String,
        required: false
    },
    ram: {
        type: String,
        required: false
    },
    rom: {
        type: String,
        required: false
    },
    battery: {
        type: String,
        required: false
    },
    display: {
        type: String,
        required: false
    },
    processor: {
        type: String,
        required: false
    },
    camera: {
        type: String,
        required: false
    },
    imagePath1: {
        type: String,
        required: false
    },
    imagePath2: {
        type: String,
        required: false
    },
    imagePath3: {
        type: String,
        required: false
    },
    imagePath4: {
        type: String,
        required: false
    },
    imagePath5: {
        type: String,
        required: false
    },
    imagePath6: {
        type: String,
        required: false
    },
    category: {
        type: String,
        required: false
    },
    brand: {
        type: String,
        required: false
    },
    blocked: {
        type: Boolean,
        default: false
    },
    Color: {
        type: String,
        required: false
    },
    BrowseType: {
        type: String,
        required: false
    },
    SimType: {
        type: String,
        required: false
    },
    HybridsimSlot: {
        type: String,
        required: false
    },
    touchscreen: {
        type: String,
        required: false
    },
    OTGCompatible: {
        type: String,
        required: false
    },
    QuickCharging: {
        type: String,
        required: false
    },
    SoundEnhancements: {
        type: String,
        required: false
    },
    DisplayFeatures: {
        type: String,
        required: false
    },
    DisplaySize: {
        type: String,
        required: false
    },
    ResolutionType: {
        type: String,
        required: false
    },
    DisplayType: {
        type: String,
        required: false
    },
    OtherDisplayFeatures: {
        type: String,
        required: false
    },
    OsProcessorFeature: {
        type: String,
        required: false
    },
    OperationSystem: {
        type: String,
        required: false
    },
    ProcessorType: {
        type: String,
        required: false
    },
    OperationFrequency: {
        type: String,
        required: false
    },
    MemoryStorageFeatures: {
        type: String,
        required: false
    },
    InternalStorage: {
        type: String,
        required: false
    },
    CameraFeatures: {
        type: String,
        required: false
    },
    PrimaryCameraAvailable: {
        type: String,
        required: false
    },
    PrimaryCamera: {
        type: String,
        required: false
    },
    PrimaryCameraFeatures: {
        type: String,
        required: false
    },
    SecondaryCameraAvailable: {
        type: String,
        required: false
    },
    SecondaryCamera: {
        type: String,
        required: false
    },
    SecondaryCameraFeatures: {
        type: String,
        required: false
    },
    HDRecording: {
        type: String,
        required: false
    },
    FullHDRecording: {
        type: String,
        required: false
    },
    VideoRecordingResolution: {
        type: String,
        required: false
    },
    DigitalZoom: {
        type: String,
        required: false
    },
    FrameRate: {
        type: String,
        required: false
    },
    DualCameraLens: {
        type: String,
        required: false
    },
    CallFeatures: {
        type: String,
        required: false
    },
    SpeakerPhone: {
        type: String,
        required: false
    },
    ConnectivityFeatures: {
        type: String,
        required: false
    },
    NetworkType: {
        type: String,
        required: false
    },
    SupportedNetwork: {
        type: String,
        required: false
    },
    InternetConnectivity: {
        type: String,
        required: false
    },
    PreinstalledBrowser: {
        type: String,
        required: false
    },
    MicroUSBVersion: {
        type: String,
        required: false
    },
    BluetoothSupport: {
        type: String,
        required: false
    },
    BluetoothVersion: {
        type: String,
        required: false
    },
    WifiVersion: {
        type: String,
        required: false
    },
    WiFiHotspot: {
        type: String,
        required: false
    },
    NFC: {
        type: String,
        required: false
    },
    GPSSupport: {
        type: String,
        required: false
    },
    OtherDetails: {
        type: String,
        required: false
    },
    SmartPhone: {
        type: String,
        required: false
    },
    SIMSize: {
        type: String,
        required: false
    },
    SMS: {
        type: String,
        required: false
    },
    VoiceInput: {
        type: String,
        required: false
    },
    GraphicPPI: {
        type: String,
        required: false
    },
    Sensors: {
        type: String,
        required: false
    },
    OtherFeatures: {
        type: String,
        required: false
    },
    GPSType: {
        type: String,
        required: false
    },
    MultimediaFeatures: {
        type: String,
        required: false
    },
    VideoFormats: {
        type: String,
        required: false
    },
    BatteryPowerFeatures: {
        type: String,
        required: false
    },
    BatteryCapacity: {
        type: String,
        required: false
    },
    Dimensions: {
        type: String,
        required: false
    },
    Width: {
        type: String,
        required: false
    },
    Height: {
        type: String,
        required: false
    },
    Depth: {
        type: String,
        required: false
    },
    Weight: {
        type: String,
        required: false
    },
    Warranty: {
        type: String,
        required: false
    },                       // watch session
    DialColor: {
        type: String,
        required: false
    },
    DialShape: {
        type: String,
        required: false
    },
    StrapColor:{
        type:String,
        required:false
    },
    StrapMaterial: {
        type: String,
        required: false
    },
    Size: {
        type: String,
        required: false
    },
    WaterResistant: {
        type: String,
        required: false
    },
    WaterResistanceDepth: {
        type: String,
        required: false
    },
    Usage: {
        type: String,
        required: false
    },
    
    DialMaterial: {
        type: String,
        required: false
    },
    IdealFor: {
        type: String,
        required: false
    },
    touchscreenWatch:{
        type:String,
        required:false
    },
    CompatibleOS: {
        type: String,
        required: false
    },
    Closure: {
        type: String,
        required: false
    },
    Notification: {
        type: String,
        required: false
    },
    NotificationType: {
        type: String,
        required: false
    },
    Talktime: {
        type: String,
        required: false
    },
    BatteryLife: {
        type: String,
        required: false
    },
    RechargeableBattery: {
        type: String,
        required: false
    },
    ChargerType: {
        type: String,
        required: false
    },
    StandByTime: {
        type: String,
        required: false
    },
    CallFunction: {
        type: String,
        required: false
    },
    Bluetooth: {
        type: String,
        required: false
    },
    MessagingSupport: {
        type: String,
        required: false
    },
    
    DisplayResolution: {
        type: String,
        required: false
    },
    BacklightDisplay: {
        type: String,
        required: false
    },
    ScratchResistant: {
        type: String,
        required: false
    },
    CalorieCount: {
        type: String,
        required: false
    },
    StepCount: {
        type: String,
        required: false
    },
    HeartRateMonitor: {
        type: String,
        required: false
    },
    OtherFitnessFeatures: {
        type: String,
        required: false
    },
    Calendar: {
        type: String,
        required: false
    },
    AlarmClock: {
        type: String,
        required: false
    },
    NumberofButtons: {
        type: String,
        required: false
    },
    Speaker: {
        type: String,
        required: false
    },
    Microphone: {
        type: String,
        required: false
    },
    VoiceControl: {
        type: String,
        required: false
    },
    Thickness: {
        type: String,
        required: false
    },
    Diameter: {
        type: String,
        required: false
    },
    //earphone
    WithMicEP:{
        type: String,
        required: false
    },
    BatteryLifeEP:{
        type: String,
        required: false
    },
    HeadphoneTypeEP:{
        type: String,
        required: false
    },
    SalesPackageEP:{
        type: String,
        required: false
    },
    ConnectivityEP:{
        type: String,
        required: false
    },
    HeadphoneDesignEP:{
        type: String,
        required: false
    },
    AccessoriesIncludedEP:{
        type: String,
        required: false
    },
    CompatatibleDevicesEP:{
        type: String,
        required: false
    },
    NetQuantityEP:{
        type: String,
        required: false
    },
    SweatProofEP:{
        type: String,
        required: false
    },
    DeepBassEP:{
        type: String,
        required: false
    },
    DesignForEP:{
        type: String,
        required: false
    },
    SystemRequirmentsEP:{
        type: String,
        required: false
    },
    IndicatorEP:{
        type: String,
        required: false
    },
    ControlsEP:{
        type: String,
        required: false
    },
    HeadphoneDriveUnitsEP:{
        type: String,
        required: false
    },
    WithMicrophoneEP:{
        type: String,
        required: false
    },
    WirelessRangeEP:{
        type: String,
        required: false
    },
    BluetoothVersionEP:{
        type: String,
        required: false
    },
    BluetoothRangeEP:{
        type: String,
        required: false
    },
    ChargingTimeEP:{
        type: String,
        required: false
    },
    PlayTimeEP:{
        type: String,
        required: false
    },
    StandbytimeEP:{
        type: String,
        required: false
    },
    WidthEP:{
        type: String,
        required: false
    },
    HeightEP:{
        type: String,
        required: false
    },
    DepthEP:{
        type: String,
        required: false
    },
    WeightEP:{
        type: String,
        required: false
    },
    //speaker
    TypeSP:{
        type: String,
        required: false
    },
    BluetoothSP:{
        type: String,
        required: false
    },
    MemoryCardSlotSP:{
        type: String,
        required: false
    },
    ConfigurationSP:{
        type: String,
        required: false
    },
    PowerOutputSP:{
        type: String,
        required: false
    },
    ColorSP:{
        type: String,
        required: false
    },
    WiredWirelessSP:{
        type: String,
        required: false
    },
    HeadphoneJackSP:{
        type: String,
        required: false
    },
    CompatibleDevicesSP:{
        type: String,
        required: false
    },
    BatterySP:{
        type: String,
        required: false
    },
    USBPortsSP:{
        type: String,
        required: false
    },
    BluetoothVersionSP:{
        type: String,
        required: false
    },
    BatteryLifeSP:{
        type: String,
        required: false
    },
    WirelessRangeSP:{
        type: String,
        required: false
    },
    WidthSP:{
        type: String,
        required: false
    },
    HeightSP:{
        type: String,
        required: false
    },
    DepthSP:{
        type: String,
        required: false
    },
    //powerbank
    PowerSourcePB:{
        type: String,
        required: false
    },
    CapacityPB:{
        type: String,
        required: false
    },
    NumberofOutputPortsPB:{
        type: String,
        required: false
    },
    ChargingCableIncludedPB:{
        type: String,
        required: false
    },
    PowerSupplyPB:{
        type: String,
        required: false
    },
    OutputPowerPB:{
        type: String,
        required: false
    },
    OtherFeaturesPB:{
        type: String,
        required: false
    },
    widthPB:{
        type: String,
        required: false
    },
    DepthPB:{
        type: String,
        required: false
    },
    WeightPB:{
        type: String,
        required: false
    },
    //charger
    OutputInterfaceC:{
        type: String,
        required: false
    },
    LEDIndicatorC:{
        type: String,
        required: false
    },
    DisplayC:{
        type: String,
        required: false
    },
    ConnectorTypeC:{
        type: String,
        required: false
    },
    NumberOfDeviceBatteriesChangedC:{
        type: String,
        required: false
    },
    DesignedForC:{
        type: String,
        required: false
    },
    NumberOfChargerPinsC:{
        type: String,
        required: false
    },
    WidthxHeightxDepthC:{
        type: String,
        required: false
    },
    WeightC:{
        type: String,
        required: false
    },
    OtherFeaturesC:{
        type: String,
        required: false
    },
    CableTypeC:{
        type: String,
        required: false
    },
    PowerInputC:{
        type: String,
        required: false
    },
    PowerSourceC:{
        type: String,
        required: false
    },
    OutputCurrentC:{
        type: String,
        required: false
    },
    SecondarySlotOutputC:{
        type: String,
        required: false
    },
    OutputWattageC:{
        type: String,
        required: false
    },
    OtherPowerFeaturesC:{
        type: String,
        required: false
    },
    //storagedevice
    ModelNumberSD:{
        type: String,
        required: false
    },
    WeightSD:{
        type: String,
        required: false
    },
    RamSizeSD:{
        type: String,
        required: false
    },
    MemoryStorageCapacitySD:{
        type: String,
        required: false
    },
    FlashMemoryTypeSD:{
        type: String,
        required: false
    },
    DigitalStorageCapacitySD:{
        type: String,
        required: false
    },
    HardWareInterfaceSD:{
        type: String,
        required: false
    },
    CampatibleDevicesSD:{
        type: String,
        required: false
    },
    SpecialFeatureSD:{
        type: String,
        required: false
    },
    ItemWeightSD:{
        type: String,
        required: false
    },
})

//collection part
const Product = mongoose.model('Product', productschema);

module.exports = Product;
