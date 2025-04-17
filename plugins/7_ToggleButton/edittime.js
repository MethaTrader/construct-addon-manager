function GetPluginSettings()
{
	return {
		"name":			"Toggle Button",
		"id":			"togglebutton",
		"version":    	"1.22",
		"description":	"Add a iPhone-like toggle button into your project.", 
		// iScroll is a project created by Matteo Spinelli's - More informations on the project website - http://cubiq.org/iscroll-4
		"author":		"Gregory Georges",
		"help url":		"http://dl.dropbox.com/u/27157668/construct2/help/ToggleButton.html",
		"category":		"IPhone/Mobile",
		"type":			"world",			// in layout
		"rotatable":	false,
		"flags":		pf_size_aces | pf_position_aces/*,
		"dependency":   ""*/
		
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

//////////////////////////////////////////////////////////////
// Actions////////////////////////////////////////////////////

//Set Toggle status
		AddComboParamOption("On");
		AddComboParamOption("Off");
	AddComboParam("Status:", "Choose the status of the toggle button", 0);	
AddAction (0, 0, "Set status", "Toggle", "Set Toggle button to <i><b>{0}</b></i>", "Set the status of a toggle button", "set_toggleStatus");

//Switch Toggle status
AddAction (1, 0, "Switch status", "Toggle", "Switch Toggle button", "Switch the status of a toggle button", "switch_toggleStatus");



//////////////////////////////////////////////////////////////
// Conditions ////////////////////////////////////////////////

// toggleStatus
		AddComboParamOption("On");
		AddComboParamOption("Off");
	AddComboParam("Status:", "Test the toggle button status", 0);		
AddCondition(0, cf_trigger, "Toggle button status", "Toggle", "Toggle button is {0}", "Test the status of a toggle button when the user clicks on it", "toggleStatus");

//////////////////////////////////////////////////////////////
// Expressions////////////////////////////////////////////////

/*get inputText
	AddAnyTypeParam("\">input line ID<\"", "Set the ID of the input line :", "\"\""); 
AddExpression(0, ef_return_string, "Get input text", "General", "inputText", "Get the input form's text.");*/


ACESDone();


//////////////////////////////////////////////////////////////
//PROPERTIES//////////////////////////////////////////////////
var property_list = [

//*MAIN*/new cr.Property(ept_link, "▬ General", "", "","", "readonly"),
	/*00*/new cr.Property(ept_combo,   	 "iOS Version",			 "5.0+",		"Choose the iOS Version which the project is targetted for", "4.3.1-|5.0+"),
	/*01*/new cr.Property(ept_combo,  	 "Status",		 "Off",			"Choose the default status of the toggle button", "On|Off"),
	/*02*/new cr.Property(ept_integer,   "z-Index",				 "1",			"Choose the z-Index of the toggle button")

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
	return new IDEInstance(instance, this);
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
	
	for (var i = 0; i < property_list.length; i++) //This loop just goes through the property list you defined above and sets the new instance of the object to default values.
		this.properties[property_list[i].name] = property_list[i].initial_value;


	this.font = null;
}

// Called by the IDE after all initialization on this instance has been completed
IDEInstance.prototype.OnCreate = function()
{
	this.instance.SetHotspot(new cr.vector2(0, 0));
}

IDEInstance.prototype.OnInserted = function()
{
	this.instance.SetSize(new cr.vector2(77, 28));
}

// Called when double clicked in layout
IDEInstance.prototype.OnClicked = function()
{

}

// Called when double clicked in layout
IDEInstance.prototype.OnDoubleClicked = function()
{

}

// Called by the IDE after a property has been changed
IDEInstance.prototype.OnPropertyChanged = function(property_name)
{

	if (property_name == "iOS Version")
	{
		if (this.properties["iOS Version"] === "4.3.1-")
		{ 
			this.instance.SetSize(new cr.vector2(90, 28)); 
		}
		else if (this.properties["iOS Version"] === "5.0+")
		{ 
			this.instance.SetSize(new cr.vector2(77, 28)); 
		};
	};	

}

// For rendered objects to load fonts or textures
IDEInstance.prototype.OnRendererInit = function(renderer)
{	
	//renderer.LoadTexture('test.png');
}
	
// Called by the IDE to draw this instance in the editor
IDEInstance.prototype.Draw = function(renderer)
{
	
	if (!this.font)
		this.font = renderer.CreateFont("Arial", 9, false, false); 

	
	renderer.SetTexture(null);
	var q = this.instance.GetBoundingQuad();
	renderer.Fill(q, cr.RGB(96, 142, 208));
	renderer.Outline(q,cr.RGB(50, 92, 159));
	
	var d = this.instance.GetSize(); // get the instance size
	
	if (this.properties["iOS Version"] == "4.3.1-" && this.properties["Status"] == "On") 
		{	
			cr.quad.prototype.offset.call(q, 0, 6);
			this.font.DrawText("Toggle OS4 | ON", 
							q,
							cr.RGB(255, 255, 255),
							ha_center); 
		}
	else if (this.properties["iOS Version"] == "5.0+" && this.properties["Status"] == "On") 
		{	
			cr.quad.prototype.offset.call(q, 0, 6);
			this.font.DrawText("Toggle OS5 | ON", 
							q,
							cr.RGB(255, 255, 255),
							ha_center); 
		}
	else if (this.properties["iOS Version"] == "4.3.1-" && this.properties["Status"] == "Off") 
		{	
			cr.quad.prototype.offset.call(q, 0, 6);
			this.font.DrawText("Toggle OS4 | OFF", 
							q,
							cr.RGB(255, 255, 255),
							ha_center); 
		}
	else if (this.properties["iOS Version"] == "5.0+" && this.properties["Status"] == "Off") 
		{	
			cr.quad.prototype.offset.call(q, 0, 6);
			this.font.DrawText("Toggle OS5 | OFF", 
							q,
							cr.RGB(255, 255, 255),
							ha_center); 
		};	
}

// Called by the IDE when the renderer has been released (ie. editor closed)
// All handles to renderer-created resources (fonts, textures etc) must be dropped.
// Don't worry about releasing them - the renderer will free them - just null out references.
IDEInstance.prototype.OnRendererReleased = function()
{
	//renderer.ReleaseTexture('test.png');
}



