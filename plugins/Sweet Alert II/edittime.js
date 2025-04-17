function GetPluginSettings()
{
    return {
        "name":			"Sweet Alert",
        "id":			"SweetAlert",
        "version":		"0.20",
        "description":	"A beautiful and customizable replacement for javascript's popup boxes.",
        "author":		"PlayLive and Andrews Vinícius",
        "modified":		"PlayLive",
        "help url":		"https://www.scirra.com/forum/plugin-sweetalert2_t181346?sid=7723b4cdd806cea1fa6138ac6ac4e3cc",
        "category":		"Addon",
        "type":			"object",
        "rotatable":	false,
        "dependency":	"SweetAlert.css;SweetAlert.js",
        "flags":		pf_singleglobal
    };
};

////////////////////////////////////////
// Conditions
AddCondition(0, cf_trigger, "On Close", "Alert", "On alert close", "Callback to execute when the alert was closed.", "OnClose");

AddStringParam("Tag", "A tag, which can be anything you like, to distinguish between different alert requests.", "\"\"");
AddCondition(1, cf_trigger, "On Cancel", "Alert", "On alert cancel {0}", "Callback to execute when the cancel alert button is clicked.", "OnCancel");

AddStringParam("Tag", "A tag, which can be anything you like, to distinguish between different alert requests.", "\"\"");
AddCondition(2, cf_trigger, "On Confim", "Alert", "On alert confim {0}", "Callback to execute when the confirm alert button is clicked.", "OnConfirm");

AddCondition(3, cf_none, "Is Open", "Alert", "Is Open", "Check if the alert is open.", "IsOpen");

AddStringParam("Tag", "A tag, which can be anything you like, to distinguish between different alert requests.", "\"\"");
AddCondition(4, cf_trigger, "On Time Out", "Alert", "On alert time out {0}", "Callback to execute when the alert was closed by time out.", "OnTimeOut");

AddCondition(5, cf_trigger, "On Open", "Alert", "On alert open", "Callback to execute when the alert was opened.", "OnOpen");
////////////////////////////////////////
// Actions
AddAction(3, cf_none, "Close", "Open", "Close", "Close alert.", "Close");

AddComboParamOption("Top");
AddComboParamOption("Top-Left");
AddComboParamOption("Top-Right");
AddComboParamOption("Center");
AddComboParamOption("Center-Left");
AddComboParamOption("Center-Right");
AddComboParamOption("Bottom");
AddComboParamOption("Bottom-Left");
AddComboParamOption("Bottom-Right");
AddComboParam("Position", "Choose the alert position.", 3);
AddStringParam("Background", "Background color.", "\"rgb(255, 255, 255)\"");
AddStringParam("Color", "Text color.", "\"rgb(56, 56, 56)\"");
AddStringParam("Width", "Alert width.", "\"50%\"");
AddComboParamOption("false");
AddComboParamOption("true");
AddComboParam("Invert buttons positions", "Set to true if you want to invert default buttons positions (confirm-button on the left side).", 0);
AddStringParam("Cancel background color", "Cancel background color.", "\"rgb(160, 160, 160)\"");
AddStringParam("Confirm background color", "Confirm background color.", "\"rgb(40, 120, 240)\"");
AddAction(5, cf_none, "Set style", "Appearance",
    "Set style { position: {0} | background: {1} | color: {2} | width: {3} | invert-buttons: {4} | cancel-color: {5} | confirm-color: {6} }",
    "Set a style on the control.", "Style");

// top | top-left | | top-right | center | center-left | center-right | bottom | bottom-left | bottom-right
AddStringParam("Position", "top | top-left | top-right | center | center-left | center-right | bottom | bottom-left | bottom-right", "\"center\"");
AddAction(8, cf_none, "Position", "Appearance", "Set style { position: {0} }", "Choose the alert position.", "StylePosition");

AddStringParam("Background", "Set background color by CSS.", "\"rgb(255, 255, 255)\"");
AddAction(9, cf_none, "Background", "Appearance", "Set style { background: {0} }", "Set background color by CSS.", "StyleBackground");

AddStringParam("Text color", "Set text color by CSS.", "\"rgb(56, 56, 56)\"");
AddAction(10, cf_none, "Color", "Appearance", "Set style { color: {0} }", "Set text color by CSS.", "StyleColor");

AddStringParam("Width", "Set width size by CSS. (px or %)", "\"540px\"");
AddAction(11, cf_none, "Width", "Appearance", "Set style { width: {0} }", "Set width size by CSS.", "StyleWidth");

AddStringParam("Invert buttons", "(\"true\" or \"false\") | (1 or 0).", "\"false\"");
AddAction(12, cf_none, "Invert buttons", "Appearance", "Set style { invert-buttons: {0} }", "Set to true if you want to invert default buttons positions (confirm-button on the left side).", "StyleInvert");

