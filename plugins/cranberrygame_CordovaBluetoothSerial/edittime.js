function GetPluginSettings()
{
	return {
		"name":			"Cordova BluetoothSerial",				// as appears in 'insert object' dialog, can be changed as long as "id" stays the same
		"id":			"cranberrygame_CordovaBluetoothSerial",				// this is used to identify this plugin and is saved to the project; never change it
		"version":		"1.0.15",					// (float in x.y format) Plugin version - C2 shows compatibility warnings based on this
		"description":	"enables serial communication over bluetooth.",
		"author":		"cranberrygame",
		"help url":		"http://cranberrygame.github.io?referrer=edittime.js",
		"category":		"Cordova extension",				// Prefer to re-use existing categories, but you can set anything here
		"type":			"object",				// either "world" (appears in layout and is drawn), else "object"
		"rotatable":	false,					// only used when "type" is "world".  Enables an angle property on the object.
/*
//cranberrygame start
com.megster.cordova.bluetoothserial
phonegap build service: https://build.phonegap.com/plugins/1256
cordova registry: http://plugins.cordova.io/#/package/com.megster.cordova.bluetoothserial
github: https://github.com/don/BluetoothSerial/tree/0.4.3
//cranberrygame end
*/
		"cordova-plugins":	"com.megster.cordova.bluetoothserial@0.4.3",
		"flags":		0						// uncomment lines to enable flags...
						| pf_singleglobal		// exists project-wide, e.g. mouse, keyboard.  "type" must be "object".
					//	| pf_texture			// object has a single texture (e.g. tiled background)
					//	| pf_position_aces		// compare/set/get x, y...
					//	| pf_size_aces			// compare/set/get width, height...
					//	| pf_angle_aces			// compare/set/get angle (recommended that "rotatable" be set to true)
					//	| pf_appearance_aces	// compare/set/get visible, opacity...
					//	| pf_tiling				// adjusts image editor features to better suit tiled images (e.g. tiled background)
					//	| pf_animations			// enables the animations system.  See 'Sprite' for usage
					//	| pf_zorder_aces		// move to top, bottom, layer...
					//  | pf_nosize				// prevent resizing in the editor
					//	| pf_effects			// allow WebGL shader effects to be added
					//  | pf_predraw			// set for any plugin which draws and is not a sprite (i.e. does not simply draw
												// a single non-tiling image the size of the object) - required for effects to work properly
/*
		// example
		,"dependency": "three.min.js;OBJLoader.js"
*/
//cranberrygame start
//cranberrygame start												
	};
};

////////////////////////////////////////
// Parameter types:
// AddNumberParam(label, description [, initial_string = "0"])			// a number
// AddStringParam(label, description [, initial_string = "\"\""])		// a string
// AddAnyTypeParam(label, description [, initial_string = "0"])			// accepts either a number or string
// AddCmpParam(label, description)										// combo with equal, not equal, less, etc.
// AddComboParamOption(text)											// (repeat before "AddComboParam" to add combo items)
// AddComboParam(label, description [, initial_selection = 0])			// a dropdown list parameter
// AddObjectParam(label, description)									// a button to click and pick an object type
// AddLayerParam(label, description)									// accepts either a layer number or name (string)
// AddLayoutParam(label, description)									// a dropdown list with all project layouts
// AddKeybParam(label, description)										// a button to click and press a key (returns a VK)
// AddAnimationParam(label, description)								// a string intended to specify an animation name
// AddAudioFileParam(label, description)								// a dropdown list with all imported project audio files

////////////////////////////////////////
// Conditions

// AddCondition(id,					// any positive integer to uniquely identify this condition
//				flags,				// (see docs) cf_none, cf_trigger, cf_fake_trigger, cf_static, cf_not_invertible,
//									// cf_deprecated, cf_incompatible_with_triggers, cf_looping
//				list_name,			// appears in event wizard list
//				category,			// category in event wizard list
//				display_str,		// as appears in event sheet - use {0}, {1} for parameters and also <b></b>, <i></i>
//				description,		// appears in event wizard dialog when selected
//				script_name);		// corresponding runtime function name

