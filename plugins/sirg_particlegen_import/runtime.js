// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
cr.plugins_.sirg_particlegen_import = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	var pluginProto = cr.plugins_.sirg_particlegen_import.prototype;
		
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
		// load file settings
		this.dictionary = {};
	};
	
	var instanceProto = pluginProto.Instance.prototype;

	// called whenever an instance is created
	instanceProto.onCreate = function()
	{
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

	//////////////////////////////////////
	// Conditions
	function Cnds() {};
	pluginProto.cnds = new Cnds();
	//////////////////////////////////////
	// Actions
	function Acts() {};

	Acts.prototype.UpdateParticle = function (json_,obj)
	{

		if (this.runtime.isDomFree || this.runtime.isMobile || !obj)
			return;
	
		var inst = obj.getFirstPicked();
		
		if (!inst)
			return;

		var o;
		
		try {
			o = JSON.parse(json_);
		}
		catch(e) { return; }
		
		if (!o["c2dictionary"])		// presumably not a c2dictionary object
			return;
		
		this.dictionary = o["data"];

		inst.rate = this.dictionary["Rate"];
		inst.spraycone = cr.to_radians(this.dictionary["Cone"]);
		inst.spraytype = this.dictionary["Type"];			// 0 = continuous, 1 = one-shot
		//inst.spraying = true;				// for continuous mode only
		
		inst.initspeed = this.dictionary["Speed"];
		inst.initsize = this.dictionary["Size"];
		inst.initopacity = this.dictionary["Opacity"] / 100.0;
		inst.growrate = this.dictionary["Grow"];
		inst.xrandom = this.dictionary["Xrandom"];
		inst.yrandom = this.dictionary["Yrandom"];
		inst.speedrandom = this.dictionary["Speedrandom"];
		inst.sizerandom = this.dictionary["Sizerandom"];
		inst.growrandom = this.dictionary["Growrandom"];
		inst.acc = this.dictionary["Acceleration"];
		inst.g = this.dictionary["Gravity"];
		inst.lifeanglerandom = this.dictionary["Anglerandom"];
		inst.lifespeedrandom = this.dictionary["LTspeedrandom"];
		inst.lifeopacityrandom = this.dictionary["Opacityrandom"];
		inst.destroymode = this.dictionary["Destroy"];		// 0 = fade, 1 = timeout, 2 = stopped
		inst.timeout = this.dictionary["Timeout"];
		//inst.angle = this.dictionary["Angleparticle"];
		//console.log('speed:' + this.dictionary["Angleparticle"]);
		
		//inst.particleCreateCounter = 0;
		//inst.particlescale = 1;

	}

	pluginProto.acts = new Acts();
	
	//////////////////////////////////////
	// Expressions
	function Exps() {};
	
	pluginProto.exps = new Exps();

}());
