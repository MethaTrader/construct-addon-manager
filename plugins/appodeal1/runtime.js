"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

cr.plugins_.appodeal = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{

	var pluginProto = cr.plugins_.appodeal.prototype;

	pluginProto.Type = function(plugin)
	{
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};

	var typeProto = pluginProto.Type.prototype;

	var appKey;
	
	typeProto.onCreate = function()
	{
	};

	pluginProto.Instance = function(type)
	{
		this.type = type;
		this.runtime = type.runtime;
	};
	
	var instanceProto = pluginProto.Instance.prototype;

	instanceProto.onCreate = function()
	{
		if (!(this.runtime.isAndroid))
			return;
		if (typeof window["Appodeal"] == 'undefined')
			return;
					
		if (this.runtime.isAndroid){
			appKey = this.properties[0];
		}

	};
	
	instanceProto.draw = function(ctx)
	{
	};
	
	instanceProto.drawGL = function (glw)
	{
	};
	
	function indexShow(i)
	{
		switch (i) {
			case 0:		return 1;
			case 1:		return 2;
			case 2:		return 3;
			case 3:		return 4;
			case 4:		return 8;
			case 5:		return 16;
			case 6:		return 32;
			case 7:		return 127;
		}
		
		return 1;
	};
	
	function indexShowIfLoaded(i)
	{
		switch (i) {
			case 0:		return 1;
			case 1:		return 2;
			case 2:		return 3;
			case 3:		return 127;
		}
		return 1;
	};
	
	function indexInitialize(i)
	{
		switch (i) {
			case 0:		return 1;
			case 1:		return 2;
			case 2:		return 3;
			case 3:		return 4;
			case 4:		return 127;
		}
		return 127;
	};

	function indexCache(i)
	{
		switch (i) {
			case 0:		return 1;
			case 1:		return 2;
			case 2:		return 3;
			case 3:		return 4;
			case 4:		return 127;
		}
		return 127;
	};
	
	function Cnds() {};
	pluginProto.cnds = new Cnds();

	function Acts() {};

	Acts.prototype.Initialize = function ()
	{
		if (!(this.runtime.isAndroid))
			return;
        if (typeof window["Appodeal"] == 'undefined')
            return;
			
		window["Appodeal"]["initialize"](appKey);
		/*window["Appodeal"]["enableInterstitialCallbacks"](true);
		window["Appodeal"]["enableVideoCallbacks"](true);
		window["Appodeal"]["enableBannerCallbacks"](true);*/
	}
	Acts.prototype.InitializeAdType = function (adType)
	{
		if (!(this.runtime.isAndroid))
			return;
        if (typeof window["Appodeal"] == 'undefined')
            return;
			
		window["Appodeal"]["initializeAdType"](appKey, indexInitialize(adType));
		/*window["Appodeal"]["enableInterstitialCallbacks"](true);
		window["Appodeal"]["enableVideoCallbacks"](true);
		window["Appodeal"]["enableBannerCallbacks"](true);*/
	}
	Acts.prototype.Show = function (adType)
	{
		if (!(this.runtime.isAndroid))
			return;
        if (typeof window["Appodeal"] == 'undefined')
            return;
			
		window["Appodeal"]["show"](indexShow(adType));		
	};
	Acts.prototype.Hide = function ()
	{
		if (!(this.runtime.isAndroid))
			return;
        if (typeof window["Appodeal"] == 'undefined')
            return;
			
		window["Appodeal"]["hide"](4);		
	};
	Acts.prototype.ShowIfLoaded = function (adType)
	{
		if (!(this.runtime.isAndroid))
			return;
        if (typeof window["Appodeal"] == 'undefined')
            return;
			
		window["Appodeal"]["isLoaded"](indexShowIfLoaded(adType), function(result){
			if(result) {
				window["Appodeal"]["show"](indexShowIfLoaded(adType));
			}
		});	
	};
	Acts.prototype.setAutoCache = function (adType, condition)
	{
		if (!(this.runtime.isAndroid))
			return;
        if (typeof window["Appodeal"] == 'undefined')
            return;
		
		var autoCache = true;
		if (condition == 0) {
			autoCache = true;
		} else if (condition == 1) {
			autoCache = false;
		}
			
		window["Appodeal"]["setAutoCache"](indexInitialize(adType), autoCache);	
	};
	Acts.prototype.Cache = function (adType)
	{
		if (!(this.runtime.isAndroid))
			return;
        if (typeof window["Appodeal"] == 'undefined')
            return;
			
		window["Appodeal"]["cache"](indexCache(adType));	
	};
	
	Acts.prototype.DisableNetwork = function (network)
	{
		if (!(this.runtime.isAndroid))
			return;
        if (typeof window["Appodeal"] == 'undefined')
            return;
			
		window["Appodeal"]["disableNetwork"](network);	
	};
	
	pluginProto.acts = new Acts();
	
	function Exps() {};
	
	pluginProto.exps = new Exps();

}());