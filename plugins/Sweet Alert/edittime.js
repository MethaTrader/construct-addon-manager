﻿function GetPluginSettings()
{
	return {
		"name":			"PKP_SweetAlert",				// as appears in 'insert object' dialog, can be changed as long as "id" stays the same
		"id":			"PKP_SweetAlert",				// this is used to identify this plugin and is saved to the project; never change it
		"version":		"1.0",					// (float in x.y format) Plugin version - C2 shows compatibility warnings based on this
		"description":	"<appears at the bottom of the insert object dialog>",
		"author":		"<your name/organisation>",
		"help url":		"<your website or a manual entry on Scirra.com>",
		"category":		"General",				// Prefer to re-use existing categories, but you can set anything here
		"type":			"object",				// either "world" (appears in layout and is drawn), else "object"
		"rotatable":	false,					// only used when "type" is "world".  Enables an angle property on the object.
		"flags":		pf_singleglobal	,					// uncomment lines to enable flags...
					//	| pf_singleglobal		// exists project-wide, e.g. mouse, keyboard.  "type" must be "object".
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
		"dependency":	"sweetalert-dev.js;sweetalert.css"  //sweetalert.min.js
//		"dependency":	"sweetalert-dev.js;default-params.js;handle-click.js;handle-dom.js;handle-key.js;handle-swal-dom.js;injected-html.js; set-params.js;utils.js;sweetalert.css"  //sweetalert.min.js											
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

AddCondition(0, cf_trigger, "Confirm Clicked", "Confirm", "Confirm Button Clicked", "Confirm Button Clicked.", "confirmClicked");

AddCondition(1, cf_trigger, "Option 1 Selected", "Options", "Option 1 Selected", "Option 1 Selected", "option1Selected");

AddCondition(2, cf_trigger, "Option 2 Selected", "Options", "Option 2 Selected", "Option 2 Selected", "option2Selected");

AddCondition(3, cf_trigger, "Prompt input data read", "Prompt", "Prompt Read", "Prompt Read", "promptRead");

AddCondition(4, cf_trigger, "Loader Clicked", "Loader", "Loader Clicked", "Loader Clicked", "loaderClicked");


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
AddStringParam("Message", "");
AddStringParam("Tag", "");
AddAction(0, af_none, "Message", "Basic - No Trigger", "Message {0}", "Shows a simple message", "BasicMessge");

AddStringParam("Title", "");
AddStringParam("Message", "");
AddStringParam("Tag", "");
AddAction(1, af_none, "Message with Title", "Basic - No Trigger", "Show Title {0} and Message {1}", "Shows a simple message with Title", "TitledMessge");

	AddStringParam("Title", "");
	AddStringParam("Message", "");
	AddComboParamOption("Success");
	AddComboParamOption("Error");
	AddComboParamOption("Warning");
	AddComboParamOption("Info");
	AddComboParam("Alert Type", "Alert Type", initial_selection = 0);	
	AddStringParam("Tag", "");
AddAction(2, af_none, "Alert Types", "Basic - No Trigger", "Alert with Title {0}, Text {1} and Type {2}", "Alert", "AlertWithTitleMsgSucErrWarn");

	AddStringParam("Title", "");
	AddStringParam("Message", "");
	AddComboParamOption("Success");
	AddComboParamOption("Error");
	AddComboParamOption("Warning");
	AddComboParamOption("Info");
	AddComboParam("Alert Type", "Alert Type", initial_selection = 0);	
	AddStringParam("Confirm Text", "Confirm");
	AddStringParam("Cancel Text", "Cancel");
	AddAnyTypeParam("Confirm Button Colour", "Confirm Button Colour", '"DD6B55"');
	AddStringParam("Tag", "");
AddAction(3, af_none, "Confirm/Cancel", "Picker", "Alert with Title {0}, Text {1} and Type {2} with Confirm/Cancel", "Alert", "AlertWithTitleMsgSucErrWarnAndConfCan");


	AddStringParam("Title", "");
	AddStringParam("Message", "");
	AddComboParamOption("Success");
	AddComboParamOption("Error");
	AddComboParamOption("Warning");
	AddComboParamOption("Info");
	AddComboParam("Alert Type", "Alert Type", initial_selection = 0);	
	AddStringParam("Option 1", "Option 1");
	AddStringParam("Option 2", "Option 2");
	AddAnyTypeParam("Confirm Button Colour", "Confirm Button Colour", '"DD6B55"');
	AddStringParam("Tag", "");
AddAction(4, af_none, "Two Options", "Picker", "Alert with Title {0}, Text {1} and Type {2} with option 1 {3} and Option 2 {4}, Tag {5}", "Alert", "AlertWithTitleMsgSucErrWarnAndTwoTrigg");


	AddStringParam("Title", "");
	AddStringParam("Message", "");
	AddStringParam("Source", "Image URL - Use File Chooser plug in.", ""); 	
	AddStringParam("Tag", "");  
AddAction(15, af_none, "Custom Icon", "Special - No Trigger", "Alert with Title {0}, Text {1} and Custom Icon", "Alert", "AlertWithTitleMsgCustIcon");

	AddStringParam("Title", "");
	AddStringParam("Message", "");
	AddNumberParam("Close Timer", "Close Timer", "2000"); 	
	AddStringParam("Tag", "");
AddAction(5, af_none, "Auto Close", "Special - No Trigger", "Alert with Title {0}, Text {1}, closes after {2} ms", "Alert", "AlertWithTitleMsgAutoClose");

	AddStringParam("Title", "");
	AddStringParam("Message", "");
	AddStringParam("Place Holder", "");
	AddStringParam("Tag", "");
AddAction(6, af_none, "Input Data", "Prompt", "Prompt with Title {0}, Text {1}, and Prompt", "Prompt", "PromptWithTitleMsg");

	AddStringParam("Title", "");
	AddStringParam("Message", "");
	AddComboParamOption("Success");
	AddComboParamOption("Error");
	AddComboParamOption("Warning");
	AddComboParamOption("Info");
	AddComboParam("Alert Type", "Alert Type", initial_selection = 0);	
	AddStringParam("Tag", "");
AddAction(7, af_none, "Simple Loader", "Loader", "Alert with Title {0}, Text {1}, and Loader", "Alert", "AlertWithLoader");

	AddStringParam("Title", "");
	AddStringParam("Message", "");
	AddComboParamOption("Success");
	AddComboParamOption("Error");
	AddComboParamOption("Warning");
	AddComboParamOption("Info");
	AddComboParam("Alert Type", "Alert Type", initial_selection = 0);	
	AddStringParam("Tag", "");
AddAction(8, af_none, "Loader With Cancel", "Loader", "Alert with Title {0}, Text {1}, Loader And Cancel", "Alert", "AlertWithLoaderAndCancel");


	AddStringParam("Title", "");
	AddStringParam("Message", "");
	AddComboParamOption("Success");
	AddComboParamOption("Error");
	AddComboParamOption("Warning");
	AddComboParamOption("Info");
	AddComboParam("Alert Type", "Alert Type", initial_selection = 0);	
	AddStringParam("Confirm Text", "Confirm");
//	AddStringParam("Cancel Text", "Cancel");
	AddAnyTypeParam("Confirm Button Colour", "Confirm Button Colour", '"DD6B55"');
	AddStringParam("Tag", "");
AddAction(10, af_none, "Confirm with Trigger", "Basic - With Trigger", "Alert with Title {0}, Text {1} and Type {2} with Confirm Trigger", "Alert", "AlertWithTitleMsgSucErrWarnAndConfTrigger");



AddAction(9, af_none, "Close Alert", "Close", "Close Alert", "Close", "CloseSWAL");



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
AddExpression(0, ef_return_string, "Input from Prompt", "Input from Prompt", "inPutFromPrompt", "Input from prompt");
AddExpression(1, ef_return_string, "Alert Tag", "Alert Tag", "alertTag", "Tag of the Last Alert");

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