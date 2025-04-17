function GetPluginSettings()
{
	return {
		"name":			"Android Dialog",
		"id":			"ANDROdi",
		"version":    	"1.0",
		"description":	"Add Android dialogs in your project.",
		"author":		"inf",
		"help url":		"http://",
		"category":		"Form controls",
		"type":			"object",			// not in layout
		"rotatable":	false,
		"flags":		pf_singleglobal
	};
};

//////////////////////////////////////////////////////////////
// Conditions
// Добавление условий в плагин
// По соглашению, условия плагина перечисляются первыми. Как только параметры были добавлены, следующая функция добавляет условие:
// AddCondition(id, flags, list_name, category, display_string, description, script_name);
//////////////////////////////////////////////////////////////

AddCondition(1, cf_trigger, "Dialog input cancelled", "Android Dialog", "Dialog cancel", "Triggered after opening a text input dialog which is then cancelled.", "OnKeyboardCancelled");
AddCondition(2, cf_trigger, "Dialog input OK", "Android Dialog", "Dialog OK", "Triggered after opening a text input dialog which is then OK'd.", "OnKeyboardOK");
AddCondition(3, cf_trigger, "Confirm input No", "Android Dialog", "Confirm cancel", "Triggered after opening Confirm dialog which is then No.", "OnConfirmCancelled");
AddCondition(4, cf_trigger, "Confirm input Yes", "Android Dialog", "Confirm OK", "Triggered after opening Confirm dialog which is then Yes'd.", "OnConfirmOK");

//////////////////////////////////////////////////////////////
// Actions
// Добавление действий в плагин.
// По соглашению, действия плагинов перечисляются во вторую очередь. Как только параметры были добавлены, следующая функция добавляет действие:
// AddAction(id, flags, list_name, category, display_string, description, script_name);
//////////////////////////////////////////////////////////////


// Dialog /////////////////////////
AddStringParam("Title", "The title Text dialog.");
AddStringParam("Message", "A message Text dialog.");
AddStringParam("Initial text", "The initial entered text to show on the dialog.");
AddStringParam("OK text", "The 'OK' button text.", "\"OK\"");
AddStringParam("Cancel text", "The 'Cancel' button text.", "\"Cancel\"");
AddAction(1, 0, "Dialog Android", "Android Dialog Type", "Dialog text (title <i>{0}</i>, message <i>{1}</i>, initial text <i>{2}</i>)", "Open an Text dialog", "DialogKeyboard");
// Confirm /////////////////////////
AddStringParam("Title", "The title to Confirm dialog.", "\"Confirm\"");
AddStringParam("Message", "A message Confirm dialog.");
AddStringParam("OK text", "The 'OK' button text.", "\"Yes\"");
AddStringParam("Cancel text", "The 'Cancel' button text.", "\"No\"");
AddAction(2, 0, "Confirm Android", "Android Dialog Type", "Confirm text (title <i>{0}</i>, message <i>{1}</i>)", "Open an Confirm dialog, Yes-No button.", "ConfirmKeyboard");
// Alert /////////////////////////
AddAnyTypeParam("Message", "Add an alert dialog", "\"\"");
AddAction(3, 0,	"Alert Android", "Android Dialog Type", "Alert {0}", "Open an alert dialog, OK button", "AlertKeyboard");



//////////////////////////////////////////////////////////////
// Expressions
// Добавление выражений
// По соглашению, выражения плагина перечисляются третьими. Как только параметры были добавлены, следующая функция добавляет выражение:
// AddExpression(id, flags, list_name, category, expression_name, description);
//////////////////////////////////////////////////////////////


AddExpression(0, ef_return_string, "", "Android Dialog Tape", "InputText", "In 'On input OK', get the text Android Dialog.");


ACESDone();

// Property grid properties for this plugin
var property_list = [
	new cr.Property(ept_combo,	"Store mode",			"Managed",		"Whether to use the store in managed mode (using Ludei's cloud service).", "Managed|Unmanaged"),
	new cr.Property(ept_combo,	"Store sandbox",		"Enabled",			"Whether to use the store in sandbox mode (for testing).", "Disabled|Enabled")
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
