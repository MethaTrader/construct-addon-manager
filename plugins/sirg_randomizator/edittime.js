function GetPluginSettings()
{
	return {
		"name":			"Randomizator",				// as appears in 'insert object' dialog, can be changed as long as "id" stays the same
		"id":			"sirg_randomizator",				// this is used to identify this plugin and is saved to the project; never change it
		"version":		"1.0",					// (float in x.y format) Plugin version - C2 shows compatibility warnings based on this
		"description":	"Randomizator plugin provides random data",
		"author":		"Sir_G",
		"help url":		"sirg2003@gmail.com",
		"category":		"Data & Storage",				// Prefer to re-use existing categories, but you can set anything here
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
		,
        "dependency":	"chance.min.js"
	};
};

////////////////////////////////////////
// Parameter types:
// //AddNumberParam(label, description [, initial_string = "0"])			// a number
// //AddStringParam(label, description [, initial_string = "\"\""])		// a string
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
// //AddCondition(id,					// any positive integer to uniquely identify this condition
//				flags,				// (see docs) cf_none, cf_trigger, cf_fake_trigger, cf_static, cf_not_invertible,
//									// cf_deprecated, cf_incompatible_with_triggers, cf_looping
//				list_name,			// appears in event wizard list
//				category,			// category in event wizard list
//				display_str,		// as appears in event sheet - use {0}, {1} for parameters and also <b></b>, <i></i>
//				description,		// appears in event wizard dialog when selected
//				script_name);		// corresponding runtime function name
////////////////////////////////////////
// Actions
// //AddAction(id,				// any positive integer to uniquely identify this action
//			 flags,				// (see docs) af_none, af_deprecated
//			 list_name,			// appears in event wizard list
//			 category,			// category in event wizard list
//			 display_str,		// as appears in event sheet - use {0}, {1} for parameters and also <b></b>, <i></i>
//			 description,		// appears in event wizard dialog when selected
//			 script_name);		// corresponding runtime function name
////////////////////////////////////////
// Expressions
// //AddExpression(id,			// any positive integer to uniquely identify this expression
//				 flags,			// (see docs) ef_none, ef_deprecated, ef_return_number, ef_return_string,
//								// ef_return_any, ef_variadic_parameters (one return flag must be specified)
//				 list_name,		// currently ignored, but set as if appeared in event wizard
//				 category,		// category in expressions panel
//				 exp_name,		// the expression name after the dot, e.g. "foo" for "myobject.foo" - also the runtime function name
//				 description);	// description in expressions panel

AddAnyTypeParam("Min", "Min value.");
AddAnyTypeParam("Max", "Max value.");
AddExpression(0, ef_return_number, "Random integer", "Randomizator - numbers", "randomInt", "Return a random integer. These min and max are inclusive, so they are included in the range.");

AddAnyTypeParam("Number", "Your number.");
AddAnyTypeParam("Width", "Number width.");
AddExpression(1, ef_return_any, "Random pad", "Randomizator - numbers", "randomPad", "Pad a number with some string until it reaches a desired width.");

AddAnyTypeParam("Items", "Items array, separated by \";\".");
AddAnyTypeParam("Separator", "Array separator.");
AddExpression(2, ef_return_any, "Random array item", "Randomizator - arrays", "randomFromArr", "Pick a random element from string of elements, separated by Array Separator. Example: \"potato;salad;strawberry;blueberry;onion\" return \"salad\"");

AddAnyTypeParam("Items", "Items array, separated by \";\".");
AddAnyTypeParam("Separator", "Array separator.");
AddExpression(3, ef_return_any, "Shuffle array", "Randomizator - arrays", "shuffleArr", "Pick a random element from string of elements, separated by Array Separator. Example: \"potato;salad;strawberry;blueberry;onion\" return \"salad\"");
/*
AddAnyTypeParam("Number", "Dice number.");
AddExpression(4, ef_return_number, "Random dice number", "Randomizator - numbers", "dice", "Return a random integer. These min and max are inclusive, so they are included in the range.");
*/
AddAnyTypeParam("Number", "Mean number.");
AddAnyTypeParam("Deviation", "Deviation number.");
AddExpression(5, ef_return_number, "Random mean number", "Randomizator - numbers", "mean", "Return a normally-distributed random variate. For example, to get a random IQ (which by definition has a mean of 100 and a standard deviation of 15) => 85.11040121833615");

AddAnyTypeParam("Length", "Array length (items count).");
AddAnyTypeParam("Min", "Min value.");
AddAnyTypeParam("Max", "Max value.");
AddAnyTypeParam("Separator", "Array separator.","\";\"");
AddExpression(6, ef_return_number, "Random unique numbers", "Randomizator - numbers", "uniqueNumbers", "Generate a random array string of unique (not repeating) items with a length matching the one you specified.");

AddAnyTypeParam("Array items", "Array items.");
AddAnyTypeParam("Weigth", "Array weigth.");
AddAnyTypeParam("Separator", "Array separator.","\";\"");
AddExpression(7, ef_return_number, "Random weighted item", "Randomizator - arrays", "weighted", "Provide an array of items, and another array of items specifying the relative weights and Randomizator will select one of those items, obeying the specified weight. The weights are all relative, so if you have more than just two it will ensure that all items are generated relative to all of the weights. ");

AddAnyTypeParam("Chance", "Chance to return \"1\". Example: if specify 30 - there is 30% percent to return \"1\", and a 70% return \"0\"");
AddExpression(8, ef_return_number, "Random chance", "Randomizator - numbers", "randomChance", "Return a random boolean value (\"1\" or \"0\").Example: if specify 30 - there is 30% percent to return \"1\", and a 70% return \"0\"");

////////////////////////////////////////
ACESDone();

////////////////////////////////////////
// Array of property grid properties for this plugin
// //new cr.Property(ept_integer,		name,	initial_value,	description)		// an integer value
// //new cr.Property(ept_float,		name,	initial_value,	description)		// a float value
// //new cr.Property(ept_text,		name,	initial_value,	description)		// a string
// //new cr.Property(ept_color,		name,	initial_value,	description)		// a color dropdown
// //new cr.Property(ept_font,		name,	"Arial,-16", 	description)		// a font with the given face name and size
// //new cr.Property(ept_combo,		name,	"Item 1",		description, "Item 1|Item 2|Item 3")	// a dropdown list (initial_value is string of initially selected item)
// //new cr.Property(ept_link,		name,	link_text,		description, "firstonly")		// has no associated value; simply calls "OnPropertyChanged" on click

// Property grid properties for this plugin
var property_list = [];

// Called by IDE when a new object type is to be created
function CreateIDEObjectType()
{
	return new IDEObjectType();
};

// Class representing an object type in the IDE
function IDEObjectType()
{
	assert2(this instanceof arguments.callee, "Constructor called as a function");
};

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
	this.just_inserted = false;
};

IDEInstance.prototype.OnCreate = function()
{
};

IDEInstance.prototype.OnInserted = function()
{
};

IDEInstance.prototype.OnDoubleClicked = function()
{
};

// Called by the IDE after a property has been changed
IDEInstance.prototype.OnPropertyChanged = function(property_name)
{
};

IDEInstance.prototype.OnRendererInit = function(renderer)
{
};

// Called to draw self in the editor
IDEInstance.prototype.Draw = function(renderer)
{
};

IDEInstance.prototype.OnRendererReleased = function(renderer)
{
};