// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
//          vvvvvvvv
cr.plugins_.sirg_randomizator = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	/////////////////////////////////////
	// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
	//                            vvvvvvvv
	var pluginProto = cr.plugins_.sirg_randomizator.prototype;
		
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
		
		// any other properties you need, e.g...
		// this.myValue = 0;
	};
	
	var instanceProto = pluginProto.Instance.prototype;

	// called whenever an instance is created
	instanceProto.onCreate = function()
	{
		this.chance = new window["Chance"]();
	};
	
	// called whenever an instance is destroyed
	// note the runtime may keep the object after this call for recycling; be sure
	// to release/recycle/reset any references to other objects in this function.
	instanceProto.onDestroy = function ()
	{
	};
	
	// called when saving the full state of the game
	instanceProto.saveToJSON = function ()
	{
		// return a Javascript object containing information about your object's state
		// note you MUST use double-quote syntax (e.g. "property": value) to prevent
		// Closure Compiler renaming and breaking the save format
		return {
			// e.g.
			//"myValue": this.myValue
		};
	};
	
	// called when loading the full state of the game
	instanceProto.loadFromJSON = function (o)
	{
		// load from the state previously saved by saveToJSON
		// 'o' provides the same object that you saved, e.g.
		// this.myValue = o["myValue"];
		// note you MUST use double-quote syntax (e.g. o["property"]) to prevent
		// Closure Compiler renaming and breaking the save format
	};
	
	// only called if a layout object - draw to a canvas 2D context
	instanceProto.draw = function(ctx)
	{
	};
	
	// only called if a layout object in WebGL mode - draw to the WebGL context
	// 'glw' is not a WebGL context, it's a wrapper - you can find its methods in GLWrap.js in the install
	// directory or just copy what other plugins do.
	instanceProto.drawGL = function (glw)
	{
	};
	
	// The comments around these functions ensure they are removed when exporting, since the
	// debugger code is no longer relevant after publishing.
	/**BEGIN-PREVIEWONLY**/
	instanceProto.getDebuggerValues = function (propsections)
	{
	};
	
	instanceProto.onDebugValueEdited = function (header, name, value)
	{
	};
	/**END-PREVIEWONLY**/

	//////////////////////////////////////
	// Conditions
	function Cnds() {};
	pluginProto.cnds = new Cnds();
	
	//////////////////////////////////////
	// Actions
	function Acts() {};
	pluginProto.acts = new Acts();
	
	//////////////////////////////////////
	// Expressions
	function Exps() {};
		
	Exps.prototype.randomInt = function (ret,_min,_max)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_int( this.chance["integer"]({"min": _min, "max": _max}) );// return our value
		// ret.set_float(0.5);			// for returning floats
		// ret.set_string("Hello");		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string
	};
	
	Exps.prototype.randomPad = function (ret,_number,_width)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_any( this.chance["pad"](_number, _width) );// return our value
	};
	
	Exps.prototype.randomFromArr = function (ret,_array,_sep)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		var arr_a = _array.split(_sep);//split array by ";"
		ret.set_any( this.chance["pickone"](arr_a) );// return our value
	};
	
	Exps.prototype.shuffleArr = function (ret,_array,_sep)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		var arr_a = _array.split(_sep);//split array by ";"
		var arr_b = this.chance["shuffle"](_array);
		arr_a = arr_b.join(_sep);
		ret.set_any( arr_a );// return our value
	};
	/*
	Exps.prototype.dice = function (ret,roll)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_any( this.chance["natural"](roll) );				// return our value
	};
	*/
	Exps.prototype.mean = function (ret,m,d)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		// For example, to get a random IQ (which by definition has a mean of 100
		// and a standard deviation of 15)
		// chance.normal({mean: 100, dev: 15}) => 85.11040121833615
		ret.set_any( this.chance["normal"]({"mean":m,"dev":d}) );// return our value
	};
	
	Exps.prototype.uniqueNumbers = function (ret,_count,_min,_max,_sep)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		//chance.unique(chance.integer, 10, {min: 0, max: 100}) => [78, 49, 7, 87, 59, 89, 84, 62, 60, 63]
		var arr_a = this.chance["unique"](this.chance["integer"],_count,{"min":_min,"max":_max});
		arr_a = arr_a.join(_sep);
		ret.set_any( arr_a );// return our value
	};
	
	Exps.prototype.weighted = function (ret,_array_a,_array_b,_sep)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		var arr_a = _array_a.split(_sep);//split array by ";"
		var arr_b = _array_b.split(_sep).map(Number);//split array by ";"
		var arr_x = this.chance["weighted"](arr_a, arr_b);
		ret.set_any( arr_x );// return our value
	};
	
	Exps.prototype.randomChance = function (ret,_chance)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		var x = (this.chance["bool"]({"likelihood": _chance})) ? 1 : 0;
		ret.set_any( x );// return our value
	};
	
	// ... other expressions here ...

	//randomNameMaleFirst
	//randomNameMaleSecond
	//randomNameFemaleFirst
	//randomNameFemaleSecond
	//randomPersonName
	//randomGender

	//randomCity

	//pickOne
	
	pluginProto.exps = new Exps();

}());