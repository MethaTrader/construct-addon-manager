function GetPluginSettings()
{
    return {
        "name": "Android Tools",
        "id": "AndroidTools",
        "version": "1.6.0",
        "description": "Usefull Android Tools Plugin",
        "author": "Vinoos",
        "help url": "http://vinoos.ir/plugins/android-tools.php",
        "category": "Vinoos",
        "type": "object",
        "rotatable": false,
        "cordova-plugins": "https://github.com/miladesign/cordova-plugin-android-tools",
        "flags": 0 | pf_singleglobal
    };
};

////////////////////////////////////////
// Conditions

AddCondition(0, cf_trigger, "On Vibration Available", "Device", "On Vibration Available", "On Vibration Available", "onVibrateSupported");
AddCondition(1, cf_trigger, "On Vibration Unavailable", "Device", "On Vibration Unavailable", "On Vibration Unavailable", "onVibrateNotSupported");
AddCondition(2, cf_trigger, "On Max Volume Level Received", "Device", "On Max Volume Level Received", "On Max Volume Level Received", "onMaxVolume");
AddCondition(3, cf_trigger, "On Dialog Button 1 Clicked", "Dialog", "On Dialog Button 1 Clicked", "On Dialog Button 1 Clicked", "onButton1Clicked");
AddCondition(4, cf_trigger, "On Dialog Button 2 Clicked", "Dialog", "On Dialog Button 2 Clicked", "On Dialog Button 2 Clicked", "onButton2Clicked");
AddCondition(5, cf_trigger, "On Dialog Button 3 Clicked", "Dialog", "On Dialog Button 3 Clicked", "On Dialog Button 3 Clicked", "onButton3Clicked");
AddCondition(6, cf_trigger, "On Input Dialog OK Button Clicked", "Dialog", "On Input Dialog Ok Button Clicked", "On Input Dialog Ok Button Clicked", "onInputSuccess");
AddCondition(7, cf_trigger, "On Input Dialog Cancel Button Clicked", "Dialog", "On Input Dialog Cancel Button Clicked", "On Input Dialog Cancel Button Clicked", "onInputCancel");

