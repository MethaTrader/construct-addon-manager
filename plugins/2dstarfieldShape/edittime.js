/*
2D Starfield Shape -- code inspired from web Codef and C2 plugins Authors
-V 1.0 initial internal release for test 
*/

function GetPluginSettings()  
{
	return {
		"name":			"2D_Starfield_Shape",
		"id":			"c2dstarfieldshape",
		"version":		"1.0",					// (float in x.y format) Behavior version - C2 shows compatibility warnings based on this
		"description":	"8 Layers shape Starfield",
		"author":		"Gigatron",
		"help url":		"http://www.scirra.com",
		"category":		"Auto Run Plugin",
		"type":			"world",			// appears in layout
		"rotatable":	true,
		"flags":		pf_texture | pf_position_aces | pf_size_aces | pf_angle_aces | pf_appearance_aces | pf_zorder_aces,
		
	};
};

// Conditions, actions and expressions
AddComboParamOption("(none)");
AddComboParamOption("Additive");
AddComboParamOption("XOR");
AddComboParamOption("Copy");
AddComboParamOption("Destination over");
AddComboParamOption("Source in");
AddComboParamOption("Destination in");
AddComboParamOption("Source out");
AddComboParamOption("Destination out");
AddComboParamOption("Source atop");
AddComboParamOption("Destination atop");
AddComboParam("Effect", "Choose the new effect for this object.");
AddAction(1, 0, "Set effect", "Appearance", "Set effect to <i>{0}</i>", "Set the rendering effect of this object.", "SetEffect");


AddNumberParam("X Speed", "Change the Stars X Speed");
AddAction(2, 0, "Set X Speed", "2DStarfield Shape", "Set Speed to {0}", "Set the Stars X Speed value", "SetSpeed");
AddNumberParam("Y Speed", "Change the Stars Y Speed");
AddAction(3, 0, "Set Y Speed", "2DStarfield Shape", "Set Speed to {0}", "Set the Stars Y Speed value", "SetYSpeed");

AddStringParam("Shape File", "2DStarfield Shape", '""');
 AddAction(4, 0, "Load Shape", "2DStarfield Shape", 
          "Load <i>{0}</i>", 
           "Load Shape image for Stars 8x8 or 16x16 not big image please ....", "LoadShape");

 


ACESDone();

// Property grid properties for this plugin
var property_list = [
	
	new cr.Property(ept_combo,	"Effect",				"(none)",	"Choose an effect for this object.  (This does not preview in the layout, only when you run.)", "(none)|Additive|XOR|Copy|Destination over|Source in|Destination in|Source out|Destination out|Source atop|Destination atop"),
	new cr.Property(ept_integer,	"X Speed",	-1,		"Horizontal Speed of Stars negate to reverse dir -2/2"),
	new cr.Property(ept_integer,	"Y Speed",	0,		"Vertical Speed of Stars negate to reverse dir -2/2"),
	new cr.Property(ept_integer,	"Numbers Of Stars",	100,"Numbers of Stars dispatched to each 8 layers More Back; Less Front"),
	new cr.Property(ept_text,		'Shape FileName',	'stars.png',	'External Star Shape Filename. Import .png Please..'),
	new cr.Property(ept_combo,	"Initial visibility",	"Visible",	"Choose whether the object is visible when the layout starts.", "Visible|Invisible"),
	new cr.Property(ept_combo,	"Hotspot",				"Top-left",	"Choose the location of the hot spot in the object.", "Top-left|Top|Top-right|Left|Center|Right|Bottom-left|Bottom|Bottom-right")    
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
	this.just_inserted = false;
}

IDEInstance.prototype.OnCreate = function()
{

	switch (this.properties["Hotspot"])
	{
    case "Top-left" :
      this.instance.SetHotspot(new cr.vector2(0, 0));
      break;
    case "Top" :
      this.instance.SetHotspot(new cr.vector2(0.5, 0));
      break;
    case "Top-right" :
      this.instance.SetHotspot(new cr.vector2(1, 0));
      break;
    case "Left" :
      this.instance.SetHotspot(new cr.vector2(0, 0.5));
      break;
    case "Center" :
      this.instance.SetHotspot(new cr.vector2(0.5, 0.5));
      break;
    case "Right" :
      this.instance.SetHotspot(new cr.vector2(1, 0.5));
      break;
    case "Bottom-left" :
      this.instance.SetHotspot(new cr.vector2(0, 1));
      break;
    case "Bottom" :
      this.instance.SetHotspot(new cr.vector2(0.5, 1));
      break;
    case "Bottom-right" :
		  this.instance.SetHotspot(new cr.vector2(1, 1));
      break;
	}
}

IDEInstance.prototype.OnInserted = function()
{
	this.just_inserted = true;
}

IDEInstance.prototype.OnDoubleClicked = function()
{
	 
}

// Called by the IDE after a property has been changed
IDEInstance.prototype.OnPropertyChanged = function(property_name)
{
	// Edit image link
	if (property_name === "Image")
	{
		this.instance.EditTexture();
	}
	else if (property_name === "Hotspot")
	{
    switch (this.properties["Hotspot"])
    {
      case "Top-left" :
        this.instance.SetHotspot(new cr.vector2(0, 0));
      break;
      case "Top" :
        this.instance.SetHotspot(new cr.vector2(0.5, 0));
      break;
      case "Top-right" :
        this.instance.SetHotspot(new cr.vector2(1, 0));
      break;
      case "Left" :
        this.instance.SetHotspot(new cr.vector2(0, 0.5));
      break;
      case "Center" :
        this.instance.SetHotspot(new cr.vector2(0.5, 0.5));
      break;
      case "Right" :
        this.instance.SetHotspot(new cr.vector2(1, 0.5));
      break;
      case "Bottom-left" :
        this.instance.SetHotspot(new cr.vector2(0, 1));
      break;
      case "Bottom" :
        this.instance.SetHotspot(new cr.vector2(0.5, 1));
      break;
      case "Bottom-right" :
        this.instance.SetHotspot(new cr.vector2(1, 1));
      break;
    }
	}
}

IDEInstance.prototype.OnRendererInit = function(renderer)
{
	 
}
	
// Called to draw self in the editor
IDEInstance.prototype.Draw = function(renderer)
{
	//var isCheckbox = (this.properties["Type"] === "Checkbox");
	
	if (!this.font)
		this.font = renderer.CreateFont("Arial", 14, false, false);
		
	renderer.SetTexture(null);
	var quad = this.instance.GetBoundingQuad();

	renderer.Fill(quad, cr.RGB(20, 80, 80));
	renderer.Outline(quad, cr.RGB(0, 0, 0));
		
	cr.quad.prototype.offset.call(quad, 0, 2);

	this.font.DrawText(this.properties["Text"],
							quad,
							cr.RGB(0, 0, 0),
							ha_center);
	
	 
}

IDEInstance.prototype.OnRendererReleased = function(renderer)
{
	 
}