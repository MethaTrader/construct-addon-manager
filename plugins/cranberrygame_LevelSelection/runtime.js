// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/*
//cranberrygame start: structure
cr.plugins_.cranberrygame_LevelSelection = function(runtime)
{
	this.runtime = runtime;
	Type
		onCreate
	Instance
		onCreate
		draw
		drawGL		
	cnds
		//MyCondition
		//TriggerCondition
	acts
		//MyAction
		//TriggerAction
	exps
		//MyExpression
};		
//cranberrygame end: structure
*/

/////////////////////////////////////
// Plugin class
// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
//          vvvvvvvv
cr.plugins_.cranberrygame_LevelSelection = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	/////////////////////////////////////
	// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
	//                            vvvvvvvv
	var pluginProto = cr.plugins_.cranberrygame_LevelSelection.prototype;
		
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
		
/*			
		//cranberrygame
		var newScriptTag=document.createElement('script');
		newScriptTag.setAttribute("type","text/javascript");
		newScriptTag.setAttribute("src", "mylib.js");
		document.getElementsByTagName("head")[0].appendChild(newScriptTag);
		//cranberrygame
		var scripts=document.getElementsByTagName("script");
		var exist=false;
		for(var i=0;i<scripts.length;i++){
			//alert(scripts[i].src);//http://localhost:50000/jquery-2.0.0.min.js
			if(scripts[i].src.indexOf("cordova.js")!=-1||scripts[i].src.indexOf("phonegap.js")!=-1){
				exist=true;
				break;
			}
		}
		if(!exist){
			var newScriptTag=document.createElement("script");
			newScriptTag.setAttribute("type","text/javascript");
			newScriptTag.setAttribute("src", "cordova.js");
			document.getElementsByTagName("head")[0].appendChild(newScriptTag);
		}
*/		
//cranberrygame start
//cranberrygame end		
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
		// note the object is sealed after this call; ensure any properties you'll ever need are set on the object
		// e.g...
		// this.myValue = 0;
		
/*
		var self=this;
		window.addEventListener("resize", function () {//cranberrygame
			self.runtime.trigger(cr.plugins_.cranberrygame_LevelSelection.prototype.cnds.TriggerCondition, self);
		});
*/
//cranberrygame start		
//cranberrygame end			
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

/*
	instanceProto.at = function (x)
	{
		return this.arr[x];
	};
	
	instanceProto.set = function (x, val)
	{
		this.arr[x] = val;
	};
*/	
//cranberrygame start
//cranberrygame end	
	
	//////////////////////////////////////
	// Conditions
	function Cnds() {};

/*
	// the example condition
	Cnds.prototype.MyCondition = function (myparam)
	{
		// return true if number is positive
		return myparam >= 0;
	};

	//cranberrygame
	Cnds.prototype.TriggerCondition = function ()
	{
		return true;
	};
*/
	
//cranberrygame start
var Level=1;
var TotalLevel=0;

function LoadLevel(key_level){
	var stored_level=1;
	if(localStorage.getItem(key_level) == null){
		localStorage.setItem(key_level, "1");
	}
	stored_level = parseInt(localStorage.getItem(key_level));
	return stored_level;
}

function SaveLevel(key_level,param){
	localStorage.setItem(key_level,(param).toString());
}

function ClearLevel(key_level){
	localStorage.removeItem(key_level);
}

	Cnds.prototype.NextLevelIsUnlocked = function ()
	{
		var stored_level=LoadLevel(this.type.name);
		
		if(Level<=stored_level-1)
			return true;
		else
			return false;					
	};
	
	Cnds.prototype.CompareCurrentLevel = function (cmp, l)
	{
		return cr.do_cmp(Level, cmp, l);
	};
		
//cranberrygame end
	
	// ... other conditions here ...
	
	pluginProto.cnds = new Cnds();
	
	//////////////////////////////////////
	// Actions
	function Acts() {};

/*
	// the example action
	Acts.prototype.MyAction = function (myparam)
	{
		// alert the message
		alert(myparam);
	};
	
	//cranberrygame
	Acts.prototype.TriggerAction = function ()
	{
		var self=this;		
		self.runtime.trigger(cr.plugins_.cranberrygame_LevelSelection.prototype.cnds.TriggerCondition, self);			
	};	
*/
	
//cranberrygame start
	Acts.prototype.LockLevelButtons = function (objtype)
	{
		var stored_level=LoadLevel(this.type.name);
		
		//lock
		var sol = objtype.getCurrentSol();  
		sol.select_all = true;   
		var insts = sol.getObjects();
		var insts_length = insts.length;
		TotalLevel=insts_length;
			
		var i, inst;
		for (i=0; i < insts_length; i++)
		{
		  inst = insts[i];
		  
		  //http://www.scirra.com/forum/plugin-clayio-leaderboards-achievements_topic54357.html
			var ret={
				i:0,
				
				set_int:function(param){
					this.i=param;
				}
			};
		  cr.plugins_.Sprite.prototype.exps.AnimationFrame.apply(inst, [ret]);
		  var levelButtonLevel=ret.i;
		  
		  if(levelButtonLevel>=stored_level+1){		   
				//http://www.scirra.com/forum/behavior-accessing-a-plugin_topic50811.html
				//https://www.scirra.com/search.aspx?q=other+plugin%27s+method
				cr.plugins_.Sprite.prototype.acts.SetAnimFrame.apply(inst, [0]);				
			}		   
		}
	};
	
	Acts.prototype.SetCurrentLevel = function (myparam)
	{
		// alert the message
		Level=myparam;
	};
	
	Acts.prototype.UnlockNextLevel = function ()
	{
		var stored_level=LoadLevel(this.type.name);
		if((Level==stored_level)&&(Level<=TotalLevel-1)){
			SaveLevel(this.type.name,Level+1);
		}
	};
	
	Acts.prototype.IncreaseCurrentLevel = function ()
	{
			if(Level<=TotalLevel-1){
				Level=Level+1;
		}
	};		
	
	Acts.prototype.ClearLock = function ()
	{
		ClearLevel(this.type.name);
	};	
//cranberrygame end
	
	// ... other actions here ...
	
	pluginProto.acts = new Acts();
	
	//////////////////////////////////////
	// Expressions
	function Exps() {};
	
/*	
	// the example expression
	Exps.prototype.MyExpression = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_int(1337);				// return our value
		// ret.set_float(0.5);			// for returning floats
		// ret.set_string("Hello");		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string
	};
	
	Exps.prototype.Text = function (ret, param) //cranberrygame
	{     
		ret.set_string("Hello");		// for ef_return_string
		//ret.set_int(1337);				// return our value
		// ret.set_float(0.5);			// for returning floats
		// ret.set_string("Hello");		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string		
	};	
*/
	
//cranberrygame start
	Exps.prototype.CurrentLevel = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_int(Level);				// return our value
		// ret.set_float(0.5);			// for returning floats
		// ret.set_string("Hello");		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string
	};

	Exps.prototype.TotalLevel = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_int(TotalLevel);				// return our value
		// ret.set_float(0.5);			// for returning floats
		// ret.set_string("Hello");		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string
	};
	
	Exps.prototype.UnlockedLevel = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		var stored_level=LoadLevel(this.type.name);
				
		ret.set_int(stored_level);				// return our value
		// ret.set_float(0.5);			// for returning floats
		// ret.set_string("Hello");		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string
	};
	
//cranberrygame end
	
	// ... other expressions here ...
	
	pluginProto.exps = new Exps();

}());