/*				
// example				
AddNumberParam("Number", "Enter a number to test if positive.");
AddCondition(0, cf_none, "Is number positive", "My category", "{0} is positive", "Description for my condition!", "MyCondition");
AddCondition(1, cf_trigger, "Trigger Condition", "My category", "Trigger Condition", "Triggered when TriggerAction", "TriggerCondition");//cranberrygame
*/
//cranberrygame start
AddCondition(0, cf_trigger, "On check bluetooth enabled enabled", "My category", "On check bluetooth enabled enabled", "Triggered when TriggerAction", "OnCheckBluetoothEnabledEnabled");//cranberrygame
AddCondition(1, cf_trigger, "On check bluetooth enabled disabled", "My category", "On check bluetooth enabled disabled", "Triggered when TriggerAction", "OnCheckBluetoothEnabledDisabled");//cranberrygame
AddCondition(2, cf_trigger, "On paired device list found", "My category", "On paired device list found", "Triggered when TriggerAction", "OnPairedDeviceListFound");//cranberrygame
AddCondition(3, cf_trigger, "On paired device list not found", "My category", "On paired device list not found", "Triggered when TriggerAction", "OnPairedDeviceListNotFound");//cranberrygame
AddCondition(4, cf_trigger, "On connect succeeded", "My category", "On connect succeeded", "Triggered when TriggerAction", "OnConnectSucceeded");//cranberrygame
AddCondition(5, cf_trigger, "On connect failed", "My category", "On connect failed", "Triggered when TriggerAction", "OnConnectFailed");//cranberrygame
AddCondition(6, cf_trigger, "On connect insecure succeeded", "My category", "On connect insecure succeeded", "Triggered when TriggerAction", "OnConnectInsecureSucceeded");//cranberrygame
AddCondition(7, cf_trigger, "On connect insecure failed", "My category", "On connect insecure failed", "Triggered when TriggerAction", "OnConnectInsecureFailed");//cranberrygame
AddCondition(8, cf_trigger, "On disconnect succeeded", "My category", "On disconnect succeeded", "Triggered when TriggerAction", "OnDisconnectSucceeded");//cranberrygame
AddCondition(9, cf_trigger, "On disconnect failed", "My category", "On disconnect failed", "Triggered when TriggerAction", "OnDisconnectFailed");//cranberrygame
AddCondition(10, cf_trigger, "On check connected connected", "My category", "On check connected connected", "Triggered when TriggerAction", "OnCheckConnectedConnected");//cranberrygame
AddCondition(11, cf_trigger, "On check connected disconnected", "My category", "On check connected disconnected", "Triggered when TriggerAction", "OnCheckConnectedDisconnected");//cranberrygame
AddCondition(12, cf_trigger, "On write succeeded", "My category", "On write succeeded", "Triggered when TriggerAction", "OnWriteSucceeded");//cranberrygame
AddCondition(13, cf_trigger, "On write failed", "My category", "On write failed", "Triggered when TriggerAction", "OnWriteFailed");//cranberrygame
AddCondition(14, cf_trigger, "On read data", "My category", "On read data", "Triggered when TriggerAction", "OnReadData");//cranberrygame
AddCondition(15, cf_trigger, "On read until data", "My category", "On read until data", "Triggered when TriggerAction", "OnReadUntilData");//cranberrygame
AddCondition(16, cf_trigger, "On subscribe data", "My category", "On subscribe data", "Triggered when TriggerAction", "OnSubscribeData");//cranberrygame
AddCondition(17, cf_trigger, "On unsubscribe succeeded", "My category", "On unsubscribe succeeded", "Triggered when TriggerAction", "OnUnsubscribeSucceeded");//cranberrygame
AddCondition(18, cf_trigger, "On unsubscribe failed", "My category", "On unsubscribe failed", "Triggered when TriggerAction", "OnUnsubscribeFailed");//cranberrygame
//cranberrygame end
	
////////////////////////////////////////
// Actions

// AddAction(id,				// any positive integer to uniquely identify this action
//			 flags,				// (see docs) af_none, af_deprecated
//			 list_name,			// appears in event wizard list
//			 category,			// category in event wizard list
//			 display_str,		// as appears in event sheet - use {0}, {1} for parameters and also <b></b>, <i></i>
//			 description,		// appears in event wizard dialog when selected
//			 script_name);		// corresponding runtime function name

