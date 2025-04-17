function GetPluginSettings() {
	return {
		"name":			"GameJolt",				// as appears in 'insert object' dialog, can be changed as long as "id" stays the same
		"id":			"GameJolt",				// this is used to identify this plugin and is saved to the project; never change it
		"version":		"1.1",					// (float in x.y format) Plugin version - C2 shows compatibility warnings based on this
		"description":	"http://gamejolt.com API implementation by YellowAfterlife.",
		"author":		"YellowAfterlife",
		"help url":		"http://gamejolt.com/games/other/construct-2-api-demo/22058/",
		"category":		"Platform specific",				// Prefer to re-use existing categories, but you can set anything here
		"type":			"object",				// either "world" (appears in layout and is drawn), else "object"
		"rotatable":	false,					// only used when "type" is "world".  Enables an angle property on the object.
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
AddCondition(1, cf_none, "Is logged in", "User", "Is logged in",
	"True if user is logged in, false if guest.", "IsLoggedIn");
AddCondition(0, cf_trigger, "On login", "User", "On login",
	"Triggered when user is successfully logged in", "OnLogin");
AddCondition(20, cf_trigger, "Trophy unlocked", "Trophy", "Trophy unlocked",
	"Triggered when a trophy has been successfully unlocked", "OnTrophy");
AddCondition(21, cf_trigger, "Trophy data", "Trophy", "Trophy data",
	"Triggered when trophy data is received.", "OnTrophyData");
AddCondition(30, cf_trigger, "Score sumbitted", "Score", "Score sumbitted",
	"Triggered when score has been successfully submitted", "OnScore");
AddCondition(31, cf_trigger, "Scores received", "Score", "Scores received",
	"Triggered when score entries have been received.", "OnScoreStart");
AddCondition(32, cf_trigger, "Scores entry", "Score", "Scores entry",
	"Triggered for every score entry received.", "OnScoreItem");
AddCondition(33, cf_trigger, "Scores complete", "Score", "Scores complete",
	"Triggered after all entries have been processed.", "OnScoreEnd");
//
AddCondition(41, cf_trigger, "Store data received", "Data Store", "Store data received",
	"Triggered for `get` actions when response arrives.", "OnStoreGet");
AddCondition(42, cf_trigger, "Store data submitted", "Data Store", "Store data submitted",
	"Triggered for `set` actions when confirmation arrives.", "OnStoreSet");
AddCondition(43, cf_trigger, "Store data removed", "Data Store", "Store data removed",
	"Triggered for `remove` actions when confirmation arrives.", "OnStoreRemove");
AddCondition(44, cf_trigger, "Store data updated", "Data Store", "Store data updated",
	"Triggered for `update` actions when confirmation arrives.", "OnStoreUpdate");

////////////////////////////////////////
// Actions

// AddAction(id,				// any positive integer to uniquely identify this action
//			 flags,				// (see docs) af_none, af_deprecated
//			 list_name,			// appears in event wizard list
//			 category,			// category in event wizard list
//			 display_str,		// as appears in event sheet - use {0}, {1} for parameters and also <b></b>, <i></i>
//			 description,		// appears in event wizard dialog when selected
//			 script_name);		// corresponding runtime function name

// User
AddStringParam("Username", "");
AddStringParam("Token", "");
AddAction(0, af_none, "Auth", "User",
	"Authenticate as {0}",
	"Authenticates the user's information. This action is for debugging purposes - users will be logged in automatically once the game is uploaded.", "UserAuth");
AddAction(1, af_none, "Set guest name", "User",
	"Set guest name to {0}",
	"Sets user as guest with given name. This will log out the user if they are logged in.", "UserGuest");
// Sessions
AddAction(10, af_none, "Open session", "Session", "Open session",
	"Opens a game session for current user.", "SessionOpen");
AddAction(11, af_none, "Close session", "Session", "Close session",
	"Closes currently active game session.", "SessionClose");
AddComboParamOption("active");
AddComboParamOption("idle");
AddComboParamOption("auto");
AddComboParam("Status", "New session status", 0);
AddAction(12, af_none, "Set session status", "Session", "Set session status to {0}",
	"Changes current session status", "SessionStatus");
//{ Trophies
AddNumberParam("Trophy ID", "As seen on your dashboard.", 0);
AddAction(20, af_none, "Unlock trophy", "Trophy", "Unlock trophy {0}",
	"Adds given trophy to user's achieved trophies", "TrophyAchieve");
//
AddStringParam("Trophy ID(s)", "As seen on your dashboard.", "");
AddComboParamOption("all");
AddComboParamOption("achieved");
AddComboParamOption("unachieved");
AddComboParam("Filter", "New session status", 0);
AddAction(21, af_none, "Fetch trophies", "Trophy", "Fetch {1} trophy(ies) with id(s) {0}",
	"Fetches status and information about given trophy(ies). Triggers `Trophy Data`.", "TrophyFetch");
//}
//{ Scores
// ScoreAdd:
AddNumberParam("Value", "Numeric value, for sorting.", 0);
AddStringParam("Score", "String value, for display.", "0");
AddNumberParam("Table ID", "Highscore table to submit to. Leave as 0 for default.", 0);
AddStringParam("Extra data", "Any additional information to store (as string)", "");
AddAction(30, af_none, "Add score", "Scores",
	"Add score of `{1}` ({0}) to table {2}",
	"Adds score for user or guest.",
	"ScoreAdd");
// ScoreGet:
AddNumberParam("Table ID", "Highscore table to fetch from. Leave as 0 for default.", 0);
AddNumberParam("Limit", "Number of scores to fetch.", 10);
AddAction(31, af_none, "Get scores", "Scores",
	"Get {1} score(s) from table {0}",
	"Fetches scores from given table.",
	"ScoreGet");
// ScoreGetLocal:
AddNumberParam("Table ID", "Highscore table to fetch from. Leave as 0 for default.", 0);
AddNumberParam("Limit", "Number of scores to fetch.", 10);
AddAction(32, af_none, "Get local scores", "Scores",
	"Get {1} local score(s) from table {0}",
	"Fetches current user's scores from given table.",
	"ScoreGetLocal");
//}
//{ Store
AddStringParam("Key", "Global key to fetch value from.", "");
AddAction(40, af_none, "Get global value", "Data Store",
	"Get a global value from {0}",
	"Retrieves a value from specified global key.",
	"StoreGetGlobal");
AddStringParam("Key", "Local key to fetch value from.", "");
AddAction(41, af_none, "Get local value", "Data Store",
	"Get a local value from {0}",
	"Retrieves a value from specified local key.",
	"StoreGetLocal");
//
AddStringParam("Key", "Global key to change value at.", "");
AddStringParam("Value", "New value.", "");
AddAction(42, af_none, "Set global value", "Data Store",
	"Set a global value at {0} to {1}",
	"Changes a value at specified global key.",
	"StoreSetGlobal");
AddStringParam("Key", "Local key to change value at.", "");
AddStringParam("Value", "New value.", "");
AddAction(43, af_none, "Set local value", "Data Store",
	"Set a local value at {0} to {1}",
	"Changes a value at specified local key.",
	"StoreSetLocal");
//
AddStringParam("Key", "Global key to remove value from.", "");
AddAction(44, af_none, "Remove global value", "Data Store",
	"Remove a global value from {0}",
	"Removes a value from specified global key.",
	"StoreRemoveGlobal");
AddStringParam("Key", "Local key to remove value from.", "");
AddAction(45, af_none, "Remove local value", "Data Store",
	"Remove a local value from {0}",
	"Removes a value from specified local key.",
	"StoreRemoveLocal");
//
AddStringParam("Key", "Global key to update value at.", "");
AddStringParam("Operation", "Operation to perform. See http://gamejolt.com/api/doc/game/data-store/update/ for the list.", "");
AddStringParam("Value", "Value to update with.", "");
AddAction(46, af_none, "Update global value", "Data Store",
	"Update a global value at {0} with operation `{1}` and value {2}",
	"Performs an operation over specified global key.",
	"StoreUpdateGlobal");
AddStringParam("Key", "Local key to update value at.", "");
AddStringParam("Operation", "Operation to perform. See http://gamejolt.com/api/doc/game/data-store/update/ for the list.", "");
AddStringParam("Value", "Value to update with.", "");
AddAction(47, af_none, "Update local value", "Data Store",
	"Update a local value at {0} with operation `{1}` and value {2}",
	"Performs an operation over specified local key.",
	"StoreUpdateLocal");
//
//}

////////////////////////////////////////
// Expressions

// AddExpression(id,			// any positive integer to uniquely identify this expression
//				 flags,			// (see docs) ef_none, ef_deprecated, ef_return_number, ef_return_string,
//								// ef_return_any, ef_variadic_parameters (one return flag must be specified)
//				 list_name,		// currently ignored, but set as if appeared in event wizard
//				 category,		// category in expressions panel
//				 exp_name,		// the expression name after the dot, e.g. "foo" for "myobject.foo" - also the runtime function name
//				 description);	// description in expressions panel
AddExpression(0, ef_return_string, "Username", "User", "Username", "Name of the current user.");
//
AddExpression(20, ef_return_number, "Trophy Id", "Trophy", "TrophyId", "");
AddExpression(21, ef_return_string, "Trophy Title", "Trophy", "TrophyTitle", "");
AddExpression(22, ef_return_string, "Trophy Description", "Trophy", "TrophyDescription", "");
AddExpression(23, ef_return_string, "Trophy Difficulty", "Trophy", "TrophyDifficulty", "");
AddExpression(24, ef_return_string, "Trophy Image URL", "Trophy", "TrophyImageURL", "");
AddExpression(25, ef_return_string, "Trophy Achieved", "Trophy", "TrophyAchieved", "Empty string if not achieved yet, time otherwise.");
//
AddExpression(30, ef_return_number, "Score place", "Score", "ScorePlace", "Number of place (1..count) of score item.");
AddExpression(31, ef_return_number, "Score count", "Score", "ScoreCount", "Number of scores entries received in score events.");
AddExpression(32, ef_return_string, "Score name", "Score", "ScoreUserName", "Name of score entry owner.");
AddExpression(33, ef_return_number, "Score id", "Score", "ScoreUserId", "Id of score entry owner (-1 if guest).");
AddExpression(34, ef_return_string, "Score text", "Score", "ScoreText", "Textual/display value of score entry.");
AddExpression(35, ef_return_number, "Score value", "Score", "ScoreValue", "Numeric value of score entry.");
AddExpression(36, ef_return_string, "Score extra data", "Score", "ScoreExtra", "Extra data for score entry.");
AddExpression(37, ef_return_string, "Score submission time", "Score", "ScoreTime", "Relative time the score was submitted at, e.g. `2 hours ago`.");
AddExpression(38, ef_return_number, "Score table", "Score", "ScoreTable", "ID of score table that entries are returned for.");
AddExpression(39, ef_return_number, "Score local", "Score", "ScoreLocal", "Whether returned scores are global (0) or local (1)..");
//
AddExpression(41, ef_return_string, "Store key", "Data Store", "StoreKey", "Related data store key.");
AddExpression(42, ef_return_string, "Store value", "Data Store", "StoreValue", "Related data store value (if available).");
AddExpression(43, ef_return_number, "Store local", "Data Store", "StoreLocal", "Whether completed operation was global (0) or local (1).");

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
	new cr.Property(ept_integer, "Game ID", 22058,
		"As seen on the right side of your Achievements tab."),
	new cr.Property(ept_text, "Private Key", "07ef5a14de8435ec8bb7586f3cfd139a",
		"The one that you should not give to anyone."),
	new cr.Property(ept_combo, "Log requests", "False",
		"Sends request URLs into console. For debugging purposes.", "False|True"),
];
	
// Called by IDE when a new object type is to be created
function CreateIDEObjectType() {
	return new IDEObjectType();
}

// Class representing an object type in the IDE
function IDEObjectType() {
	assert2(this instanceof arguments.callee, "Constructor called as a function");
}

// Called by IDE when a new object instance of this type is to be created
IDEObjectType.prototype.CreateInstance = function(instance) {
	return new IDEInstance(instance);
}

// Class representing an individual instance of an object in the IDE
function IDEInstance(instance, type) {
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
IDEInstance.prototype.OnInserted = function() { }

// Called when double clicked in layout
IDEInstance.prototype.OnDoubleClicked = function() { }

// Called after a property has been changed in the properties bar
IDEInstance.prototype.OnPropertyChanged = function(property_name) { }

// For rendered objects to load fonts or textures
IDEInstance.prototype.OnRendererInit = function(renderer) { }

// Called to draw self in the editor if a layout object
IDEInstance.prototype.Draw = function(renderer) { }

// For rendered objects to release fonts or textures
IDEInstance.prototype.OnRendererReleased = function(renderer) { }