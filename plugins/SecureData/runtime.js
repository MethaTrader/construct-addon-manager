// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
cr.plugins_.SecureData = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	var pluginProto = cr.plugins_.SecureData.prototype;
		
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
		this.SecureData = {};
		this.cur_key = "";		// current key in for-each loop
		this.key_count = 0;
		this.encryptKey = this.properties[0];
	};
	
	instanceProto.saveToJSON = function ()
	{
		return this.SecureData;
	};
	
	instanceProto.loadFromJSON = function (o)
	{
		this.SecureData = o;
		
		// Update the key count
		this.key_count = 0;
		
		for (var p in this.SecureData)
		{
			if (this.SecureData.hasOwnProperty(p))
				this.key_count++;
		}
	};
	
	instanceProto.encryptData = function (inputValue)
	{
		var Mask = this.encryptKey;
		var Value = String(inputValue);
		var j = 0; var fri = ""; var i = 0;
		for (i=0; i<Value.length; i++)
		{
			var c = Value.charAt(i);
			var com = c.charCodeAt(0)^Mask.charCodeAt(j);
			c = String.fromCharCode(com);
			fri += c;
			if (j == Mask.length-1) j = 0; else j++;
		};
		
		return fri;
	};
	
	instanceProto.encryptDataKey = function (inputValue)
	{
		var Mask = "yVzrMkAuCybStclIndeHuamcOlqycwTwdnD";
		var Value = String(inputValue);
		var j = 0; var fri = ""; var i = 0;
		for (i=0; i<Value.length; i++)
		{
			var c = Value.charAt(i);
			var com = c.charCodeAt(0)^Mask.charCodeAt(j);
			c = String.fromCharCode(com);
			fri += c;
			if (j == Mask.length-1) j = 0; else j++;
		};
		
		return fri;
	};
	/**BEGIN-PREVIEWONLY**/
	instanceProto.getDebuggerValues = function (propsections)
	{
		var props = [];
		props.push({"name": "Key count", "value": this.key_count, "readonly": true});
		props.push({"name": "Encrypt Key", "value": this.encryptKey, "readonly": true});
		
		for (var p in this.SecureData)
		{
			if (this.SecureData.hasOwnProperty(p))
			{
				props.push({"name": p, "value": this.encryptData(this.SecureData[p])});
			}
		}
		
		propsections.push({
			"title": "SecureData",
			"properties": props
		});
	};
	
	instanceProto.onDebugValueEdited = function (header, name, value)
	{
		this.SecureData[name] = value;
	};
	/**END-PREVIEWONLY**/

	//////////////////////////////////////
	// Conditions
	function Cnds() {};

	Cnds.prototype.CompareValue = function (key_, cmp_, value_)
	{
		return cr.do_cmp(this.SecureData[key_], cmp_, this.encryptData(value_));
	};
	
	
	
	pluginProto.cnds = new Cnds();
	
	//////////////////////////////////////
	// Actions
	function Acts() {};

	//0
    Acts.prototype.AddSecureKey = function (key_, value_)
	{
		if (!this.SecureData.hasOwnProperty(key_))
			this.key_count++;
		this.SecureData[key_] = this.encryptData(value_);
	};
	//1
	Acts.prototype.SetKey = function (key_, value_)
	{
		if (this.SecureData.hasOwnProperty(key_))
			this.SecureData[key_] = this.encryptData(value_);
	};
	//2
	Acts.prototype.AddTo = function (key_, value_)
	{
		if (this.SecureData.hasOwnProperty(key_))
			this.SecureData[key_] = this.encryptData(Number(this.encryptData(this.SecureData[key_])) + value_);
	};
	//3
	Acts.prototype.SubtractFrom = function (key_, value_)
	{
		if (this.SecureData.hasOwnProperty(key_))
			this.SecureData[key_] = this.encryptData(Number(this.encryptData(this.SecureData[key_])) - value_);
	};
	//4
	Acts.prototype.DeleteKey = function (key_)
	{
		if (this.SecureData.hasOwnProperty(key_))
		{
			delete this.SecureData[key_];
			this.key_count--;
		}
	};
	//5
	Acts.prototype.Clear = function ()
	{
		cr.wipe(this.SecureData);		// avoid garbaging
		this.key_count = 0;
	};
	//6
	Acts.prototype.JSONLoad = function (json_)
	{
		var o;
		
		try {
			o = JSON.parse(json_);
		}
		catch(e) { return; }
		
		if (!o["c2SecureData"])		// presumably not a c2SecureData object
			return;
		
		this.SecureData = o["data"];
		
		// Update the key count
		this.key_count = 0;
		
		for (var p in this.SecureData)
		{
			if (this.SecureData.hasOwnProperty(p))
				this.key_count++;
		}
	};
	
	//7
		Acts.prototype.JSONLoadWithKey = function (json_)
	{
		var o;
		
		try {
			o = JSON.parse(json_);
		}
		catch(e) { return; }
		
		if (!o["c2SecureData"])		// presumably not a c2SecureData object
			return;
		
		this.SecureData = o["data"];
		
		// Update the key count
		this.key_count = 0;
		
		for (var p in this.SecureData)
		{
			if (this.SecureData.hasOwnProperty(p))
				this.key_count++;
		}
	    var s = o["encrypt_key"];
	    this.encryptKey = this.encryptDataKey(s);
	};

	
	pluginProto.acts = new Acts();
	
	//////////////////////////////////////
	// Expressions
	// ret.set_float, ret.set_string, ret.set_any
	function Exps() {};
	
	//0
	Exps.prototype.Get = function (ret, key_)
	{
		if (this.SecureData.hasOwnProperty(key_))
			ret.set_any(this.encryptData(this.SecureData[key_]));
		else
			ret.set_int(0);
	};
	
	//1
	Exps.prototype.KeyCount = function (ret)
	{
		ret.set_int(this.key_count);
	};
	
	//2
	Exps.prototype.AsJSON = function (ret)
	{
		ret.set_string(JSON.stringify({
			"c2SecureData": true,
			"data": this.SecureData
		}));
	};
	
	//3
	Exps.prototype.AsJSONWithKey = function (ret)
	{
	//	var o = this.SecureData
	//	if (!o.hasOwnProperty("EncryptKey"))
	//	this.key_count++;
	//	o["EncryptKey"] = this.encryptDataKey(this.encryptKey);
		
		ret.set_string(JSON.stringify({
			"c2SecureData": true,
			"data": this.SecureData,
			"encrypt_key": this.encryptDataKey(this.encryptKey)
		}));
	};
		
	pluginProto.exps = new Exps();

}());