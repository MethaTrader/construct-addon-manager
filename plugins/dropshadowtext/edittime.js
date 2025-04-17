function GetPluginSettings()
{
	return {
		"name":			"Text (Drop shadow)",
		"id":			"DropShadowText",
		"version":		"1.3",
		"description":	"Displays some text with a drop shadow effect.",
		"author":		"ramones",
		"help url":		"http://www.scirra.com/manual/",
		"category":		"General",
		"type":			"world",			// appears in layout
		"rotatable":	true,				// can be rotated in layout
		"flags":		pf_position_aces | pf_size_aces | pf_angle_aces | pf_appearance_aces | pf_zorder_aces | pf_effects
	};
};

// Conditions, actions and expressions
AddStringParam("Text to compare", "Enter the text to compare with the object's content.", "\"\"");
AddComboParamOption("Ignore case");
AddComboParamOption("Case sensitive");
AddComboParam("Case sensitivity", "Choose whether capital letters count as different to lowercase.  If ignoring case, \"ABC\" matches \"abc\".", 0);
AddCondition(0, 0, "Compare text", "Text", "Text is <b>{0}</b> <i>({1})</i>", "Compare the text in this object.", "CompareText");

////////////////////////
AddAnyTypeParam("Text", "Enter the text to set the object's content to.", "\"\"");
AddAction(0, 0, "Set text", "Text", "Set text to <i>{0}</i>", "Set the text of this object.", "SetText");

AddAnyTypeParam("Text", "Enter the text to append to the object's content.", "\"\"");
AddAction(1, 0, "Append text", "Text", "Append <i>{0}</i>", "Add text to the end of the existing text.", "AppendText");

AddStringParam("Font face", "The new font face name to set.", "\"Arial\"");
AddComboParamOption("normal");
AddComboParamOption("bold");
AddComboParamOption("italic");
AddComboParamOption("bold and italic");
AddComboParam("Style", "Choose the style for the given font face.");
AddAction(2, 0, "Set font face", "Appearance", "Set font face to <i>{0}</i> (<i>{1}</i>)", "Set the font face used to display text.", "SetFontFace");

AddNumberParam("Size (pt)", "The new font size.", "12");
AddAction(3, 0, "Set font size", "Appearance", "Set font size to <i>{0}</i> pt", "Set the font size.", "SetFontSize");

AddNumberParam("Color", "The new font color, in the form rgb(r, g, b).", "rgb(0, 0, 0)");
AddAction(4, 0, "Set font color", "Appearance", "Set font color to <i>{0}</i>", "Set the font color.", "SetFontColor");

AddStringParam("Family name", "Enter the font family name.");
AddStringParam("CSS URL", "Enter the web URL to the CSS file referencing the web font.", "\"http://\"");
AddAction(5, 0, "Set web font", "Appearance", "Set web font <i>{0}</i> from <i>{1}</i>", "Set the font face from an online web font.", "SetWebFont");

AddNumberParam("X offset", "The new x offset.", "5");
AddAction(6, 0, "Set drop shadow x offset", "Appearance", "Set drop shadow x offset to <i>{0}</i>", "Set the text's drop shadow x offset.", "SetDropShadowOffsetX");

AddNumberParam("Y offset", "The new y offset.", "5");
AddAction(7, 0, "Set drop shadow y offset", "Appearance", "Set drop shadow y offset to <i>{0}</i>", "Set the text's drop shadow y offset.", "SetDropShadowOffsetY");

AddNumberParam("Blur", "The new blur amount.", "5");
AddAction(8, 0, "Set drop shadow blur amount", "Appearance", "Set drop shadow blur amount to <i>{0}</i>", "Set the text's drop shadow blur amount.", "SetDropShadowBlur");

AddNumberParam("Drop shadow color", "The new drop shadow color, in the form rgb(r, g, b).", "rgb(0, 0, 0)");
AddAction(9, 0, "Set drop shadow color", "Appearance", "Set drop shadow color to <i>{0}</i>", "Set the text's drop shadow color.", "SetDropShadowColor");