////////////////////////////////////////
// Actions
AddStringParam("Title", "Progress Dialog Title");
AddStringParam("Message", "Progress Dialog Message");
AddAction(0, af_none, "Show ProgressDialog", "Dialog", "Show ProgressDialog", "Show ProgressDialog", "ShowProgressDialog");
AddAction(1, af_none, "Hide ProgressDialog", "Dialog", "Hide ProgressDialog", "Hide ProgressDialog", "HideProgressDialog");
AddStringParam("Package Name", "Package Name. example: \"com.company.example\"");
AddAction(2, af_none, "Rate App", "CafeBazaar", "Rate App In CafeBazaar", "Rate App In CafeBazaar", "BazaarRate");
AddStringParam("Package Name", "Package Name. example: \"com.company.example\"");
AddAction(3, af_none, "App Page", "CafeBazaar", "Open App Page In CafeBazaar", "Open App Page In CafeBazaar", "BazaarApp");
AddStringParam("User Name", "Developer Username");
AddAction(4, af_none, "Developer Page", "CafeBazaar", "Open Developer Page In CafeBazaar", "Open Developer Page In CafeBazaar", "BazaarDeveloper");
AddStringParam("Package Name", "Package Name. example: \"com.company.example\"");
AddAction(5, af_none, "Rate App", "Myket", "Rate App In Myket", "Rate App In Myket", "MyketRate");
AddStringParam("Package Name", "Package Name. example: \"com.company.example\"");
AddAction(6, af_none, "App Page", "Myket", "Open App Page In Myket", "Open App Page In Myket", "MyketApp");
AddStringParam("Package Name", "Package Name. example: \"com.company.example\"");
AddAction(7, af_none, "Developer Page", "Myket", "Open Developer Page In Myket", "Open Developer Page In Myket", "MyketDeveloper");
AddStringParam("Package Name", "Package Name. example: \"com.company.example\"");
AddAction(8, af_none, "Rate App", "IranApps", "Rate App In IranApps", "Rate App In IranApps", "IranAppsRate");
AddStringParam("Package Name", "Package Name. example: \"com.company.example\"");
AddAction(9, af_none, "App Page", "IranApps", "Open App Page In IranApps", "Open App Page In IranApps", "IranAppsApp");
AddStringParam("User Name", "Developer Username");
AddAction(10, af_none, "Developer Page", "IranApps", "Open Developer Page In IranApps", "Open Developer Page In IranApps", "IranAppsDeveloper");
AddStringParam("Package Name", "Package Name. example: \"com.company.example\"");
AddAction(11, af_none, "Rate App", "Cando", "Rate App In Cando", "Rate App In Cando", "CandoRate");
AddStringParam("Package Name", "Package Name. example: \"com.company.example\"");
AddAction(12, af_none, "App Page", "Cando", "Open App Page In Cando", "Open App Page In Cando", "CandoApp");
AddStringParam("User Name", "Developer Username");
AddAction(13, af_none, "Developer Page", "Cando", "Open Developer Page In Cando", "Open Developer Page In Cando", "CandoDeveloper");
AddStringParam("Package Name", "Package Name. example: \"com.company.example\"");
AddAction(14, af_none, "Rate App", "Parshub", "Rate App In Parshub", "Rate App In Parshub", "ParshubRate");
AddStringParam("Package Name", "Package Name. example: \"com.company.example\"");
AddAction(15, af_none, "App Page", "Parshub", "Open App Page In Parshub", "Open App Page In Parshub", "ParshubApp");
AddStringParam("User Name", "Developer Username");
AddAction(16, af_none, "Developer Page", "Parshub", "Open Developer Page In Parshub", "Open Developer Page In Parshub", "ParshubDeveloper");
AddStringParam("Package Name", "Package Name. example: \"com.company.example\"");
AddAction(17, af_none, "App Page", "All Markets", "Open App Page In All Markets", "Open App Page In All Markets", "AllMarketsApp");
AddStringParam("Package Name", "Package Name. example: \"com.company.example\"");
AddAction(18, af_none, "Rate App", "Aval Market", "Open App Page In Aval Market", "Open App Page In Aval Market", "AvvalMarketRate");
AddStringParam("User Name", "Telegram Channel or Profile Username");
AddAction(19, af_none, "Open Telegram Channel or Profile", "Social", "Open Telegram Channel or Profile", "Open Telegram Channel or Profile", "TelegramProfile");
AddStringParam("User Name", "Instagram Username");
AddAction(20, af_none, "Open Instagram Page", "Social", "Open {0} Instagram Page", "Open Instagram Page", "InstagramProfile");
AddStringParam("Title", "Share Title");
AddStringParam("Message", "Share Text Message");
AddAction(21, af_none, "Share Text", "Share", "Share Text. Title: {0}. Message: {1}", "Share Text Message", "ShareText");
AddStringParam("Title", "Share Title");
AddStringParam("Package Name", "Package Name. example: \"com.company.example\"");
AddAction(22, af_none, "Share App File", "Share", "Share App File. Title: {0}. PackageName: {1}", "Share App File", "ShareApp");
AddStringParam("Title", "Dialog Title");
AddStringParam("Message", "Dialog Message");
AddStringParam("Button Text", "OK Button Text");
AddAction(23, af_none, "Show Dialog", "Dialog", "Show Dialog. Title: {0}. Message: {1}. Button Text: {2}", "Show Dialog Message", "ShowDialog");
AddStringParam("Title", "Dialog Title");
AddStringParam("Message", "Dialog Message");
AddStringParam("Yes Button Text", "Yes Button Text");
AddStringParam("No Button Text", "No Button Text");
AddAction(24, af_none, "Show Exit Dialog", "Dialog", "Show Exit Dialog. Title: {0}. Message: {1}", "Show Exit Dialog", "ExitDialog");
AddStringParam("Message", "Toast Message");
AddComboParamOption("Short");
AddComboParamOption("Long");
AddComboParam("Duration");
AddAction(25, af_none, "Show Toast Message", "Dialog", "Show {1} Toast. Message: {0}", "Show Toast", "ShowToast");
AddAction(26, af_none, "Check Vibrate Available", "Device", "Check Vibrate Available", "Check Vibrate Available", "VibrateSupported");
AddNumberParam("Duration", "Duration value in ms");
AddAction(27, af_none, "Vibrate Device", "Device", "Vibrate Device {0} ms", "Vibrate Device", "VibrateDevice");
AddStringParam("Message", "Toast Message");
AddComboParamOption("Short");
AddComboParamOption("Long");
AddComboParam("Duration");
AddComboParamOption("Default");
AddComboParamOption("Success");
AddComboParamOption("Error");
AddComboParamOption("Info");
AddComboParamOption("Warning");
AddComboParam("Type", "Toast Type");
AddAction(28, af_none, "Show Custom Toast Message", "Dialog", "Show <i>{2}</i> Toast {1}. Message: {0}", "Show Custom Toast Message", "CustomToast");
AddNumberParam("Value", "The brightness value between 0 and 1");
AddAction(29, af_none, "Set Screen Brightness", "Screen", "Set Screen Brightness to {0}", "Set Screen Brightness", "SetScreenBrightness");
AddStringParam("Package Name", "Package Name. example: \"com.company.example\"");
AddAction(30, af_none, "Open App", "Other", "Open App With Package Name: {0}", "Open App", "OpenApp");
AddStringParam("Site url", "Enter website url");
AddAction(31, af_none, "Open Url", "Other", "Open Url: {0}", "Open Site Url In Browser", "OpenUrl");
AddComboParamOption("Landscape");
AddComboParamOption("Portrait");
AddComboParamOption("Reverse Landscape");
AddComboParam("Type");
AddAction(32, af_none, "Set Screen Orientation", "Screen", "Set Screen Orientation to {0}", "Set Screen Orientation", "SetScreenOrientation");
AddStringParam("Phone Number", "Phone number with country code \"+989123456789\"");
AddAction(33, af_none, "Open Chat In WhatsApp", "Social", "Open Chat In WhatsApp With Number {0}", "Open Chat In WhatsApp", "OpenWhatsapp");
AddComboParamOption("Voice Call");
AddComboParamOption("System");
AddComboParamOption("Ring");
AddComboParamOption("Music");
AddComboParamOption("Alarm");
AddComboParamOption("Notification");
AddComboParam("Channel");
AddNumberParam("Value", "Volume Value");
AddComboParamOption("No");
AddComboParamOption("Yes");
AddComboParam("Show UI?");
AddAction(34, af_none, "Set Volume", "Device", "Set Volume. Channel: {0} | Value: {1}", "Set Volume", "SetVolume");
AddComboParamOption("Voice Call");
AddComboParamOption("System");
AddComboParamOption("Ring");
AddComboParamOption("Music");
AddComboParamOption("Alarm");
AddComboParamOption("Notification");
AddComboParam("Channel");
AddAction(35, af_none, "Get Max Volume", "Device", "Get Channel {0} Max Volume", "Get Max Volume", "GetMaxVolume");
AddComboParamOption("Silent");
AddComboParamOption("Vibrate");
AddComboParamOption("Normal");
AddComboParam("Mode");
AddAction(36, af_none, "Set Ringer Mode", "Device", "Set Ringer Mode to {0}", "Set Ringer Mode", "SetRingerMode");
AddStringParam("Title", "Dialog Title");
AddStringParam("Message", "Dialog Text");
AddStringParam("Button 1", "Button 1 Text. If empty not shown");
AddStringParam("Button 2", "Button 2 Text. If empty not shown");
AddStringParam("Button 3", "Button 3 Text. If empty not shown");
AddAction(37, af_none, "Custom Dialog", "Dialog", "Show Custom Dialog. Title: {0}. Text: {1}", "Show Custom Dialog", "ThreeDialog");
AddStringParam("Title", "Dialog Title");
AddStringParam("Message", "Dialog Message");
AddStringParam("Button OK");
AddStringParam("Button Cancel");
AddStringParam("Hint");
AddComboParamOption("Text");
AddComboParamOption("Number");
AddComboParamOption("Phone");
AddComboParamOption("Text Password");
AddComboParamOption("MultiLine Text");
AddComboParamOption("Date");
AddComboParam("Type");
AddStringParam("Date Format","If you have not chosen dates, leave blank");
AddAction(38, af_none, "Input Dialog", "Dialog", "Show Input Dialog. Title: {0}. Message: {1}. Type: {5}", "Show Input Dialog", "InputDialog");

