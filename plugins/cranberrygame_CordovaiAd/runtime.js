// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/*
//cranberrygame start: structure
cr.plugins_.cranberrygame_CordovaiAd = function(runtime)
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
cr.plugins_.cranberrygame_CordovaiAd = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	/////////////////////////////////////
	// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
	//                            vvvvvvvv
	var pluginProto = cr.plugins_.cranberrygame_CordovaiAd.prototype;
		
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
		var scriptExist=false;
		for(var i=0;i<scripts.length;i++){
			//alert(scripts[i].src);//http://localhost:50000/jquery-2.0.0.min.js
			if(scripts[i].src.indexOf("cordova.js")!=-1||scripts[i].src.indexOf("phonegap.js")!=-1){
				scriptExist=true;
				break;
			}
		}
		if(!scriptExist){
			var newScriptTag=document.createElement("script");
			newScriptTag.setAttribute("type","text/javascript");
			newScriptTag.setAttribute("src", "cordova.js");
			document.getElementsByTagName("head")[0].appendChild(newScriptTag);
		}
*/		
//cranberrygame start
		if(this.runtime.isBlackberry10 || this.runtime.isWindows8App || this.runtime.isWindowsPhone8 || this.runtime.isWindowsPhone81){
			var scripts=document.getElementsByTagName("script");
			var scriptExist=false;
			for(var i=0;i<scripts.length;i++){
				//alert(scripts[i].src);//http://localhost:50000/jquery-2.0.0.min.js
				if(scripts[i].src.indexOf("cordova.js")!=-1||scripts[i].src.indexOf("phonegap.js")!=-1){
					scriptExist=true;
					break;
				}
			}
			if(!scriptExist){
				var newScriptTag=document.createElement("script");
				newScriptTag.setAttribute("type","text/javascript");
				newScriptTag.setAttribute("src", "cordova.js");
				document.getElementsByTagName("head")[0].appendChild(newScriptTag);
			}
		}
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
			self.runtime.trigger(cr.plugins_.cranberrygame_CordovaiAd.prototype.cnds.TriggerCondition, self);
		});
*/
//cranberrygame start
		if (!(this.runtime.isiOS))
			return;
        if (typeof window["iad"] == 'undefined')
            return;
			
		//window["iad"]["setLicenseKey"](email, licenseKey);
		window["iad"]["setUp"]();
		
		//
		var self = this;
		window['iad']['onBannerAdPreloaded'] = function() {
			self.runtime.trigger(cr.plugins_.cranberrygame_CordovaiAd.prototype.cnds.OnBannerAdPreloaded, self);
		};			
		window['iad']['onBannerAdLoaded'] = function() {
			self.runtime.trigger(cr.plugins_.cranberrygame_CordovaiAd.prototype.cnds.OnBannerAdLoaded, self);
		};			
		window['iad']['onBannerAdShown'] = function() {
			self.runtime.trigger(cr.plugins_.cranberrygame_CordovaiAd.prototype.cnds.OnBannerAdShown, self);
		};			
		window['iad']['onBannerAdHidden'] = function() {
			self.runtime.trigger(cr.plugins_.cranberrygame_CordovaiAd.prototype.cnds.OnBannerAdHidden, self);
		};			
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
	Cnds.prototype.OnBannerAdPreloaded = function ()
	{
		return true;
	};
	Cnds.prototype.OnBannerAdLoaded = function ()
	{
		return true;
	};
	Cnds.prototype.OnBannerAdShown = function ()
	{
		return true;
	};
	Cnds.prototype.OnBannerAdHidden = function ()
	{
		return true;
	};
	//
	Cnds.prototype.IsShowingBannerAd = function ()
	{
	    if (typeof window["iad"] == 'undefined')
			return false;
			
		return window["iad"]["isShowingBannerAd"]();
	};
	//
	Cnds.prototype.LoadedBannerAd = function ()
	{
	    if (typeof window["iad"] == 'undefined')
			return false;
			
		return window["iad"]["loadedBannerAd"]();
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
		self.runtime.trigger(cr.plugins_.cranberrygame_CordovaiAd.prototype.cnds.TriggerCondition, self);
	};	
*/
	
//cranberrygame start
	Acts.prototype.PreloadBannerAd = function ()
	{
		if (!(this.runtime.isiOS))
			return;
        if (typeof window["iad"] == 'undefined')
            return;			
			
		window["iad"]["preloadBannerAd"]();	
	}
	Acts.prototype.ShowBannerAd = function (position)
	{
		if (!(this.runtime.isiOS))
			return;
        if (typeof window["iad"] == 'undefined')
            return;
			
		var positionStr = "top-center";
		if (position==0)
			positionStr = "top-left";
		else if (position==1)
			positionStr = "top-center";
		else if (position==2)
			positionStr = "top-right";
		else if (position==3)
			positionStr = "left";
		else if (position==4)
			positionStr = "center";
		else if (position==5)
			positionStr = "right";
		else if (position==6)
			positionStr = "bottom-left";
		else if (position==7)
			positionStr = "bottom-center";
		else if (position==8)
			positionStr = "bottom-right";
			
		window["iad"]["showBannerAd"](positionStr);
	};
	Acts.prototype.ReloadBannerAd = function ()
	{
		if (!(this.runtime.isiOS))
			return;
        if (typeof window["iad"] == 'undefined')
            return;
			
		window["iad"]["reloadBannerAd"]();	
	}
	Acts.prototype.HideBannerAd = function ()
	{
		if (!(this.runtime.isiOS))
			return;
        if (typeof window["iad"] == 'undefined')
            return;
			
		window["iad"]["hideBannerAd"]();
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
//cranberrygame end
	
	// ... other expressions here ...
	
	pluginProto.exps = new Exps();

}());