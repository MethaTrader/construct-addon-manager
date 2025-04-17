// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/*
//cranberrygame start: structure
cr.plugins_.cranberrygame_CordovaLocalNotification = function(runtime)
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
cr.plugins_.cranberrygame_CordovaLocalNotification = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	/////////////////////////////////////
	// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
	//                            vvvvvvvv
	var pluginProto = cr.plugins_.cranberrygame_CordovaLocalNotification.prototype;
		
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
	var localNotificationId = '';
	var localNotificationData = '';
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
		var self=this;
		window.addEventListener("resize", function () {//cranberrygame
			self.runtime.trigger(cr.plugins_.cranberrygame_CordovaLocalNotification.prototype.cnds.TriggerCondition, self);
		});
*/
//cranberrygame start
		if (!(this.runtime.isAndroid || this.runtime.isiOS || this.runtime.isWindowsPhone8 || this.runtime.isWindowsPhone81))
			return;		
		if (typeof window["plugin"] == 'undefined' || typeof window["plugin"]["notification"] == 'undefined' || typeof window["plugin"]["notification"]["local"] == 'undefined')
            return;

		var self=this;
		window["plugin"]["notification"]["local"]["ontrigger"] = function (id, state, json) {
			localNotificationId = id;
			localNotificationData = json;
			self.runtime.trigger(cr.plugins_.cranberrygame_CordovaLocalNotification.prototype.cnds.OnLocalNotificationArrived, self);
		};
		window["plugin"]["notification"]["local"]["oncancel"] = function (id, state, json) {
			localNotificationId = id;
			localNotificationData = json;
			self.runtime.trigger(cr.plugins_.cranberrygame_CordovaLocalNotification.prototype.cnds.OnCancelLocalNotificationSucceeded, self);
		};	

		window["plugin"]["notification"]["local"]["onclick"] = function (id, state, json) {
			localNotificationId = id;
			localNotificationData = json;
			self.runtime.trigger(cr.plugins_.cranberrygame_CordovaLocalNotification.prototype.cnds.OnLocalNotificationClicked, self);
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
	Cnds.prototype.OnLocalNotificationArrived = function ()
	{
		return true;
	};
	Cnds.prototype.OnCancelLocalNotificationSucceeded = function ()
	{
		return true;
	};	
	Cnds.prototype.OnLocalNotificationClicked = function ()
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
		// alert the message
		alert(myparam);
	};
	
	//cranberrygame
	Acts.prototype.TriggerAction = function ()
	{
		var self=this;		
		self.runtime.trigger(cr.plugins_.cranberrygame_CordovaLocalNotification.prototype.cnds.TriggerCondition, self);
	};	
*/
	
//cranberrygame start
	Acts.prototype.SendLocalNotification = function (ID, title, message, sound, data, delay, repeat)
	{
		if (!(this.runtime.isAndroid || this.runtime.isiOS || this.runtime.isWindowsPhone8 || this.runtime.isWindowsPhone81))
			return;		
		if (typeof window["plugin"] == 'undefined' || typeof window["plugin"]["notification"] == 'undefined' || typeof window["plugin"]["notification"]["local"] == 'undefined')
            return;
			
//alert(delay);
		var date=new Date();
//alert(date);
		date=new Date(date.getTime() + 1000*delay);
//alert(date);
			
		var options = {
			'id':      ID,
			'title':   title,
			'message': message,
			'date': date,
			'json': data
		};
	
		if (repeat!=0){
			var repeatStr="secondly";// Either 'secondly', 'minutely', 'hourly', 'daily', 'weekly', 'monthly' or 'yearly'
			if (repeat==1){
				repeatStr="secondly";
			}
			else if (repeat==2){
				repeatStr="minutely";
			}
			else if (repeat==3){
				repeatStr="hourly";
			}
			else if (repeat==4){
				repeatStr="daily";
			}
			else if (repeat==5){
				repeatStr="weekly";
			}
			else if (repeat==6){
				repeatStr="monthly";
			}
			else if (repeat==7){
				repeatStr="yearly";
			}

			options["repeat"]=repeatStr;
		}
		
		if (sound==0){
			options["sound"]=null;
		}
		
		window["plugin"]["notification"]["local"]["add"](options);
	};
	Acts.prototype.CancelLocalNotification = function (ID)
	{
		if (!(this.runtime.isAndroid || this.runtime.isiOS || this.runtime.isWindowsPhone8 || this.runtime.isWindowsPhone81))
			return;		
		if (typeof window["plugin"] == 'undefined' || typeof window["plugin"]["notification"] == 'undefined' || typeof window["plugin"]["notification"]["local"] == 'undefined')
            return;
		
		try {
			window["plugin"]["notification"]["local"]["cancel"](ID, function () {
				// The notification has been canceled
			});
		}
		catch (e) {		
		}
	};
	Acts.prototype.CancelAllLocalNotifications = function ()
	{
		if (!(this.runtime.isAndroid || this.runtime.isiOS || this.runtime.isWindowsPhone8 || this.runtime.isWindowsPhone81))
			return;		
		if (typeof window["plugin"] == 'undefined' || typeof window["plugin"]["notification"] == 'undefined' || typeof window["plugin"]["notification"]["local"] == 'undefined')
            return;
			
		try {			
			window["plugin"]["notification"]["local"]["cancelAll"](function () {
				// All notifications have been canceled
			});
		}
		catch (e) {		
		}			
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
	Exps.prototype.CanceledLocalNotificationId = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_int(localNotificationId);				// return our value
		// ret.set_float(0.5);			// for returning floats
		// ret.set_string("Hello");		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string
	};
	Exps.prototype.LocalNotificationId = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_int(localNotificationId);				// return our value
		// ret.set_float(0.5);			// for returning floats
		// ret.set_string("Hello");		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string
	};
	Exps.prototype.LocalNotificationData = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_string(localNotificationData);		// for ef_return_string
		// ret.set_float(0.5);			// for returning floats
		// ret.set_string("Hello");		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string
	};
//cranberrygame end
	
	// ... other expressions here ...
	
	pluginProto.exps = new Exps();

}());