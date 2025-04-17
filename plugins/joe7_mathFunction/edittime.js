function GetPluginSettings()
{
	return {
		"name":			"Math Function",
		"id":			"mFunc",
		"version":		"1.0",		
		"description":	"Draw math graphs.",
		"author":		"Joe7",
		"help url":		"http://dev.liebhard.net/",
		"category":		"Math",		
		"type":			"world",			// appears in layout
		"rotatable":	true,
		"flags":		pf_texture | pf_position_aces | pf_size_aces | pf_angle_aces | pf_appearance_aces | pf_tiling | pf_zorder_aces,
		"dependency":	"c2MathFunction.js"	
	};
};

// Conditions, actions and expressions
AddNumberParam("Steprange x", "Steprange of the x-values on the x-axis.", "1");
AddAction(0, 0, "Steprange x", "Math", "Draw marks in <b>{0}</b> steps on the x-axis.", "Steprange of the x-values on the x-axis.", "StepRangX");

AddNumberParam("Steprange y", "Steprange of the y-values on the x-axis.", "1");
AddAction(1, 0, "Steprange y", "Math", "Draw marks in <b>{0}</b> steps on the y-axis.", "Steprange of the y-values on the y-axis.", "StepRangY");


AddNumberParam("Graph strokewidth", "Graph strokewidth.", "1");
AddAction(2, 0, "Graph strokewidth", "Math", "Strokewidth of the graph: <b>{0}</b>", "Graph strokewidth.", "GraphStrokeWidth");

AddStringParam("Color of the graph", "The color of the graph.", "\"rgb(0,0,0)\"");
AddAction(3, 0, "Color of the graph", "Math", "Color of the graph: <b>{0}</b>", "Color of the graph.", "GraphColor");

AddStringParam("Define function", "Define a function in x.", "\"x\"");
AddAction(4, 0, "Define function", "Math", "Define function: <b>{0}</b>", "Define a function in x.", "DrawGraph");

AddAction(5, 0, "Get graph", "Math", "Get graph", "Get the graph.", "GetDrawing");

AddAction(6, 0, "Clear drawing", "Math", "Clear drawing", "Clears the drawing.", "ClearDrawing");

AddNumberParam("Set Max X", "Set Maximum x-value", "5");
AddAction(7, 0, "Set Max X", "Math", "Set Max X: <b>{0}</b>.", "The maximum value of the x-axis", "SetMaxX");

AddNumberParam("Set Min X", "Set Minimum x-value", "-5");
AddAction(8, 0, "Set Min X", "Math", "Set Min X: <b>{0}</b>.", "The minimum value of the x-axis", "SetMinX");

AddNumberParam("Set Max Y", "Set Maximum y-value", "5");
AddAction(9, 0, "Set Max Y", "Math", "Set Max Y: <b>{0}</b>.", "The maximum value of the y-axis", "SetMaxY");

AddNumberParam("Set Min Y", "Set Minimum y-value", "-5");
AddAction(10, 0, "Set Min Y", "Math", "Set Min Y: <b>{0}</b>.", "The maximum value of the y-axis", "SetMinY");


ACESDone();

// Property grid properties for this plugin
var property_list = [
	new cr.Property(ept_text,		'Min x',	'-5',	'Smallest value of x.'),
	new cr.Property(ept_text,		'Max x',	'5',	'Greatest value of x.'),
	new cr.Property(ept_text,		'Min y',	'-5',	'Smallest value of f(x).'),
	new cr.Property(ept_text,		'Max y',	'5',	'Greatest value of f(x).'),
	new cr.Property(ept_text,		'Steprange x',	'1',	'The steprange of the x-values on the x-axis.'),
	new cr.Property(ept_text,		'Steprange y',	'1',	'The steprange of the f(x)-values on the y-axis.'),
	new cr.Property(ept_text,		'Step x values',	'1',	'The steprange of the calculated points for the drawing.'),
	new cr.Property(ept_text,		'Axes strokewidth',	'1',	'The strokewidth of the axes.'),
	new cr.Property(ept_text,		'Graph strokewidth',	'1',	'The strokewidth of the graph.'),
	new cr.Property(ept_text,		'Axescolor',	'rgb(0,0,0)',	'The color of the axes.'),
	new cr.Property(ept_text,		'Graphcolor',	'rgb(0,0,0)',	'The color of the graph.'),
	new cr.Property(ept_text,		'Arrows axes',	'true',	'Show the arrows of the axes.'),
	new cr.Property(ept_text,		'Step ticks',	'true',	'Show the ticks on the axes.'),
	new cr.Property(ept_text,		'Step numbers',	'true' , 'Show the numbers on the axes.'),
	new cr.Property(ept_text,		'Axes labels',	'true',	'Show the labels of the axes.')
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
}

IDEInstance.prototype.OnInserted = function()
{
	this.just_inserted = true;
}

IDEInstance.prototype.OnDoubleClicked = function()
{
	this.instance.EditTexture();
}

// Called by the IDE after a property has been changed
IDEInstance.prototype.OnPropertyChanged = function(property_name)
{
}

IDEInstance.prototype.OnRendererInit = function(renderer)
{
	renderer.LoadTexture(this.instance.GetTexture());
}
	
// Called to draw self in the editor
IDEInstance.prototype.Draw = function(renderer)
{
	var texture = this.instance.GetTexture();
	renderer.SetTexture(this.instance.GetTexture());
	
	// First draw after insert: use 2x the size of the texture so user can see four tiles.
	// Done after SetTexture so the file is loaded and dimensions known, preventing
	// the file being loaded twice.
	//if (this.just_inserted)
	//{
	//	this.just_inserted = false;
	//	var sz = texture.GetImageSize();
	//	this.instance.SetSize(new cr.vector2(sz.x, sz.y));
	//	RefreshPropertyGrid();		// show new size
	//}
	
	// Calculate tiling
	// This ignores cards without NPOT texture support but... meh.  Tiling by repeated quads is a massive headache.
	//var texsize = texture.GetImageSize();
	//var objsize = this.instance.GetSize();
	//var uv = new cr.rect(0, 0, objsize.x / texsize.x, objsize.y / texsize.y);
	
	//renderer.EnableTiling(false);
	var q=this.instance.GetBoundingQuad();
	renderer.Quad(q, this.instance.GetOpacity());
	renderer.Outline(q, cr.RGB(0,0,0))
	//renderer.EnableTiling(false);
}

IDEInstance.prototype.OnRendererReleased = function(renderer)
{
	renderer.ReleaseTexture(this.instance.GetTexture());
}