/*
// example
AddStringParam("Message", "Enter a string to alert.");
AddAction(0, af_none, "Alert", "My category", "Alert {0}", "Description for my action!", "MyAction");
AddAction(1, af_none, "Trigger Action", "My category", "Trigger Action", "Trigger TriggerCondition", "TriggerAction");//cranberrygame
*/
//cranberrygame start
AddAction(0, af_none, "Check bluetooth enabled", "My category", "Check bluetooth enabled", "Description for my action!", "CheckBluetoothEnabled");
AddAction(1, af_none, "Paired device list", "My category", "Paired device list", "Description for my action!", "PairedDeviceList");
AddStringParam("Mac address", "Enter mac address.");
AddAction(2, af_none, "Connect", "My category", "Connect {0}", "Description for my action!", "Connect");
AddStringParam("Mac address", "Enter mac address.");
AddAction(3, af_none, "Connect insecure", "My category", "Connect insecure {0}", "Description for my action!", "ConnectInsecure");
AddAction(4, af_none, "Disconnect", "My category", "Disconnect", "Description for my action!", "Disconnect");
AddAction(5, af_none, "Check connected", "My category", "Check connected", "Description for my action!", "CheckConnected");
AddStringParam("data", "Enter data. ex) \"my message\\n\"", "\"my message\\n\"");
AddAction(6, af_none, "Write", "My category", "Write {0}", "Description for my action!", "Write");
AddAction(7, af_none, "Read", "My category", "Read", "Description for my action!", "Read");
AddStringParam("Delimiter", "Enter delimiter. ex) \"\\n\"", "\"\\n\"");
AddAction(8, af_none, "ReadUntil", "My category", "Read until {0}", "Description for my action!", "ReadUntil");
AddStringParam("Delimiter", "Enter delimiter. ex) \"\\n\"", "\"\\n\"");
AddAction(9, af_none, "Subscribe", "My category", "Subscribe {0}", "Description for my action!", "Subscribe");
AddAction(10, af_none, "Unsubscribe", "My category", "Unsubscribe", "Description for my action!", "Unsubscribe");
AddAction(11, af_none, "Clear", "My category", "Clear", "Description for my action!", "Clear");
//cranberrygame end

////////////////////////////////////////
// Expressions

// AddExpression(id,			// any positive integer to uniquely identify this expression
//				 flags,			// (see docs) ef_none, ef_deprecated, ef_return_number, ef_return_string,
//								// ef_return_any, ef_variadic_parameters (one return flag must be specified)
//				 list_name,		// currently ignored, but set as if appeared in event wizard
//				 category,		// category in expressions panel
//				 exp_name,		// the expression name after the dot, e.g. "foo" for "myobject.foo" - also the runtime function name
//				 description);	// description in expressions panel

/*
// example
AddExpression(0, ef_return_number, "Get cell x count", "My category", "MyExpression", "Get cell x count."); //cranberrygame
AddExpression(1, ef_return_string, "Get text.", "My category", "TextWithNoParam", "Get text."); //cranberrygame
AddStringParam("StringParam", "Enter string param");
AddExpression(2, ef_return_string, "Get text.", "My category", "Text", "Get text."); //cranberrygame
*/
//cranberrygame start
AddExpression(0, ef_return_number, "Get paired device count.", "My category", "PairedDeviceCount", "Get paired device count."); //cranberrygame
AddNumberParam("Index", "Enter index (0 ~)");
AddExpression(1, ef_return_string, "Get paired device name at.", "My category", "PairedDeviceNameAt", "Get paired device name at."); //cranberrygame
AddNumberParam("Index", "Enter index (0 ~)");
AddExpression(2, ef_return_string, "Get paired device macaddress at.", "My category", "PairedDeviceMacaddressAt", "Get paired device macaddress at."); //cranberrygame
AddExpression(3, ef_return_string, "Get read data.", "My category", "ReadData", "Get read data."); //cranberrygame
AddExpression(4, ef_return_string, "Get read until data.", "My category", "ReadUntilData", "Get read until data."); //cranberrygame
AddExpression(5, ef_return_string, "Get subscribe data.", "My category", "SubscribeData", "Get subscribe data."); //cranberrygame
//cranberrygame end

////////////////////////////////////////
ACESDone();

////////////////////////////////////////
// Array of property grid properties for this plugin
// new cr.Property(ept_integer,		name,	initial_value,	description)		// an integer value
// new cr.Property(ept_float,		name,	initial_value,	description)		// a float value
// new cr.Property(ept_text,		name,	initial_value,	description)		// a string
// new cr.Property(ept_color,		name,	initial_value,	description)		// a color dropdown
// new cr.Property(ept_font,		name,	"Arial,-16", 	description)		// a font with the given face name and size
// new cr.Property(ept_combo,		name,	"Item 1",		description, "Item 1|Item 2|Item 3")	// a dropdown list (initial_value is string of initially selected item)
// new cr.Property(ept_link,		name,	link_text,		description, "firstonly")		// has no associated value; simply calls "OnPropertyChanged" on click

var property_list = [
/*
	new cr.Property(ept_integer, 	"My property",		77,		"An example property.") //cranberrygame , this.properties[0] from runtime.js
*/
//cranberrygame start
//cranberrygame emd
	];
	
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

//cranberrygame start
//cranberrygame end
