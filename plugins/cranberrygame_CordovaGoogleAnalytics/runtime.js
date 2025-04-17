// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/*
//cranberrygame start: structure
cr.plugins_.cranberrygame_CordovaGoogleAnalytics = function(runtime)
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
cr.plugins_.cranberrygame_CordovaGoogleAnalytics = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	/////////////////////////////////////
	// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
	//                            vvvvvvvv
	var pluginProto = cr.plugins_.cranberrygame_CordovaGoogleAnalytics.prototype;
		
	/////////////////////////////////////
	// Object type class
	pluginProto.Type = function(plugin)
	{
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};

	var typeProto = pluginProto.Type.prototype;

/*
	//for example
	var fbAppID = "";
	var fbAppSecret = "";
*/
//cranberrygame start
//cranberrygame end
	
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
		this.arr = [];
		this.forX = 0;
		
		var self=this;
		window.addEventListener("resize", function () {//cranberrygame
			self.runtime.trigger(cr.plugins_.cranberrygame_CordovaGoogleAnalytics.prototype.cnds.TriggerCondition, self);
		});
*/
//cranberrygame start
		if (!(this.runtime.isAndroid || this.runtime.isiOS))
			return;			
        if (typeof analytics == 'undefined')
            return;
			
		//this.trackId = this.properties[0];
		this.trackId = "";
		if (this.runtime.isAndroid){
			this.trackId = this.properties[0];
		}
		else if (this.runtime.isiOS){
			this.trackId = this.properties[1];
		}
		
		if (this.trackId == '')
			return;
			
		var self = this;

/*		
		//<gap:plugin name="com.adobe.plugins.gaplugin" version="2.3.1" />
		//https://build.phonegap.com/plugins/297
		//https://github.com/phonegap-build/GAPlugin/tree/340201342d7f33b3838f7d280b5cfc98aef4344d
		document.addEventListener('deviceready', function(){
			window['plugins']['gaPlugin']['init'](function(result){}, function(error){}, self.trackId, 10);	
		}, false);
*/		
///*		
		//http://plugins.cordova.io/#/package/com.danielcwilson.plugins.googleanalytics
		//https://github.com/danwilson/google-analytics-plugin/tree/c13ad4bb9d165b0036f2a6f7f10aeeda48f9f72b
		document.addEventListener('deviceready', function(){
			analytics['startTrackerWithId'](self.trackId);
		}, false);
