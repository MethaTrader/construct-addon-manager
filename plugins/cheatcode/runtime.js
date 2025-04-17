// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

cr.plugins_.cheat = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	var pluginProto = cr.plugins_.cheat.prototype;
		
	pluginProto.Type = function(plugin)
	{
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};

	var typeProto = pluginProto.Type.prototype;

	typeProto.onCreate = function(){};

	pluginProto.Instance = function(type)
	{
		this.type = type;
		this.runtime = type.runtime;
	};
	
	var instanceProto = pluginProto.Instance.prototype;

	instanceProto.onCreate = function()
	{
		this.sequences	= [];
		this.sequence	= null;
		this.cheat		= null;
	};
	
	// Conditions
	function Cnds() {};

	Cnds.prototype.onAnyCode = function ()
	{
		return true;
	};
	
	Cnds.prototype.codeExist = function (code){
		return code in this.sequences;		
	}

	Cnds.prototype.onCheatCode = function(cheat){
		return this.cheat == cheat;
	}
	
	Cnds.prototype.compareCode = function(code){
		return this.cheat == code;
	}

	pluginProto.cnds = new Cnds();
	
	// Actions
	function Acts() {};

	Acts.prototype.addSequence = function (alias, sequence)
	{
		var self = this;
		this.sequences[alias] = {key: alias, value: sequence};	

		//Loop
		cheet(sequence, ()=>{
			if(alias in this.sequences){
				self.cheat = self.sequences[alias].key;
				self.runtime.trigger(cr.plugins_.cheat.prototype.cnds.onAnyCode,self);
			}
		});	
	};

	Acts.prototype.removeSequence = function (alias)
	{		
		delete this.sequences[alias];
	};

	Acts.prototype.reset = function(){

		for(var el in this.sequences){
			cheet.reset(this.sequences[el].value);
		}
	}
	pluginProto.acts = new Acts();
	
	// Expressions
	function Exps() {};
		
	pluginProto.exps = new Exps();

}());