AddStringParam("Cancel background color", "Set cancel background color by CSS.", "\"rgb(160, 160, 160)\"");
AddAction(13, cf_none, "Cancel", "Appearance", "Set style { cancel-color: {0} }", "Set cancel background color by CSS.", "StyleCancel");

AddStringParam("Confirm background color", "Set confirm background color by CSS.", "\"rgb(40, 120, 240)\"");
AddAction(14, cf_none, "Confirm", "Appearance", "Set style { confirm-color: {0} }", "Set confirm background color by CSS.", "StyleConfirm");

AddStringParam("Tag", "A tag, which can be anything you like, to distinguish between different alert requests.", "\"\"");
AddComboParamOption("Normal");
AddComboParamOption("Success");
AddComboParamOption("Error");
AddComboParamOption("Warning");
AddComboParamOption("Info");
AddComboParamOption("Question");
AddComboParam("Message type", "The message type.", 0);
AddStringParam("Title", "Enter the string title.");
AddStringParam("Text", "Enter the string text.");
AddStringParam("Button confirm", "Enter the html code on the 'Confirm' button.");
AddStringParam("Button cancel", "Enter the html code on the 'Cancel' button. Leave it blank if do not want to cancel button.");
AddComboParamOption("false");
AddComboParamOption("true");
AddComboParam("Allow cancel with escape key", "If set to false, the user can't dismiss the modal by pressing the escape key.", 1);
AddComboParamOption("false");
AddComboParamOption("true");
AddComboParam("Allow cancel with outside click", "If set to false, the user can't dismiss the modal by clicking outside it.", 1);
AddComboParamOption("false");
AddComboParamOption("true");
AddComboParam("Error message", "Enable or disable errors messages.", 1);
AddVariadicParams("Input {n}", "A input to add for the alert call. #{n}\ntext,My text | number,9999 | password,your-password | email,email@server.com | url,https://www.google.com");
AddAction(0, cf_none, "Open with inputs", "Open", "Show alert with inputs (<i>{0}</i>)", "A replacement for the 'prompt' function.", "Input");

AddStringParam("Tag", "A tag, which can be anything you like, to distinguish between different alert requests.", "\"\"");
AddComboParamOption("Normal");
AddComboParamOption("Success");
AddComboParamOption("Error");
AddComboParamOption("Warning");
AddComboParamOption("Info");
AddComboParamOption("Question");
AddComboParam("Message type", "The message type.", 0);
AddStringParam("Title", "Enter the string title.");
AddStringParam("Text", "Enter the string text.");
AddStringParam("Button confirm", "Enter the html code on the 'Confirm' button.");
AddStringParam("Button cancel", "Enter the html code on the 'Cancel' button. Leave it blank if do not want to cancel button.");
AddComboParamOption("false");
AddComboParamOption("true");
AddComboParam("Allow cancel with escape key", "If set to false, the user can't dismiss the modal by pressing the escape key.", 1);
AddComboParamOption("false");
AddComboParamOption("true");
AddComboParam("Allow cancel with outside click", "If set to false, the user can't dismiss the modal by clicking outside it.", 1);
AddComboParamOption("false");
AddComboParamOption("true");
AddComboParam("Error message", "Enable or disable errors messages.", 1);
AddVariadicParams("Input {n}", "A input to add for the alert call. #{n}");
AddAction(1, cf_none, "Open with radios", "Open", "Show alert with radios (<i>{0}</i>)", "A replacement for the 'prompt' function.", "Radio");

AddStringParam("Tag", "A tag, which can be anything you like, to distinguish between different alert requests.", "\"\"");
AddComboParamOption("Normal");
AddComboParamOption("Success");
AddComboParamOption("Error");
AddComboParamOption("Warning");
AddComboParamOption("Info");
AddComboParamOption("Question");
AddComboParam("Message type", "The message type.", 0);
AddStringParam("Title", "Enter the string title.");
AddStringParam("Text", "Enter the string text.");
AddComboParamOption("false");
AddComboParamOption("true");
AddComboParam("Allow cancel with escape key", "If set to false, the user can't dismiss the modal by pressing the escape key.", 1);
AddComboParamOption("false");
AddComboParamOption("true");
AddComboParam("Allow cancel with outside click", "If set to false, the user can't dismiss the modal by clicking outside it.", 1);
AddNumberParam("Timer", "Enter the number in seconds to close automatically. 0 to manually close.", "0");
AddAction(2, cf_none, "Open with timer", "Open", "Show alert with timer (<i>{0}</i>) - close in {6} seconds", "A replacement for the 'prompt' function.", "Timer");

AddAction(7, cf_none, "Clear steps", "Steps", "Clear steps", "A replacement for the 'prompt' function.", "ProgressStepsClear");

AddComboParamOption("false");
AddComboParamOption("true");
AddComboParam("Error message", "Enable or disable errors messages.", 1);
AddVariadicParams("Input {n}", "A input to add for the alert call. #{n}\ntext,My text | number,9999 | password,your-password | email,email@server.com | url,https://www.google.com");
AddAction(6, cf_none, "Add steps", "Steps", "Add progress steps", "A replacement for the 'prompt' function.", "ProgressSteps");

