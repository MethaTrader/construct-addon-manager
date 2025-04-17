function GetPluginSettings()
{
	return {
		"name":			"Cheat Code",
		"id":			"cheat",
		"version":		"1.1",
		"description":	"Easy easter eggs (konami code, etc) for your games.",
		"author":		"Jonathan Ayala",
		"help url":		"https://www.scirra.com/forum",
		"category":		"other",
		"type":			"object",
		"rotatable":	false,
		"flags":		pf_singleglobal,
		"dependency":	"cheet.js"
		
	};
};

// Conditions
AddCondition(0, cf_trigger, "On any cheat code", "Cheat Code", "On any code", "On any cheat code activated.", "onAnyCode");
AddStringParam("Alias", "Enter the alias code", "");
AddCondition(1, cf_none, "Cheat code exist", "Cheat Code", "Cheat <b>{0}</b> exist", "Check if a cheat code exist.", "codeExist");
AddStringParam("Alias", "Enter the alias code", "");
AddCondition(3, cf_fake_trigger | cf_deprecated, "On cheat code", "Cheat Code", "On <b>{0}</b> code", "On cheat activated.", "onCheatCode");
AddStringParam("Alias", "Enter the cheat code alias", "");
AddCondition(4, cf_none, "Is alias", "Cheat Code", "Is alias <b>{0}</b>", "Compare cheat code alias.", "compareCode");

// Actions
AddStringParam("Alias", "Enter the alias code.", "");
AddStringParam("Sequence", "A string representation of a sequence of key names. Each keyname must be separated by a single space.", "");
AddAction(0, af_none, "Add cheat code", "Cheat Code", "Add sequence <b>{1}</b> with alias <i>{0}</i>", "Add a sequence of key names.", "addSequence");

AddStringParam("Alias", "Enter the alias code.", "");
AddAction(1, af_none, "Remove cheat code", "Cheat Code", "remove <b>{0}</b> code", "Remove a previously-mapped sequence.", "removeSequence");

AddAction(2, af_none, "Reset sequence", "Cheat Code", "{my} Reset", "Resets a sequence that may or may not be in progress.", "reset");

ACESDone();

var property_list = [];
	
function CreateIDEObjectType()
{
	return new IDEObjectType();
}

function IDEObjectType()
{
	assert2(this instanceof arguments.callee, "Constructor called as a function");
}

IDEObjectType.prototype.CreateInstance = function(instance)
{
	return new IDEInstance(instance);
}

function IDEInstance(instance, type)
{
	assert2(this instanceof arguments.callee, "Constructor called as a function");
	
	this.instance = instance;
	this.type = type;
	
	this.properties = {};
	
	for (var i = 0; i < property_list.length; i++)
		this.properties[property_list[i].name] = property_list[i].initial_value;
}

IDEInstance.prototype.OnCreate = function(){}
IDEInstance.prototype.OnPropertyChanged = function(property_name){}	
IDEInstance.prototype.Draw = function(renderer){}
IDEInstance.prototype.OnRendererReleased = function(){}