////////////////////////
AddExpression(0,	ef_return_string,	"Get text",			"Text",			"Text",		"Get the object's text.");
AddExpression(1,	ef_return_string,	"Get face name",	"Appearance",	"FaceName",	"Get the current font face name.");
AddExpression(2,	ef_return_number,	"Get face size",	"Appearance",	"FaceSize",	"Get the current font face size (pt).");

AddExpression(3,	ef_return_number,	"Get text width",	"Text",			"TextWidth", "Get the width extent of the text in the object in pixels.");
AddExpression(4,	ef_return_number,	"Get text height",	"Text",			"TextHeight", "Get the height extent of the text in the object in pixels.");

AddExpression(5,	ef_return_number,	"Get shadow x offset",	"Appearance",			"DropShadowX", "Get the drop shadow's x offset.");
AddExpression(6,	ef_return_number,	"Get shadow y offset",	"Appearance",			"DropShadowY", "Get the drop shadow's y offset.");
AddExpression(7,	ef_return_number,	"Get shadow blur amount",	"Appearance",			"DropShadowBlur", "Get the drop shadow's blur amount.");

ACESDone();

// Property grid properties for this plugin
var property_list = [
	new cr.Property(ept_text,		"Text",		lang("project\\misc\\text-initialtext"), "Text to display."),
	new cr.Property(ept_combo, "Initial visibility",	"Visible",	"Choose whether the object is visible when the layout starts.", "Visible|Invisible"),
	new cr.Property(ept_font, 		"Font",		"Arial,-16",	"Choose the font to display.  This applies to all instances of this type."),
	new cr.Property(ept_color,		"Color",	cr.RGB(0, 0, 0),	"Color of the text."),
	new cr.Property(ept_combo,		"Horizontal alignment", "Left", "Horizontal alignment of the text.", "Left|Center|Right"),
	new cr.Property(ept_combo,		"Vertical alignment", "Top", "Vertical alignment of the text.", "Top|Center|Bottom"),
	new cr.Property(ept_combo,	"Hotspot",				"Top-left",	"Choose the location of the hot spot in the object.", "Top-left|Center"),
	new cr.Property(ept_combo,	"Wrapping",		"Word",				"Wrap text by space-separated words or nearest character.", "Word|Character"),
	new cr.Property(ept_float,	"Line height",	0,					"Offset to the default line height, in pixels. 0 is default line height."),

	new cr.Property(ept_integer,	"Drop Shadow X Offset", 	3,	"Drop shadow x offset."),
	new cr.Property(ept_integer,	"Drop Shadow Y Offset", 	3,	"Drop shadow y offset."),
	new cr.Property(ept_color,	"Drop Shadow Color", 	cr.RGB(90,90,90),	"Drop shadow color."),
	new cr.Property(ept_integer,	"Drop Shadow Blur", 	3,	"Drop shadow blur amount."),
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
		
	// Properties for font
	this.font_str = "Arial,-16";		// default font string
	this.old_font_str = "";				// last font string, in case not changed
	this.recreate_font = true;			// font not yet created
	this.font = null;					// handle to font in IDE
}

// Called when drawing the text and the font needs to be recreated
IDEInstance.prototype.RecreateFont = function(renderer)
{
	// The font hasn't really changed: don't actually recreate
	if (this.font_str == this.old_font_str)
	{
		this.recreate_font = false;
		return;
	}
		
	var had_font = false;
	
	// Release any existing font first
	if (this.font != null)
	{
		renderer.ReleaseFont(this.font);
		had_font = true;
	}
	
	// Parse the font details out of the font string
	var font_info = cr.ParseFontString(this.font_str);
	
	// Attempt to create the font as requested
	this.font = renderer.CreateFont(font_info.face_name, font_info.face_size, font_info.bold, font_info.italic);
	
	// Creating the font failed: fall back to arial
	if (this.font == null)
	{
		this.font = renderer.CreateFont("Arial", font_info.face_size, false, false);
		
		// Notify the user if the font has been changed via the property grid.  Don't notify
		// if this error happens just loading a layout.
		if (had_font)
		{
			BalloonTipLastProperty("Font not supported",
								   "The font you chose does not appear to be supported by Construct 2, for technical reasons.  "
								   + "The object has fallen back to 'Arial'.  Click the help link for more information.",
								   bti_warning);
		}
	}
	else if (!this.font.exact_match && had_font)
	{
		// The font was not an exact match.  Notify the user, but only when the font was changed,
		// don't display this when loading a layout.
		BalloonTipLastProperty("Font variation not supported",
							   "The exact font you chose does not appear to be supported by Construct 2, for technical reasons.  "
							   + "The object has fallen back to a different variation of the chosen font.  Click the help link for more information.",
							   bti_warning);
	}
	
	assert2(this.font != null, "Failed to create font or default Arial font");
		
	// Font has been created
	this.recreate_font = false;
	this.old_font_str = this.font_str;
}

