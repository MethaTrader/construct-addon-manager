function GetPluginSettings()
{
	return {
		"name":			"Protracker",
		"id":			"Amiga_Protracker",
		"version":		"0.20",
		"description":	"Play Protracker, Fasttracker and ScreamTracker Modules",
		"author":		"Gigatron",
		"help url":		"",
		"category":		"Media",
		"type":			"object",			// not in layout
		"rotatable":	false,
		"flags":		0,
		"dependency":	"ft2.js;player.js;pt.js;st3.js"
	};
};

//////////////////////////////////////////////////////////////
// **************** Conditions
 
AddCondition(1,0, "Player is Ready ", "Protracker Status","Is Ready ", "True if ready", "Onready");
AddCondition(2,0, "Player is Paused ", "Protracker Status","Is Paused ", "True if paused", "Onpause"); 

////////////////////////////////////////////////////////////
//***************** Actions
 AddStringParam("Module Name", "Protracker file.", '""');
 AddAction(10, 0, "Load Protracker Module", "Module Load ", 
          "Load Protracker Module <i>{0}</i>", 
           "Load Protracker Module File", "Loading");

AddAction(11, 0, "Play", "Play", 
          "Start playing module", 
          "Start Playing Protracker Module", "Play"); 
AddAction(12, 0, "Stop", "Play", 
         "Stop playing module", 
          "Stop playing Protracker module", "Stop");
 
AddComboParamOption("No");
AddComboParamOption("Yes");
AddComboParam("Repeat ", "Choose Repeat  ");		  
AddAction(13, 0, "Set Repeat", "Play", "Set Repeat <i>{0}</i>", "Enable or disable Repeat Module", "SetRepeat");		  

AddNumberParam("Number", "Module Play Speed ");
AddAction(14,0,  "Speed", "Play", "Set Speed {0}", "Module Play Speed 1< faster >6 slower ", "SetSpeed");

AddNumberParam("Number", "Module Set Position ");
AddAction(15,0,  "Song Position", "Play", "Set Position {0}", "Song position must be equal to the max pattern of module ", "SetPosition");

AddComboParamOption("No");
AddComboParamOption("Yes");
AddComboParam("Pause ", "Player Pause ");		  
AddAction(16, 0, "Set Pause", "Play", "Set Pause <i>{0}</i>", "Pause Playing ", "SetPause");		  

AddNumberParam("Number", "Module Bpm Per Second ");
AddAction(17,0,  "Set Bpm", "Play", "Set Bpm {0}", "Module BPM  ", "SetBpm");

AddNumberParam("Number", "Set Global volume ");
AddAction(18,0,  "Set Volume", "Play", "Set Volume {0}", "Module Global Volume 0-1.0 ", "Setvolume");

AddNumberParam("Number", "Set Analyser FFT Size ");
AddAction(19,0,  "Set FFT Size", "Play", "Set FFT Size {0}", "Set Analyzer FFT Size eg 2048/1024/512/256 ", "Setfftsize");          

AddNumberParam("Number", "Set Analyser Smooth Time Constant ");
AddAction(20,0,  "Set Smooth Time Size", "Play", "Set Smooth Time Constant {0}", "Set Analyzer Smooth Time Constant ", "Settsmooth");

//////////////////////////////////////////////////////////////
// *********** Expressions
AddExpression(0, ef_return_string, "", "Protracker Misc", "Modtitle", "Return the Name of the Module");
AddExpression(1, ef_return_number, "", "Protracker Misc", "ModChannels", "Return Number of Channels");
AddExpression(3, ef_return_number, "", "Protracker Misc", "ModPatterns", "Return Number of Patterns");
AddExpression(4, ef_return_number, "", "Protracker Misc", "Songposition", "Return Module Position");

//AddNumberParam("Index", "Index of the Vumeter 0-3");
AddExpression(5, ef_return_number, "", "Protracker Misc", "Vu0", "Return Vumeter 0 value ");
AddExpression(6, ef_return_number, "", "Protracker Misc", "Vu1", "Return Vumeter 1 value "); 
AddExpression(7, ef_return_number, "", "Protracker Misc", "Vu2", "Return Vumeter 2 value "); 
AddExpression(8, ef_return_number, "", "Protracker Misc", "Vu3", "Return Vumeter 3 value ");   

AddExpression(9, ef_return_number, "", "Protracker Misc", "Songlength", "Return length of Module "); 
AddExpression(10, ef_return_number, "", "Protracker Misc", "Songrow", "Return Pattern row ");
AddExpression(11, ef_return_string, "", "Protracker Misc", "Songsignature", "Return Module Signature");
AddExpression(12, ef_return_number, "", "Protracker Misc", "Songspeed", "Return Module Speed");               
AddExpression(13, ef_return_number, "", "Protracker Misc", "Songbpm", "Return Module beat per min"); 
AddExpression(14, ef_return_number, "", "Protracker Misc", "Songvol", "Return Global Module Volume");

AddExpression(15, ef_return_number, "", "Protracker Misc", "Fftsize", "Return Analyzer FFT Size");
AddExpression(16, ef_return_number, "", "Protracker Misc", "Smtimeconst", "Return Analyzer Smoothing Time Constant");
AddNumberParam("Index", "Index of the analyser Freq");
AddExpression(17, ef_return_number, "", "Protracker Misc", "Getfreq", "Return Analyzer Freq Byte index");
ACESDone();

// Property grid properties for this plugin
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
	new cr.Property(ept_combo, 	"Repeat","No","Repeat Module","No|Yes"),
	
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
	
	for (var i = 0; i < property_list.length; i++)
		this.properties[property_list[i].name] = property_list[i].initial_value;
}

// Called by the IDE after all initialization on this instance has been completed
IDEInstance.prototype.OnCreate = function()
{
}

// Called by the IDE after a property has been changed
IDEInstance.prototype.OnPropertyChanged = function(property_name)
{
}
	
// Called by the IDE to draw this instance in the editor
IDEInstance.prototype.Draw = function(renderer)
{
}

// Called by the IDE when the renderer has been released (ie. editor closed)
// All handles to renderer-created resources (fonts, textures etc) must be dropped.
// Don't worry about releasing them - the renderer will free them - just null out references.
IDEInstance.prototype.OnRendererReleased = function()
{
}