//*/			
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
	
	//
	instanceProto.doForEachTrigger = function (current_event)
	{
		this.runtime.pushCopySol(current_event.solModifiers);
		current_event.retrigger();
		this.runtime.popSol(current_event.solModifiers);
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
	Cnds.prototype.ArrForEach = function ()
	{
        var current_event = this.runtime.getCurrentEventStack().current_event;
		
		this.forX = 0;

		for (this.forX = 0; this.forX < this.arr.length; this.forX++)
		{
			this.doForEachTrigger(current_event);
		}

		this.forX = 0;

		return false;
	};	
*/
	
//cranberrygame start
	Cnds.prototype.OnTrackScreenSucceeded = function ()
	{
		return true;
	};
	Cnds.prototype.OnTrackScreenFailed = function ()
	{
		return true;
	};
	Cnds.prototype.OnTrackEventSucceeded = function ()
	{
		return true;
	};
	Cnds.prototype.OnTrackEventFailed = function ()
	{
		return true;
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
		if (!(this.runtime.isAndroid || this.runtime.isBlackberry10 || this.runtime.isiOS || this.runtime.isWindows8App || this.runtime.isWindowsPhone8 || this.runtime.isWindowsPhone81))
			return;			
		if (this.runtime.isAndroid && navigator.platform == 'Win32')//crosswalk emulator
			return;
			
		// alert the message
		alert(myparam);
	};
	
	//cranberrygame
	Acts.prototype.TriggerAction = function ()
	{
		if (!(this.runtime.isAndroid || this.runtime.isBlackberry10 || this.runtime.isiOS || this.runtime.isWindows8App || this.runtime.isWindowsPhone8 || this.runtime.isWindowsPhone81))
			return;			
		if (this.runtime.isAndroid && navigator.platform == 'Win32')//crosswalk emulator
			return;
			
		var self=this;		
		self.runtime.trigger(cr.plugins_.cranberrygame_CordovaGoogleAnalytics.prototype.cnds.TriggerCondition, self);
	};	
	
	Acts.prototype.Open = function (URL, locationBar)
	{
		if (!(this.runtime.isAndroid || this.runtime.isBlackberry10 || this.runtime.isiOS || this.runtime.isWindows8App || this.runtime.isWindowsPhone8 || this.runtime.isWindowsPhone81))
			return;			
		if (this.runtime.isAndroid && navigator.platform == 'Win32')//crosswalk emulator
			return;		
		
	};	
*/
	
//cranberrygame start
	Acts.prototype.TrackScreen = function (screenName)
	{
		if (!(this.runtime.isAndroid || this.runtime.isiOS))
			return;			
        if (typeof analytics == 'undefined')
            return;

		if (this.trackId == '')
			return;
			
		var self=this;		
		
/*
		window['plugins']['gaPlugin']['trackPage'](function(result){
			self.runtime.trigger(cr.plugins_.cranberrygame_CordovaGoogleAnalytics.prototype.cnds.OnTrackScreenSucceeded, self);			
		}, function(error){
			self.runtime.trigger(cr.plugins_.cranberrygame_CordovaGoogleAnalytics.prototype.cnds.OnTrackScreenFailed, self);			
		}, screenName);
*/			
///*			
		analytics['trackView'](screenName, function(result){
			self.runtime.trigger(cr.plugins_.cranberrygame_CordovaGoogleAnalytics.prototype.cnds.OnTrackScreenSucceeded, self);	
		}, function(error){
			self.runtime.trigger(cr.plugins_.cranberrygame_CordovaGoogleAnalytics.prototype.cnds.OnTrackScreenFailed, self);
		});
//*/
	};
	//Acts.prototype.TrackEvent = function (eventCategory, eventAction, eventLabel, eventValue)
	Acts.prototype.TrackEvent = function (eventCategory, eventAction)
	{
		if (!(this.runtime.isAndroid || this.runtime.isiOS))
			return;			
        if (typeof analytics == 'undefined')
            return;

		if (this.trackId == '')
			return;
			
		var self=this;	
		
/*
		window['plugins']['gaPlugin']['trackEvent'](function(result){
			self.runtime.trigger(cr.plugins_.cranberrygame_CordovaGoogleAnalytics.prototype.cnds.OnTrackEventSucceeded, self);	
		}, function(error){
			self.runtime.trigger(cr.plugins_.cranberrygame_CordovaGoogleAnalytics.prototype.cnds.OnTrackEventFailed, self);	
		//}, eventCategory, eventAction, eventLabel, eventValue);
		}, eventCategory, eventAction, '', 0);
*/			
///*			
		//analytics['trackEvent'](eventCategory, eventAction, eventLabel, eventValue, function(result){
		analytics['trackEvent'](eventCategory, eventAction, '', 0, function(result){
			self.runtime.trigger(cr.plugins_.cranberrygame_CordovaGoogleAnalytics.prototype.cnds.OnTrackEventSucceeded, self);	
		}, function(error){
			self.runtime.trigger(cr.plugins_.cranberrygame_CordovaGoogleAnalytics.prototype.cnds.OnTrackEventFailed, self);	
		});
//*/
	};	
//cranberrygame end
	
	// ... other actions here ...
	
	pluginProto.acts = new Acts();
	
	//////////////////////////////////////
	// Expressions
	function Exps() {};
	
/*	
	// the example expression
	Exps.prototype.CellXCount = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
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
	//
	Exps.prototype.CurValue = function (ret)
	{
		ret.set_any(this.at(this.forX));
	};	
	Exps.prototype.At = function (ret, x_)
	{
		ret.set_any(this.at(x));
	};	
	Exps.prototype.Width = function (ret)
	{
		ret.set_int(this.cx);
	};
*/
	
//cranberrygame start
//cranberrygame end
	
	// ... other expressions here ...
	
	pluginProto.exps = new Exps();

}());