AddStringParam("Tag", "A tag, which can be anything you like, to distinguish between different alert requests.", "\"\"");
AddStringParam("Button cancel", "Enter the html code on the 'Cancel' button.");
AddStringParam("Button back", "Enter the html code on the 'Back' button.");
AddStringParam("Button next", "Enter the html code on the 'Next' button.");
AddStringParam("Button confirm", "Enter the html code on the 'Confirm' button.");
AddComboParamOption("false");
AddComboParamOption("true");
AddComboParam("Allow cancel with escape key", "If set to false, the user can't dismiss the modal by pressing the escape key.", 1);
AddComboParamOption("false");
AddComboParamOption("true");
AddComboParam("Allow cancel with outside click", "If set to false, the user can't dismiss the modal by clicking outside it.", 1);
AddVariadicParams("HTML {n}", "");
AddAction(4, cf_none, "Open with progress steps", "Open", "Show alert with progress steps (<i>{0}</i>)", "A replacement for the 'prompt' function.", "Progress");
//// END IN 14 \\\\

////////////////////////////////////////
// Expressions
AddExpression(0, ef_return_any, "GetLastValue", "Alert", "GetLastValue", "Get a last input alert message text.");

AddNumberParam("Position", "Enter the position to get the last value.");
AddExpression(1, ef_return_any, "GetLastValueAt", "Alert", "GetLastValueAt", "Get a last input alert message text.");

AddExpression(2, ef_return_number, "GetCount", "Alert", "GetCount", "Get the count of values.");

AddExpression(3, ef_return_string, "GetTag", "Alert", "GetTag", "Get the tag name.");
////////////////////////////////////////
ACESDone();

////////////////////////////////////////
// Properties
var property_list = [
/* [--] */	new cr.Property(ept_section,"Error message",            "",							   ""),
/* [00] */	new cr.Property(ept_text,   "Text",                     "You must complete all fields","Text error message."),
/* [01] */	new cr.Property(ept_text,   "E-mail",                   "Invalid email address",       "E-mail error message."),
/* [02] */	new cr.Property(ept_text,   "Password",                 "Passwords must be the same "+
                                                                    "and can not be empty",        "Password error message."),
/* [03] */	new cr.Property(ept_text,   "Number",                   "Invalid number",              "Number error message."),
/* [04] */	new cr.Property(ept_text,   "URL",                      "Enter a valid URL",           "URL error message."),
/* [05] */  new cr.Property(ept_text,   "Radio",                    "Must choise a valid option",  "Radio error message."),
/* [06] */  new cr.Property(ept_text,   "Progress",                 "You must complete all fields","Progress error message."),
/* [--] */  new cr.Property(ept_section,"Style",                    "",                            ""),
/* [07] */  new cr.Property(ept_combo,  "Position",                 "Center",                      "Choose the alert position.",
                                        "Top|Top-Left|Top-Right|Center|Center-Left|Center-Right|Bottom|Bottom-Left|Bottom-Right"),
/* [08] */  new cr.Property(ept_text,   "Background",               "rgb(255, 255, 255)",          "Background color."),
/* [09] */  new cr.Property(ept_text,   "Color", 		            "rgb(56, 56, 56)",	           "Text color."),
/* [10] */  new cr.Property(ept_text,   "Width",                    "50%",                         "Alert width."),
/* [11] */  new cr.Property(ept_combo,  "Invert buttons positions", "False",
"Set to true if you want to invert default buttons positions (confirm-button on the left side).",  "False|True"),
/* [12] */  new cr.Property(ept_text,   "Cancel background color",  "rgb(160, 160, 160)",          "Cancel background color."),
/* [13] */  new cr.Property(ept_text,   "Confirm background color", "rgb(40, 120, 240)",           "Confirm background color.")
];
////////////////////////////////////////

// Called by IDE when a new object type is to be created
function CreateIDEObjectType() { return new IDEObjectType(); }

// Class representing an object type in the IDE
function IDEObjectType() { assert2(this instanceof arguments.callee, "Constructor called as a function"); }

// Called by IDE when a new object instance of this type is to be created
IDEObjectType.prototype.CreateInstance = function(instance) { return new IDEInstance(instance); }

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
}

// Called when inserted via Insert Object Dialog for the first time
IDEInstance.prototype.OnInserted = function() {}

// Called when double clicked in layout
IDEInstance.prototype.OnDoubleClicked = function() {}

// Called after a property has been changed in the properties bar
IDEInstance.prototype.OnPropertyChanged = function(property_name) {}

// For rendered objects to load fonts or textures
IDEInstance.prototype.OnRendererInit = function(renderer) {}

// Called to draw self in the editor if a layout object
IDEInstance.prototype.Draw = function(renderer) {}

// For rendered objects to release fonts or textures
IDEInstance.prototype.OnRendererReleased = function(renderer) {}