// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
cr.plugins_.ANDROdi = function(runtime)
{
	this.runtime = runtime;
};

/////////////////////////////////////
// C2 plugin
(function ()
{
	var input_text = "";
	var pluginProto = cr.plugins_.ANDROdi.prototype;
		
	/////////////////////////////////////
	// Object type class
	pluginProto.Type = function(plugin)
	{
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};

	var typeProto = pluginProto.Type.prototype;

	typeProto.onCreate = function()
	{
	};

	/////////////////////////////////////
	// Instance class
	pluginProto.Instance = function(type)
	{
		this.type = type;
		this.runtime = type.runtime;
	};
	
	var instanceProto = pluginProto.Instance.prototype;

	instanceProto.onCreate = function()
	{

		
		var self = this;
		
		if (this.runtime.isCocoonJs)
		{
			CocoonJS["App"]["onTextDialogFinished"].addEventListener(function(text) {
				input_text = text;
				self.runtime.trigger(cr.plugins_.ANDROdi.prototype.cnds.OnKeyboardOK, self);
			});

			CocoonJS["App"]["onTextDialogCancelled"].addEventListener(function() {
					self.runtime.trigger(cr.plugins_.ANDROdi.prototype.cnds.OnKeyboardCancelled, self);
			});

			CocoonJS["App"]["onMessageBoxConfirmed"].addEventListener(function() {
				self.runtime.trigger(cr.plugins_.ANDROdi.prototype.cnds.OnConfirmOK, self);
			});

			CocoonJS["App"]["onMessageBoxDenied"].addEventListener(function() {
				self.runtime.trigger(cr.plugins_.ANDROdi.prototype.cnds.OnConfirmCancelled, self);
			});

		}
	};

	//////////////////////////////////////
	// Conditions
	function Cnds() {};

	Cnds.prototype.OnKeyboardOK = function ()
	{
		return true;
	};
	Cnds.prototype.OnKeyboardCancelled = function ()
	{
		return true;
	};
	
	Cnds.prototype.OnConfirmOK = function ()
	{
		return true;
	};
	
	Cnds.prototype.OnConfirmCancelled = function ()
	{
		return true;
	};
	
	pluginProto.cnds = new Cnds();
	
//////////////////////////////////////////////////////////////
// Actions ///////////////////////////////////////////////////
//////////////////////////////////////////////////////////////

	function Acts() {};
	
	
	// Dialog /////////////////////////
	Acts.prototype.DialogKeyboard = function (title_, message_, initial_, canceltext_, oktext_)
	{
		if (!this.runtime.isCocoonJs)
			return;
		
	
		CocoonJS["App"]["showTextDialog"](title_, message_, initial_,  canceltext_, oktext_);
	};
	
	// Confirm /////////////////////////
	Acts.prototype.ConfirmKeyboard = function (title_, message_,  canceltext_, oktext_)
	{
		if (!this.runtime.isCocoonJs)
			return;
		
		CocoonJS["App"]["showMessageBox"](title_, message_,  canceltext_, oktext_);
	};
	
	// Alert /////////////////////////
	Acts.prototype.AlertKeyboard = function (msgAlert)
	{
		alert(msgAlert.toString());
	};



	pluginProto.acts = new Acts();
	



	//////////////////////////////////////
	// Expressions
	function Exps() {};
	
	Exps.prototype.InputText = function (ret)
	{
		ret.set_string(input_text);
	};
	
	
	pluginProto.exps = new Exps();
	
}());