IDEInstance.prototype.OnCreate = function()
{
	if (this.properties["Hotspot"] === "Top-left")
		this.instance.SetHotspot(new cr.vector2(0, 0));
	else
		this.instance.SetHotspot(new cr.vector2(0.5, 0.5));
}

// Called by the IDE after all initialization on this instance has been completed
IDEInstance.prototype.OnInserted = function()
{
	// Default to 200x30 with top left hotspot
	this.instance.SetSize(new cr.vector2(200, 30));
	this.instance.SetHotspot(new cr.vector2(0, 0));
}

// Called by the IDE after a property has been changed
IDEInstance.prototype.OnPropertyChanged = function(property_name)
{
	// Recreate font if font property changed
	if (property_name === "Font")
	{
		this.font_str = this.properties["Font"];
		this.recreate_font = true;
	}
	else if (property_name === "Hotspot")
	{
		if (this.properties["Hotspot"] === "Top-left")
			this.instance.SetHotspot(new cr.vector2(0, 0));
		else
			this.instance.SetHotspot(new cr.vector2(0.5, 0.5));
	}
	
	if(this.properties["Drop Shadow Blur"] < 0) {
		this.properties["Drop Shadow Blur"] = 0;
	}
}

IDEInstance.prototype.OnRendererInit = function(renderer)
{
}
	
// Called by the IDE to draw this instance in the editor
IDEInstance.prototype.Draw = function(renderer)
{
	// If the font is not yet created or needs recreating, recreate it
	if (this.font == null || this.recreate_font)
		this.RecreateFont(renderer);
		
	// If there is a font present, draw it
	if (this.font != null)
	{
		var halign = ha_left;
		var valign = va_top;
		
		var hprop = this.properties["Horizontal alignment"];
		var vprop = this.properties["Vertical alignment"];
		
		if (hprop == "Center")
			halign = ha_center;
		else if (hprop == "Right")
			halign = ha_right;
			
		if (vprop == "Center")
			valign = ha_center;
		else if (vprop == "Bottom")
			valign = va_bottom;
		
		
		// draw drop shadow
		shadowOffsetX = this.properties["Drop Shadow X Offset"];
		shadowOffsetY = this.properties["Drop Shadow Y Offset"];
		
		shadowQuad = this.instance.GetBoundingQuad();
		shadowQuad.tlx += shadowOffsetX;
		shadowQuad.tly += shadowOffsetY;
		shadowQuad.trx += shadowOffsetX;
		shadowQuad.try_ += shadowOffsetY;
		shadowQuad.brx += shadowOffsetX;
		shadowQuad.bry += shadowOffsetY;
		shadowQuad.blx += shadowOffsetX;
		shadowQuad.bly += shadowOffsetY;

		this.font.DrawText(this.properties["Text"],
								shadowQuad,
								this.properties["Drop Shadow Color"],
								halign,
								this.instance.GetOpacity() / 2,
								this.instance.GetAngle(),
								(this.properties["Wrapping"] === "Word"),
								this.properties["Line height"],
								valign);
								
		this.font.DrawText(this.properties["Text"],
								this.instance.GetBoundingQuad(),
								this.properties["Color"],
								halign,
								this.instance.GetOpacity(),
								this.instance.GetAngle(),
								(this.properties["Wrapping"] === "Word"),
								this.properties["Line height"],
								valign);
	}
}

IDEInstance.prototype.OnRendererReleased = function(renderer)
{
	this.font = null;		// drop reference to created font
	this.old_font_str = "";
}
