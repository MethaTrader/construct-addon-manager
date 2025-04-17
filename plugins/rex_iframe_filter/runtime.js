// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
cr.plugins_.Rex_IframeFilter = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	var pluginProto = cr.plugins_.Rex_IframeFilter.prototype;
		
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
	};
	//////////////////////////////////////
	// Conditions
	function Cnds() {};
	pluginProto.cnds = new Cnds();    
    
    // deprecated   
	Cnds.prototype.Check = function ()
	{             
		return false;
	};
    
	Cnds.prototype.IsInIframe = function ()
	{            
        return (window.top != window);
	};    
    
	//////////////////////////////////////
	// Actions
	function Acts() {};
	pluginProto.acts = new Acts();
    
    // deprecated
	Acts.prototype.Append = function (url)
	{
	}; 
    
    // deprecated
	Acts.prototype.SetJSON = function (JSON_string)
	{
	}; 	
    
	Acts.prototype.Redirection = function (url)
	{
        if (url == null)
            url = window.location.href;
        
	    window.top.location.href=url;
	}; 		
	//////////////////////////////////////
	// Expressions
	function Exps() {};
	pluginProto.exps = new Exps();

    // deprecated    
	Exps.prototype.MainFrameURL = function (ret)
	{
		ret.set_string("");
	};        
}());