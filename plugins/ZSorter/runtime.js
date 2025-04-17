// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
//          vvvvvvvv
cr.plugins_.ZSorter = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	/////////////////////////////////////
	// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
	//                            vvvvvvvv
	var pluginProto = cr.plugins_.ZSorter.prototype;
		
	/////////////////////////////////////
	// Object type class
	pluginProto.Type = function(plugin)
	{
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};

	var typeProto = pluginProto.Type.prototype;

	// called on startup for each object type
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

	// called whenever an instance is created
	instanceProto.onCreate = function()
	{

	};
	
	// only called if a layout object
	instanceProto.draw = function(ctx)
	{
	};

	//////////////////////////////////////
	// Conditions

	
	//////////////////////////////////////
	// Actions
	pluginProto.acts = {};
	var acts = pluginProto.acts;

    //Z-Sort all objects in current layer by their Y position
	acts.SortObjsLayerByY = function (myparam)
	{
	    this.layer.instances.sort(
	        function (instance_a, instance_b) {
	        if (instance_a.y == instance_b.y) {
	            //sort by X
	            instance_a.x - instance_b.x;
	        }
            else
	            return instance_a.y - instance_b.y;
	    });
	    this.runtime.redraw = true;
	    this.layer.zindices_stale = true;
	};
	
	//////////////////////////////////////
	// Expressions
	// pluginProto.exps = {};
	// var exps = pluginProto.exps;
	
	////the example expression
	// exps.MyExpression = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	// {
		// ret.set_int(1337);				// return our value
	//	ret.set_float(0.5);			// for returning floats
	//	ret.set_string("Hello");		// for ef_return_string
	//	ret.set_any("woo");			// for ef_return_any, accepts either a number or string
	// };

}());