////////////////////////////////////////
// Expressions
AddExpression(0, ef_return_string, "Get unique device id", "device", "get_id", "Get the unique id of the device. (Remains the same after app uninstall)");
AddExpression(1, ef_return_number, "Get Max Volume", "device", "maxVolume", "Get Max Volume");
AddExpression(2, ef_return_string, "Get Input text", "dialog", "getInput", "Get Input Dialog Text");

ACESDone();

////////////////////////////////////////
// Properties
var property_list = [];

// Called by IDE when a new object type is to be created
function CreateIDEObjectType()
{
    return new IDEObjectType();
}

// Class representing an object type in the IDE
function IDEObjectType()
{
    assert2(this instanceof arguments.callee, "Constructor called as a function");
}

// Called by IDE when a new object instance of this type is to be created
IDEObjectType.prototype.CreateInstance = function(instance)
{
    return new IDEInstance(instance);
}

// Class representing an individual instance of an object in the IDE
function IDEInstance(instance, type)
{
    assert2(this instanceof arguments.callee, "Constructor called as a function");

    // Save the constructor parameters
    this.instance = instance;
    this.type = type;

    // Set the default property values from the property table
    this.properties = {};

    for (var i = 0; i < property_list.length; i++)
        this.properties[property_list[i].name] = property_list[i].initial_value;

    // Plugin-specific variables
    // this.myValue = 0...
}

// Called when inserted via Insert Object Dialog for the first time
IDEInstance.prototype.OnInserted = function()
{
}

// Called when double clicked in layout
IDEInstance.prototype.OnDoubleClicked = function()
{
}

// Called after a property has been changed in the properties bar
IDEInstance.prototype.OnPropertyChanged = function(property_name)
{
}

// For rendered objects to load fonts or textures
IDEInstance.prototype.OnRendererInit = function(renderer)
{
}

// Called to draw self in the editor if a layout object
IDEInstance.prototype.Draw = function(renderer)
{
}

// For rendered objects to release fonts or textures
IDEInstance.prototype.OnRendererReleased = function(renderer)
{
}

