// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/*
//cranberrygame start: structure
cr.plugins_.cranberrygame_CordovaBluetoothSerial = function(runtime)
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
cr.plugins_.cranberrygame_CordovaBluetoothSerial = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	/////////////////////////////////////
	// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
	//                            vvvvvvvv
	var pluginProto = cr.plugins_.cranberrygame_CordovaBluetoothSerial.prototype;
		
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
			self.runtime.trigger(cr.plugins_.cranberrygame_CordovaBluetoothSerial.prototype.cnds.TriggerCondition, self);
		});
*/
//cranberrygame start
		if (!(this.runtime.isAndroid || this.runtime.isiOS))
			return;			
        if (typeof bluetoothSerial == 'undefined')
            return;
			
		this.pairedDeviceNameList=[];
		this.pairedDeviceMacaddressList=[];
		this.readData="";	
		this.readUntilData="";
		this.subscribeData="";
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
	Cnds.prototype.OnCheckBluetoothEnabledEnabled = function ()
	{
		return true;
	};	
	Cnds.prototype.OnCheckBluetoothEnabledDisabled = function ()
	{
		return true;
	};
	Cnds.prototype.OnPairedDeviceListFound = function ()
	{
		return true;
	};	
	Cnds.prototype.OnPairedDeviceListNotFound = function ()
	{
		return true;
	};	
	Cnds.prototype.OnConnectSucceeded = function ()
	{
		return true;
	};	
	Cnds.prototype.OnConnectFailed = function ()
	{
		return true;
	};
	Cnds.prototype.OnConnectInsecureSucceeded = function ()
	{
		return true;
	};	
	Cnds.prototype.OnConnectInsecureFailed = function ()
	{
		return true;
	};	
	Cnds.prototype.OnDisconnectSucceeded = function ()
	{
		return true;
	};	
	Cnds.prototype.OnDisconnectFailed = function ()
	{
		return true;
	};	
	Cnds.prototype.OnCheckConnectedConnected = function ()
	{
		return true;
	};	
	Cnds.prototype.OnCheckConnectedDisconnected = function ()
	{
		return true;
	};	
	Cnds.prototype.OnWriteSucceeded = function ()
	{
		return true;
	};	
	Cnds.prototype.OnWriteFailed = function ()
	{
		return true;
	};	
	Cnds.prototype.OnReadData = function ()
	{
		return true;
	};	
	Cnds.prototype.OnReadUntilData = function ()
	{
		return true;
	};			
	Cnds.prototype.OnSubscribeData = function ()
	{
		return true;
	};
	Cnds.prototype.OnUnsubscribeSucceeded = function ()
	{
		return true;
	};	
	Cnds.prototype.OnUnsubscribeFailed = function ()
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
		self.runtime.trigger(cr.plugins_.cranberrygame_CordovaBluetoothSerial.prototype.cnds.TriggerCondition, self);
	};	
*/
	
