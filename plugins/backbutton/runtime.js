// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
cr.plugins_.CJSBackButton = function(runtime)
{
	this.runtime = runtime;
};

/////////////////////////////////////
// C2 plugin
(function ()
{
	var pluginProto = cr.plugins_.CJSBackButton.prototype;
		
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
			CocoonJS["App"]["setAppShouldFinishCallback"](function ()
				{
				self.runtime.trigger(cr.plugins_.CJSBackButton.prototype.cnds.OnBack, self);			
					return false;
				});
		}
	};

	//////////////////////////////////////
	// Conditions
	function Cnds() {};
	
	Cnds.prototype.OnBack = function ()
	{
		return true;
	};
	
	pluginProto.cnds = new Cnds();
	
}());