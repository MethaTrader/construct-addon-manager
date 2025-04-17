// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

cr.plugins_.AndroidTools = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{

	var pluginProto = cr.plugins_.AndroidTools.prototype;
		
	/////////////////////////////////////
	// Object type class
	pluginProto.Type = function(plugin)
	{
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};

	var typeProto = pluginProto.Type.prototype;
	
	var uniqueDeviceId = "Error";
	var text_input = "";
	var Volume = 10;

	typeProto.onCreate = function()
	{
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
	};

	/////////////////////////////////////
	// Instance class
	pluginProto.Instance = function(type)
	{
		this.type = type;
		this.runtime = type.runtime;

	};
	
	var instanceProto = pluginProto.Instance.prototype;

	
	function indexToType(index) {
		switch (index) {
		case 0:		return 0;
		case 1:		return 1;
		case 2:		return 8;
		}
	};
	
	// called whenever an instance is created
	instanceProto.onCreate = function()
	{

		if (!(this.runtime.isAndroid ))
			return;
        if (typeof window["miladesign"] == 'undefined')
            return;
			
		var self = this;
		
		window["miladesign"]["GetDeviceID"](success,null);
		
		window["miladesign"]['onVibrateSupported'] = function() {
			self.runtime.trigger(cr.plugins_.AndroidTools.prototype.cnds.onVibrateSupported, self);
		};
		
		window["miladesign"]['onVibrateNotSupported'] = function() {
			self.runtime.trigger(cr.plugins_.AndroidTools.prototype.cnds.onVibrateNotSupported, self);
		};

	};
	
	function success(uuid) {
		uniqueDeviceId = uuid;
	}
	
	instanceProto.draw = function(ctx)
	{
	};
	instanceProto.drawGL = function (glw)
	{
	};
	
	//////////////////////////////////////
	// Conditions
	function Cnds() {};
	
	Cnds.prototype.onVibrateSupported = function () {
		return true;
	};
	
	Cnds.prototype.onVibrateNotSupported = function () {
		return true;
	};
	
	Cnds.prototype.onMaxVolume = function () {
		return true;
	};
	
	Cnds.prototype.onButton1Clicked = function () {
		return true;
	};
	
	Cnds.prototype.onButton2Clicked = function () {
		return true;
	};
	
	Cnds.prototype.onButton3Clicked = function () {
		return true;
	};
	
	Cnds.prototype.onInputSuccess = function () {
		return true;
	};
	
	Cnds.prototype.onInputCancel = function () {
		return true;
	};
	
	pluginProto.cnds = new Cnds();
	
	//////////////////////////////////////
	// Actions
	function Acts() {};

	Acts.prototype.ShowProgressDialog = function (title,message)
	{
        if (!(this.runtime.isAndroid ))
            return;
        if (typeof window["miladesign"] == 'undefined')
            return;
		
        window["miladesign"]["ShowProgressDialog"](title,message);
	};
	
    Acts.prototype.HideProgressDialog = function ()
    {
        if (!(this.runtime.isAndroid ))
            return;
        if (typeof window["miladesign"] == 'undefined')
            return;

        window["miladesign"]["HideProgressDialog"]();
    };
	
	Acts.prototype.ShowDialog = function (title,message,button)
	{
        if (!(this.runtime.isAndroid ))
            return;
        if (typeof window["miladesign"] == 'undefined')
            return;
		
        window["miladesign"]["ShowDialog"](title,message,button);
	};
	
	Acts.prototype.ExitDialog = function (title, message, btnYes, btnNo)
	{
        if (!(this.runtime.isAndroid ))
            return;
        if (typeof window["miladesign"] == 'undefined')
            return;
		
        window["miladesign"]["ExitDialog"](title,message,btnYes,btnNo);
	};
	
	Acts.prototype.ShowToast = function (message,duration)
	{
        if (!(this.runtime.isAndroid ))
            return;
        if (typeof window["miladesign"] == 'undefined')
            return;
		
        window["miladesign"]["ShowToast"](message,duration);
	};
	
	Acts.prototype.CustomToast = function (message,duration,type)
	{
        if (!(this.runtime.isAndroid ))
            return;
        if (typeof window["miladesign"] == 'undefined')
            return;
		
        window["miladesign"]["CustomToast"](message,duration,type);
	};
	
	Acts.prototype.VibrateDevice = function (duration)
	{
        if (!(this.runtime.isAndroid ))
            return;
        if (typeof window["miladesign"] == 'undefined')
            return;
		
        window["miladesign"]["VibrateDevice"](duration);
	};
	
	Acts.prototype.VibrateSupported = function ()
	{
        if (!(this.runtime.isAndroid ))
            return;
        if (typeof window["miladesign"] == 'undefined')
            return;
		
        window["miladesign"]["VibrateSupported"]();
	};
	
    Acts.prototype.BazaarRate = function (packageName)
    {
        if (!(this.runtime.isAndroid ))
            return;
        if (typeof window["miladesign"] == 'undefined')
            return;

        window["miladesign"]["BazaarRate"](packageName);
    };
	
    Acts.prototype.BazaarApp = function (packageName)
    {
        if (!(this.runtime.isAndroid ))
            return;
        if (typeof window["miladesign"] == 'undefined')
            return;

        window["miladesign"]["BazaarApp"](packageName);
    };
	
    Acts.prototype.BazaarDeveloper = function (userName)
    {
        if (!(this.runtime.isAndroid ))
            return;
        if (typeof window["miladesign"] == 'undefined')
            return;

        window["miladesign"]["BazaarDeveloper"](userName);
    };
	
    Acts.prototype.MyketRate = function (packageName)
    {
        if (!(this.runtime.isAndroid ))
            return;
        if (typeof window["miladesign"] == 'undefined')
            return;

        window["miladesign"]["MyketRate"](packageName);
    };
	
    Acts.prototype.MyketApp = function (packageName)
    {
        if (!(this.runtime.isAndroid ))
            return;
        if (typeof window["miladesign"] == 'undefined')
            return;

        window["miladesign"]["MyketApp"](packageName);
    };
	
    Acts.prototype.MyketDeveloper = function (packageName)
    {
        if (!(this.runtime.isAndroid ))
            return;
        if (typeof window["miladesign"] == 'undefined')
            return;

        window["miladesign"]["MyketDeveloper"](packageName);
    };
	
    Acts.prototype.IranAppsRate = function (packageName)
    {
        if (!(this.runtime.isAndroid ))
            return;
        if (typeof window["miladesign"] == 'undefined')
            return;

        window["miladesign"]["IranAppsRate"](packageName);
    };
	
    Acts.prototype.IranAppsApp = function (packageName)
    {
        if (!(this.runtime.isAndroid ))
            return;
        if (typeof window["miladesign"] == 'undefined')
            return;

        window["miladesign"]["IranAppsApp"](packageName);
    };
	
    Acts.prototype.IranAppsDeveloper = function (userName)
    {
        if (!(this.runtime.isAndroid ))
            return;
        if (typeof window["miladesign"] == 'undefined')
            return;

        window["miladesign"]["IranAppsDeveloper"](userName);
    };
	
    Acts.prototype.CandoRate = function (packageName)
    {
        if (!(this.runtime.isAndroid ))
            return;
        if (typeof window["miladesign"] == 'undefined')
            return;

        window["miladesign"]["CandoRate"](packageName);
    };
	
    Acts.prototype.CandoApp = function (packageName)
    {
        if (!(this.runtime.isAndroid ))
            return;
        if (typeof window["miladesign"] == 'undefined')
            return;

        window["miladesign"]["CandoApp"](packageName);
    };
	
    Acts.prototype.CandoDeveloper = function (userName)
    {
        if (!(this.runtime.isAndroid ))
            return;
        if (typeof window["miladesign"] == 'undefined')
            return;

        window["miladesign"]["CandoDeveloper"](userName);
    };
	
    Acts.prototype.ParshubRate = function (packageName)
    {
        if (!(this.runtime.isAndroid ))
            return;
        if (typeof window["miladesign"] == 'undefined')
            return;

        window["miladesign"]["ParshubRate"](packageName);
    };
	
    Acts.prototype.ParshubApp = function (packageName)
    {
        if (!(this.runtime.isAndroid ))
            return;
        if (typeof window["miladesign"] == 'undefined')
            return;

        window["miladesign"]["ParshubApp"](packageName);
    };
	
    Acts.prototype.ParshubDeveloper = function (userName)
    {
        if (!(this.runtime.isAndroid ))
            return;
        if (typeof window["miladesign"] == 'undefined')
            return;

        window["miladesign"]["ParshubDeveloper"](userName);
    };
	
    Acts.prototype.AllMarketsApp = function (packageName)
    {
        if (!(this.runtime.isAndroid ))
            return;
        if (typeof window["miladesign"] == 'undefined')
            return;

        window["miladesign"]["AllMarketsApp"](packageName);
    };
	
    Acts.prototype.AvvalMarketRate = function (packageName)
    {
        if (!(this.runtime.isAndroid ))
            return;
        if (typeof window["miladesign"] == 'undefined')
            return;

        window["miladesign"]["AvvalMarketRate"](packageName);
    };
	
    Acts.prototype.OpenUrl = function (url)
    {
        if (!(this.runtime.isAndroid ))
            return;
        if (typeof window["miladesign"] == 'undefined')
            return;

        window["miladesign"]["OpenUrl"](url);
    };
	
    Acts.prototype.OpenApp = function (packageName)
    {
        if (!(this.runtime.isAndroid ))
            return;
        if (typeof window["miladesign"] == 'undefined')
            return;

        window["miladesign"]["OpenApp"](packageName);
    };
	
    Acts.prototype.TelegramProfile = function (userName)
    {
        if (!(this.runtime.isAndroid ))
            return;
        if (typeof window["miladesign"] == 'undefined')
            return;

        window["miladesign"]["TelegramProfile"](userName);
    };
	
    Acts.prototype.InstagramProfile = function (userName)
    {
        if (!(this.runtime.isAndroid ))
            return;
        if (typeof window["miladesign"] == 'undefined')
            return;

        window["miladesign"]["InstagramProfile"](userName);
    };
	
    Acts.prototype.ShareText = function (title,text)
    {
        if (!(this.runtime.isAndroid ))
            return;
        if (typeof window["miladesign"] == 'undefined')
            return;

        window["miladesign"]["ShareText"](title,text);
    };
	
    Acts.prototype.ShareApp = function (title,packageName)
    {
        if (!(this.runtime.isAndroid ))
            return;
        if (typeof window["miladesign"] == 'undefined')
            return;

        window["miladesign"]["ShareApp"](title,packageName);
    };
	
    Acts.prototype.SetScreenBrightness = function (value) {
        if (!(this.runtime.isAndroid ))
            return;
        if (typeof window["miladesign"] == 'undefined')
            return;

        window["miladesign"]["SetScreenBrightness"](value);
    };
	
    Acts.prototype.SetScreenOrientation = function (Orientation) {
        if (!(this.runtime.isAndroid ))
            return;
        if (typeof window["miladesign"] == 'undefined')
            return;

        window["miladesign"]["SetScreenOrientation"](indexToType(Orientation));
    };
	
    Acts.prototype.OpenWhatsapp = function (number) {
        if (!(this.runtime.isAndroid ))
            return;
        if (typeof window["miladesign"] == 'undefined')
            return;

        window["miladesign"]["OpenWhatsapp"](number);
    };
	
    Acts.prototype.SetVolume = function (channel,value,showUI) {
        if (!(this.runtime.isAndroid ))
            return;
        if (typeof window["miladesign"] == 'undefined')
            return;

        window["miladesign"]["SetVolume"](channel,value,showUI!=0?true:false);
    };
	
    Acts.prototype.GetMaxVolume = function (channel) {
        if (!(this.runtime.isAndroid ))
            return;
        if (typeof window["miladesign"] == 'undefined')
            return;
		var self = this;
        window["miladesign"]["GetMaxVolume"](function (result) {
			Volume = result;
			self.runtime.trigger(cr.plugins_.AndroidTools.prototype.cnds.onMaxVolume, self);
		},channel);
    };
	
    Acts.prototype.SetRingerMode = function (mode) {
        if (!(this.runtime.isAndroid ))
            return;
        if (typeof window["miladesign"] == 'undefined')
            return;

        window["miladesign"]["SetRingerMode"](mode);
    };
	
	Acts.prototype.ThreeDialog = function (title,message,btn1,btn2,btn3)
	{
        if (!(this.runtime.isAndroid ))
            return;
        if (typeof window["miladesign"] == 'undefined')
            return;
		
		var self = this;
        window["miladesign"]["ThreeDialog"](title,message,btn1,btn2,btn3,function (result) {
			switch (result) {
				case 1:	self.runtime.trigger(cr.plugins_.AndroidTools.prototype.cnds.onButton1Clicked, self); break;
				case 2:	self.runtime.trigger(cr.plugins_.AndroidTools.prototype.cnds.onButton2Clicked, self); break;
				case 3:	self.runtime.trigger(cr.plugins_.AndroidTools.prototype.cnds.onButton3Clicked, self); break;
			}
		});
	};
	
	Acts.prototype.InputDialog = function (title,message,btnOK,btnCancel,hint,type,format)
	{
        if (!(this.runtime.isAndroid ))
            return;
        if (typeof window["miladesign"] == 'undefined')
            return;
		
		var self = this;
        window["miladesign"]["InputDialog"](title,message,btnOK,btnCancel,hint,type,format,function (result) {
			text_input = result;
			self.runtime.trigger(cr.plugins_.AndroidTools.prototype.cnds.onInputSuccess, self);
		},function (error) {
			self.runtime.trigger(cr.plugins_.AndroidTools.prototype.cnds.onInputCancel, self);
		});
	};
	
	pluginProto.acts = new Acts();
	
	//////////////////////////////////////
	// Expressions
	function Exps() {};
	
	Exps.prototype.get_id = function (ret) {
		ret.set_string(uniqueDeviceId);
	};
	
	Exps.prototype.maxVolume = function (ret) {
		ret.set_int(Volume);
	};
	
	Exps.prototype.getInput = function (ret) {
		ret.set_string(text_input);
	};
	
	pluginProto.exps = new Exps();

}());