//cranberrygame start
	Acts.prototype.CheckBluetoothEnabled = function ()
	{
		if (!(this.runtime.isAndroid || this.runtime.isiOS))
			return;			
        if (typeof bluetoothSerial == 'undefined')
            return;
			
		var self = this;
	
		bluetoothSerial["isEnabled"](
			function() { 
				console.log("Bluetooth is enabled");
				self.runtime.trigger(cr.plugins_.cranberrygame_CordovaBluetoothSerial.prototype.cnds.OnCheckBluetoothEnabledEnabled, self);
			},
			function() { 
				console.log("Bluetooth is *not* enabled");
				self.runtime.trigger(cr.plugins_.cranberrygame_CordovaBluetoothSerial.prototype.cnds.OnCheckBluetoothEnabledDisabled, self);
			}
		);
	};
	Acts.prototype.PairedDeviceList = function ()
	{
		if (!(this.runtime.isAndroid || this.runtime.isiOS))
			return;			
        if (typeof bluetoothSerial == 'undefined')
            return;
			
		var self = this;
		
		bluetoothSerial["list"](function(devices) {
/*
//android
[{
    "id": "10:BF:48:CB:00:00",
    "class": 276,
    "address": "10:BF:48:CB:00:00",
    "name": "Nexus 7"
}, {
    "id": "00:06:66:4D:00:00",
    "class": 7936,
    "address": "00:06:66:4D:00:00",
    "name": "RN42"
}]

/ios
[{
    "id": "CC410A23-2865-F03E-FC6A-4C17E858E11E",
    "uuid": "CC410A23-2865-F03E-FC6A-4C17E858E11E",
    "name": "Biscuit",
    "rssi": -68
}]
*/
			console.log("list succeeded: "+JSON.stringify(devices));
			//alert("list succeeded: "+JSON.stringify(devices));//
		
			self.pairedDeviceNameList=[];
			self.pairedDeviceMacaddressList=[];
			devices.forEach(function(device) {
				var deviceId;

				// TODO https://github.com/don/BluetoothSerial/issues/5
				if (device.hasOwnProperty("address")) {
					deviceId = device["address"];
				} 
				else if (device.hasOwnProperty("uuid")) {
					deviceId = device["uuid"];
				}
				else {
					deviceId = "ERROR " + JSON.stringify(device);
				}

				self.pairedDeviceNameList.push(device["name"]);
				self.pairedDeviceMacaddressList.push(deviceId);
				//alert(device["name"]);
				//alert(deviceId);
			});
			
			if (self.pairedDeviceMacaddressList.length>0)
				self.runtime.trigger(cr.plugins_.cranberrygame_CordovaBluetoothSerial.prototype.cnds.OnPairedDeviceListFound, self);
			else
				self.runtime.trigger(cr.plugins_.cranberrygame_CordovaBluetoothSerial.prototype.cnds.OnPairedDeviceListNotFound, self);
		}, 
		function(error){
			console.log("list failed: "+JSON.stringify(error));
			self.runtime.trigger(cr.plugins_.cranberrygame_CordovaBluetoothSerial.prototype.cnds.OnPairedDeviceListNotFound, self);
		});
	};
	
	
	Acts.prototype.Connect = function (macAddress_or_uuid)
	{
		if (!(this.runtime.isAndroid || this.runtime.isiOS))
			return;			
        if (typeof bluetoothSerial == 'undefined')
            return;
			
		var self = this;
		
		bluetoothSerial["connect"](macAddress_or_uuid,
		function(info){
			self.runtime.trigger(cr.plugins_.cranberrygame_CordovaBluetoothSerial.prototype.cnds.OnConnectSucceeded, self);
		},
		function(error){
			self.runtime.trigger(cr.plugins_.cranberrygame_CordovaBluetoothSerial.prototype.cnds.OnConnectFailed, self);
		});
	};
	Acts.prototype.ConnectInsecure = function (macAddress_or_uuid)
	{
		if (!(this.runtime.isAndroid || this.runtime.isiOS))
			return;			
        if (typeof bluetoothSerial == 'undefined')
            return;
			
		var self = this;
		
		bluetoothSerial["connectInsecure"](macAddress,
		function(info){
			self.runtime.trigger(cr.plugins_.cranberrygame_CordovaBluetoothSerial.prototype.cnds.OnConnectInsecureSucceeded, self);
		},
		function(error){
			self.runtime.trigger(cr.plugins_.cranberrygame_CordovaBluetoothSerial.prototype.cnds.OnConnectInsecureFailed, self);
		});
	};
	Acts.prototype.Disconnect = function ()
	{
		if (!(this.runtime.isAndroid || this.runtime.isiOS))
			return;			
        if (typeof bluetoothSerial == 'undefined')
            return;
			
		var self = this;
		
		bluetoothSerial["disconnect"](
		function(info){
			self.runtime.trigger(cr.plugins_.cranberrygame_CordovaBluetoothSerial.prototype.cnds.OnDisconnectSucceeded, self);		
		},
		function(error){
			self.runtime.trigger(cr.plugins_.cranberrygame_CordovaBluetoothSerial.prototype.cnds.OnDisconnectFailed, self);
		});
	};
	Acts.prototype.CheckConnected = function ()
	{
		if (!(this.runtime.isAndroid || this.runtime.isiOS))
			return;			
        if (typeof bluetoothSerial == 'undefined')
            return;
			
		var self = this;
		
		bluetoothSerial["isConnected"](
			function() { 
				console.log("connected");
				self.runtime.trigger(cr.plugins_.cranberrygame_CordovaBluetoothSerial.prototype.cnds.OnCheckConnectedConnected, self);
			},
			function() { 
				console.log("disconnected");
				self.runtime.trigger(cr.plugins_.cranberrygame_CordovaBluetoothSerial.prototype.cnds.OnCheckConnectedDisconnected, self);
			}
		);
	};
	Acts.prototype.Write = function (data)
	{
		if (!(this.runtime.isAndroid || this.runtime.isiOS))
			return;			
        if (typeof bluetoothSerial == 'undefined')
            return;
			
		var self = this;
		
		bluetoothSerial["write"](data,
		function(result){
			self.runtime.trigger(cr.plugins_.cranberrygame_CordovaBluetoothSerial.prototype.cnds.OnWriteSucceeded, self);
		},
		function(error){
			self.runtime.trigger(cr.plugins_.cranberrygame_CordovaBluetoothSerial.prototype.cnds.OnWriteFailed, self);
		});
	};
	Acts.prototype.Read = function ()
	{
		if (!(this.runtime.isAndroid || this.runtime.isiOS))
			return;			
        if (typeof bluetoothSerial == 'undefined')
            return;
			
		var self = this;
		
		bluetoothSerial["read"](function (data) {
			//console.log(data);
			self.readData=data;			
			self.runtime.trigger(cr.plugins_.cranberrygame_CordovaBluetoothSerial.prototype.cnds.OnReadData, self);
		}, 
		function(error){
		});
	};
	Acts.prototype.ReadUntil = function (delimiter)
	{
		if (!(this.runtime.isAndroid || this.runtime.isiOS))
			return;			
        if (typeof bluetoothSerial == 'undefined')
            return;
			
		var self = this;
		
		bluetoothSerial["readUntil"](delimiter, function (data) {
			//console.log(data);
			self.readUntilData = data;
			self.runtime.trigger(cr.plugins_.cranberrygame_CordovaBluetoothSerial.prototype.cnds.OnReadUntilData, self);
		}, 
		function(error){
		});
	};
	Acts.prototype.Subscribe = function (delimiter)
	{
		if (!(this.runtime.isAndroid || this.runtime.isiOS))
			return;			
        if (typeof bluetoothSerial == 'undefined')
            return;
			
		var self = this;
		
		// the success callback is called whenever data is received
		bluetoothSerial["subscribe"](delimiter, function (data) {
			self.subscribeData = data;
			self.runtime.trigger(cr.plugins_.cranberrygame_CordovaBluetoothSerial.prototype.cnds.OnSubscribeData, self);
		}, 
		function(error){
		});
	};
	Acts.prototype.Unsubscribe = function ()
	{
		if (!(this.runtime.isAndroid || this.runtime.isiOS))
			return;			
        if (typeof bluetoothSerial == 'undefined')
            return;
			
		var self = this;
		
		bluetoothSerial["unsubscribe"](
		function(result){			
			self.runtime.trigger(cr.plugins_.cranberrygame_CordovaBluetoothSerial.prototype.cnds.OnUnsubscribeSucceeded, self);
		},
		function(error){
			self.runtime.trigger(cr.plugins_.cranberrygame_CordovaBluetoothSerial.prototype.cnds.OnUnsubscribeFailed, self);
		});
	};
	Acts.prototype.Clear = function ()
	{
		if (!(this.runtime.isAndroid || this.runtime.isiOS))
			return;			
        if (typeof bluetoothSerial == 'undefined')
            return;
			
		var self = this;
		
		bluetoothSerial["clear"](
		function(result){			
			self.readData="";	
			self.readUntilData="";
			self.subscribeData="";
		},
		function(error){
		});		
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
	Exps.prototype.PairedDeviceCount = function (ret) //cranberrygame
	{     
		ret.set_string(this.pairedDeviceMacaddressList.length);		// return our value
		//ret.set_int(1337);				// return our value
		// ret.set_float(0.5);			// for returning floats
		// ret.set_string("Hello");		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string		
	};
	Exps.prototype.PairedDeviceNameAt = function (ret, index) //cranberrygame
	{     
		ret.set_string(this.pairedDeviceNameList[index]);		// return our value
		//ret.set_int(1337);				// return our value
		// ret.set_float(0.5);			// for returning floats
		// ret.set_string("Hello");		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string		
	};
	Exps.prototype.PairedDeviceMacaddressAt = function (ret, index) //cranberrygame
	{     
		ret.set_string(this.pairedDeviceMacaddressList[index]);		// return our value
		//ret.set_int(1337);				// return our value
		// ret.set_float(0.5);			// for returning floats
		// ret.set_string("Hello");		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string		
	};
	Exps.prototype.ReadData = function (ret) //cranberrygame
	{     
		ret.set_string(this.readData);		// for ef_return_string
		//ret.set_int(1337);				// return our value
		// ret.set_float(0.5);			// for returning floats
		// ret.set_string("Hello");		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string		
	};
	Exps.prototype.ReadUntilData = function (ret) //cranberrygame
	{     
		ret.set_string(this.readUntilData);		// for ef_return_string
		//ret.set_int(1337);				// return our value
		// ret.set_float(0.5);			// for returning floats
		// ret.set_string("Hello");		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string		
	};
	Exps.prototype.SubscribeData = function (ret) //cranberrygame
	{     
		ret.set_string(this.subscribeData);		// return our value
		//ret.set_int(1337);				// return our value
		// ret.set_float(0.5);			// for returning floats
		// ret.set_string("Hello");		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string		
	};	
//cranberrygame end
	
	// ... other expressions here ...
	
	pluginProto.exps = new Exps();

}());