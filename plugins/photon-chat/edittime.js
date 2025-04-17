
function GetPluginSettings()
{
	return {
		"name":			"Photon Chat",				// as appears in 'insert object' dialog, can be changed as long as "id" stays the same
		"id":			"PhotonChat",				// this is used to identify this plugin and is saved to the project; never change it
		"version":		"1.0",					// (float in x.y format) Plugin version - C2 shows compatibility warnings based on this
		"description":	"Easily integrate a cross-platform chat system in your apps that scales to any amount of concurrent chats",
		"author":		"Exit Games",
		"help url":		"doc.photonengine.com",
		"category":		"Web",					// Prefer to re-use existing categories, but you can set anything here
		"type":			"object",				// either "world" (appears in layout and is drawn), else "object"
		"rotatable":	false,					// only used when "type" is "world".  Enables an angle property on the object.
		"dependency":	"Photon-Javascript_SDK.min.js",
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
				
// example				



AddCondition(0, cf_trigger, "On error", "Client", "On error", "Triggered on error.", "onError");
AddCondition(1, cf_trigger, "On state change", "Client", "On state change", "Triggered on client state change.", "onStateChange");
//onOperationResponse
AddStringParam("Channel", "Channel name.");
AddCondition(11, cf_trigger, "On message in channel", "Chat", "On message in <b>{0}</b> channel", "Triggered on new message in specified channel.", "onMessageInChannel");
AddCondition(12, cf_trigger, "On message", "Chat", "On message", "Triggered on new message in any channel.", "onMessage");
AddStringParam("Channel", "Channel name.");
AddCondition(13, cf_trigger, "On private message in channel", "Chat", "On message in private <b>{0}</b> channel", "Triggered on new message in specified private channel.", "onPrivateMessageInChannel");
AddCondition(14, cf_trigger, "On private message", "Chat", "On private message", "Triggered on new message in any private channel.", "onPrivateMessage");
AddCondition(21, cf_trigger, "On user status update", "Chat", "On user status update", "Triggered when friend changed his status.", "onUserStatusUpdate");
AddComboParamOption("Success");
AddComboParamOption("Failure");
AddComboParam("Success", "Channel subscription result");
AddCondition(22, cf_trigger, "On subscribe result", "Chat", "On subscribe <b>{0}</b>", "Triggered when result of subscription request received.", "onSubscribeResult");
AddComboParamOption("Success");
AddComboParamOption("Failure");
AddComboParam("Success", "Channel unsubscription result");
AddCondition(23, cf_trigger, "On unsubscribe result", "Chat", "On unsubscribe <b>{0}</b>", "Triggered when result of unsubscription request received.", "onUnsubscribeResult");


AddCondition(31, cf_trigger, "On connected to Front End", "Connection", "On connected to Front End", "Triggered when client connects to Front End and ready to chat.", "onConnectedToFrontEnd");

AddCondition(41, cf_none, "Is connected to Nameserver", "Connection", "Is connected to Nameserver", "True if client connected to Nameserver.", "isConnectedToNameServer");
AddCondition(42, cf_none, "Is connected to Front End", "Connection", "Is connected to Front End server", "True if client connected to Front End server.", "isConnectedToFrontEnd");

////////////////////////////////////////

// Actions

// AddAction(id,				// any positive integer to uniquely identify this action
//			 flags,				// (see docs) af_none, af_deprecated
//			 list_name,			// appears in event wizard list
//			 category,			// category in event wizard list
//			 display_str,		// as appears in event sheet - use {0}, {1} for parameters and also <b></b>, <i></i>
//			 description,		// appears in event wizard dialog when selected
//			 script_name);		// corresponding runtime function name

// example
//AddStringParam("Message", "Enter a string to alert.");

AddStringParam("UserId", "User id.");
AddAction(0, af_none, "Set user id", "Connection", "Set optional user id to <b>{0}</b>", "Set optional user id (required by some cloud services).", "setUserId");
AddStringParam("AuthParameters", "Parameters expected by the used authentication service.");
AddComboParamOption("Custom", "Custom Default. Use a custom authentification service. ");
AddComboParamOption("Steam", "Steam Authenticates users by their Steam Account. Set auth values accordingly.");
AddComboParamOption("Facebook", "Facebook Authenticates users by their Facebook Account. Set auth values accordingly.");
//AddComboParamOption("None", "Disables custom authentification."); // None = 255 and needs additional mapping from combo list to enum
AddComboParam("AuthType", "The type of custom authentication provider that should be used.");
AddAction(1, af_none, "Set custom authentication", "Connection", "Enable custom authentication of type <b>{1}</b> and set it's parameters to <b>{0}</b>", "Enable custom authentication and set it's parameters.", "setCustomAuthentication");
AddStringParam("Region", "Region.");
AddAction(5, af_none, "Set region", "Connection", "Set Master server region to <b>{0}</b>", "Set Master server region.", "setRegion");
AddStringParam("App id", "App id.");
AddAction(6, af_none, "Set app id", "Connection", "Set app id to <b>{0}</b>", "Set app id.", "setAppId");
AddStringParam("App version", "App version.");
AddAction(7, af_none, "Set app version", "Connection", "Set app version to <b>{0}</b>", "Set app version.", "setAppVersion");
AddAction(10, af_none, "Connect", "Connection", "Connect to the name server", "Connect to the name server.", "connect");
AddAction(11, af_none, "Disconnect", "Connection", "Disconnect from all servers", "Disconnect from all servers.", "disconnect");
AddStringParam("Channels", "Comma-separated list of channels.");
AddNumberParam("History", "Controls messages history sent on subscription. 0: no history. 1 and higher: number of messages in history. -1: all history.");
AddStringParam("LastIds", "Comma-separated list of last messages IDs.");
AddAction(21, af_none, "Subscribe", "Chat", "Subscribe to channels <b>{0}</b> (history length: <b>{1}</b>, last IDs: <b>{2}</b>)", "Subscribe to channels.", "subscribe");
AddStringParam("Channels", "Comma-separated list of channels.");
AddAction(22, af_none, "Unsubscribe", "Chat", "Unsubscribe from channels <b>{0}</b>", "Unsubscribe from channels.", "unsubscribe");
AddStringParam("Channel", "Channel name.");
AddStringParam("Message", "Message.");
AddAction(31, af_none, "Publish message", "Chat", "Send message <b>{1}</b> to public channel <b>{0}</b>", "Send message to a public channel.", "publishMessage");
AddStringParam("UserId", "User id.");
AddStringParam("Message", "Message.");
AddAction(32, af_none, "Send private message", "Chat", "Send private message <b>{1}</b> to user <b>{0}</b>", "Send private message to a single target user.", "sendPrivateMessage");
AddStringParam("UserIds", "Comma-separated list of user ids.");
AddAction(42, af_none, "Add friends", "Chat", "Add <b>{0}</b> to friend list", "Add entries to the list of users sending you status updates.", "addFriends");
AddStringParam("UserIds", "Comma-separated list of user ids.");
AddAction(43, af_none, "Remove friends", "Chat", "Remove <b>{0}</b> from friend list", "Remove entries from the list of users sending you status updates.", "removeFriends");

AddComboParamOption("Offline");
AddComboParamOption("Invisible");
AddComboParamOption("Online");
AddComboParamOption("Custom");
AddComboParam("Status", "Status");
AddNumberParam("Custom Status", "Custom Status");
AddComboParamOption("Don't send");
AddComboParamOption("Send");
AddComboParam("Message Option", "Status message option.");
AddStringParam("Message", "Status message.");
AddAction(51, af_none, "Set user status", "Chat", "Set user's status to <b>{0}</b> (custom <b>{1}</b>). <b>{2}</b> status message <b>{3}</b>", "Set user's status and an optional message.", "setUserStatus");

AddAction(201, af_none, "Reset", "Common", "Reset", "Disconnects and creates new client instance.", "reset");

////////////////////////////////////////
// Expressions

// AddExpression(id,			// any positive integer to uniquely identify this expression
//				 flags,			// (see docs) ef_none, ef_deprecated, ef_return_number, ef_return_string,
//								// ef_return_any, ef_variadic_parameters (one return flag must be specified)
//				 list_name,		// currently ignored, but set as if appeared in event wizard
//				 category,		// category in expressions panel
//				 exp_name,		// the expression name after the dot, e.g. "foo" for "myobject.foo" - also the runtime function name
//				 description);	// description in expressions panel

// example
AddExpression(10, ef_return_number, "ErrorCode", "Client", "ErrorCode", "Last error code.");
AddExpression(20, ef_return_string, "ErrorMessage", "Client", "ErrorMessage", "Last error message.");
AddExpression(30, ef_return_number, "State", "Connection", "State", "Current client state.");
AddExpression(40, ef_return_string, "StateString", "Connection", "StateString", "Current client state string.");
AddExpression(50, ef_return_number, "UserId", "Connection", "UserId", "Previously set user id.");

AddExpression(60, ef_return_string, "Channel", "Chat", "Channel", "Channel name set in last condition.");
AddExpression(70, ef_return_string, "Message", "Chat", "Message", "Message set in last condition.");
AddExpression(80, ef_return_string, "Sender", "Chat", "Sender", "Sender set in last condition.");
AddExpression(90, ef_return_string, "UserStatusUserId", "Chat", "UserStatusUserId", "Id of user which status was last updated.");
AddExpression(110, ef_return_number, "UserStatus", "Chat", "UserStatus", "Last updated user status.");
AddExpression(140, ef_return_string, "UserStatusString", "Chat", "UserStatusString", "Message sent along with last user status update.");
AddExpression(120, ef_return_number, "UserStatusMessageUpdated", "Chat", "UserStatusMessageUpdated", "True is message was sent along with last user status update.");
AddExpression(130, ef_return_string, "UserStatusMessage", "Chat", "UserStatusMessage", "Message sent along with last user status update.");

AddStringParam("Channel", "Channel name.");
AddExpression(150, ef_return_number, "ChannelLastMessageID", "Chat", "ChannelLastMessageID", "Channel <b>{0}</b> last message ID");

	
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
	new cr.Property(ept_text, 	"AppId",				"<app-id>",			"Application id."),
	new cr.Property(ept_text, 	"AppVersion", 			"1.0",				"Application version."),
	new cr.Property(ept_combo, 	"Protocol",				"ws",				"Connection protocol.", "ws|wss"),
	new cr.Property(ept_combo, 	"Region",				"EU",				"Master server region.", "EU|US|Asia"),
	new cr.Property(ept_combo, 	"LogLevel",				"INFO",				"Logging level.", "DEBUG|INFO|WARN|ERROR|OFF")
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
};

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
};

// Called when double clicked in layout
IDEInstance.prototype.OnDoubleClicked = function()
{
};

// Called after a property has been changed in the properties bar
IDEInstance.prototype.OnPropertyChanged = function(property_name)
{
};

// For rendered objects to load fonts or textures
IDEInstance.prototype.OnRendererInit = function(renderer)
{
};

// Called to draw self in the editor if a layout object
IDEInstance.prototype.Draw = function(renderer)
{
};

// For rendered objects to release fonts or textures
IDEInstance.prototype.OnRendererReleased = function(renderer)
{
};