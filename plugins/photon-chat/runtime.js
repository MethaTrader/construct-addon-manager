// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

// assign globals with correct value in case closure compilier renames them
var Photon = this["Photon"];
var Exitgames = this["Exitgames"];

/////////////////////////////////////
// Plugin class
// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
//          vvvvvvvv
cr.plugins_.PhotonChat = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	/////////////////////////////////////
	// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
	//                            vvvvvvvv
	var pluginProto = cr.plugins_.PhotonChat.prototype;
		
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
		
		// any other properties you need, e.g...
		// this.myValue = 0;
	};
	
	var instanceProto = pluginProto.Instance.prototype;
	
	instanceProto.createChatClient = function()
	{
		Exitgames["Common"]["Logger"]["setExceptionHandler"](function(code, message) {
			self.errorCode = code;
			self.errorMsg = message;
			self.runtime.trigger(cr.plugins_.Photon.prototype.cnds.onError, self);
			return false;
		});
		
		this.chatClient = new Photon["Chat"]["ChatClient"](this.Protocol, this.AppId, this.AppVersion);
		var self = this;
		
		this.chatClient["setLogLevel"](this.LogLevel);
		
		this.chatClient["onError"] = function(errorCode, errorMsg) {
			self.errorCode = errorCode;
			self.errorMsg = errorMsg;
			self.runtime.trigger(cr.plugins_.PhotonChat.prototype.cnds.onError, self);
		};
		this.chatClient["onStateChange"] = function(state) {
			self.runtime.trigger(cr.plugins_.PhotonChat.prototype.cnds.onStateChange, self);
			
			var ChatClient = Photon["Chat"]["ChatClient"];
			switch (state) {
				case ChatClient["ChatState"]["ConnectedToFrontEnd"]:
					self.runtime.trigger(cr.plugins_.PhotonChat.prototype.cnds.onConnectedToFrontEnd, self);
					break;
				default:
					break;
			}
		};
		this.chatClient["onChatMessages"] = function(channelName, messages) {
			self.channel = channelName;

			for (var i = 0; i < messages.length; i++) {
				var m = messages[i];
				self.message = m["getContent"]();
				self.sender = m["getSender"]();
				self.runtime.trigger(cr.plugins_.PhotonChat.prototype.cnds.onMessage, self);
				self.runtime.trigger(cr.plugins_.PhotonChat.prototype.cnds.onMessageInChannel, self);
			}			
		};
		
		this.chatClient["onPrivateMessage"] = function (channelName, message) {
			self.channel = channelName;
			self.message = message["getContent"]();
			self.sender = message["getSender"]();
			self.runtime.trigger(cr.plugins_.PhotonChat.prototype.cnds.onPrivateMessage, self);
			self.runtime.trigger(cr.plugins_.PhotonChat.prototype.cnds.onPrivateMessageInChannel, self);
        };
		
		this.chatClient["onUserStatusUpdate"] = function (userId, status, gotMessage, statusMessage){ 
			self.userStatusUserId = userId;
			self.userStatus = status;
			self.userStatusMessageUpdated = gotMessage ? 1 : 0;
			self.userStatusMessage = statusMessage ? statusMessage : "";
			self.runtime.trigger(cr.plugins_.PhotonChat.prototype.cnds.onUserStatusUpdate, self);
		};

        this.chatClient["onSubscribeResult"] = function (results) { 
			for (var i in results) {
				self.channel = i;
				self.result = results[i] ? 1 : 0;
				self.runtime.trigger(cr.plugins_.PhotonChat.prototype.cnds.onSubscribeResult, self);
			}
		};
		
		this.chatClient["onUnsubscribeResult"] = function (results) { 
			for (var i in results) {
				self.channel = i;
				self.result = results[i] ? 1 : 0;
				self.runtime.trigger(cr.plugins_.PhotonChat.prototype.cnds.onUnsubscribeResult, self);
			}
		};
	};
	
	// called whenever an instance is created
	instanceProto.onCreate = function()
	{
		// note the object is sealed after this call; ensure any properties you'll ever need are set on the object
		// e.g...
		// this.myValue = 0;

		this.AppId = this.properties[0];
		this.AppVersion = this.properties[1];
		this.Protocol = ["ws", "wss"][this.properties[2]] == "wss" ? this.Protocol = Photon["ConnectionProtocol"]["Wss"] : Photon["ConnectionProtocol"]["Ws"];
		this.Region = ["EU", "US", "Asia"][this.properties[3]];
		this.LogLevel = this.properties[4] + Exitgames["Common"]["Logger"]["Level"]["DEBUG"]; // list starts from DEBUG = 1
		
		this.createChatClient();
	}
	
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
	
	// The comments around these functions ensure they are removed when exporting, since the
	// debugger code is no longer relevant after publishing.
	/**BEGIN-PREVIEWONLY**/
	instanceProto.getDebuggerValues = function (propsections)
	{
		// Append to propsections any debugger sections you want to appear.
		// Each section is an object with two members: "title" and "properties".
		// "properties" is an array of individual debugger properties to display
		// with their name and value, and some other optional settings.
		propsections.push({
			"title": "My debugger section",
			"properties": [
				// Each property entry can use the following values:
				// "name" (required): name of the property (must be unique within this section)
				// "value" (required): a boolean, number or string for the value
				// "html" (optional, default false): set to true to interpret the name and value
				//									 as HTML strings rather than simple plain text
				// "readonly" (optional, default false): set to true to disable editing the property
				
				// Example:
				// {"name": "My property", "value": this.myValue}
			]
		});
	};
	
	instanceProto.onDebugValueEdited = function (header, name, value)
	{
		// Called when a non-readonly property has been edited in the debugger. Usually you only
		// will need 'name' (the property name) and 'value', but you can also use 'header' (the
		// header title for the section) to distinguish properties with the same name.
		if (name === "My property")
			this.myProperty = value;
	};
	/**END-PREVIEWONLY**/

	//////////////////////////////////////
	// Conditions
	function Cnds() {}

	Cnds.prototype.onError 						= function() { return true; };
	Cnds.prototype.onStateChange 				= function() { return true; };
	Cnds.prototype.onMessageInChannel 			= function(channel) { return this.channel == channel; };
	Cnds.prototype.onMessage					= function() { return true; };
	Cnds.prototype.onPrivateMessageInChannel	= function(channel) { return this.channel == channel; };
	Cnds.prototype.onPrivateMessage				= function() { return true; };
	Cnds.prototype.onUserStatusUpdate			= function() { return true; };
	Cnds.prototype.onSubscribeResult			= function(success) { return !!this.result != !!success; };
	Cnds.prototype.onUnsubscribeResult			= function(success) { return !!this.result != !!success; };

	Cnds.prototype.onConnectedToFrontEnd = function() { return true; };
	
	Cnds.prototype.isConnectedToNameServer = function ()
	{
		return this.chatClient["isConnectedToNameServer"]();
	};
	Cnds.prototype.isConnectedToFrontEnd = function ()
	{
		return this.chatClient["isConnectedToFrontEnd"]();
	};	
	
	// ... other conditions here ...
	
	pluginProto.cnds = new Cnds();
	
	//////////////////////////////////////
	// Actions
	function Acts() {}

	Acts.prototype.setUserId = function (userId)
	{
		this.chatClient["setUserId"](userId);
	};
	
	Acts.prototype.setCustomAuthentication = function (authParameters, authType)
	{
		this.chatClient["setCustomAuthentication"](authParameters, authType);
	};
	
	Acts.prototype.setRegion = function (region)
	{
		this.Region = region;
	};

	Acts.prototype.setAppId = function (appId)
	{
		this.AppId = appId;
	};

	Acts.prototype.setAppVersion = function (version)
	{
		this.AppVersion = version;
	};
	
	Acts.prototype.connect = function ()
	{
		if (this.Region)
			this.chatClient["connectToRegionMaster"](this.Region);
		else
			this.chatClient["connectToNameServer"]();
	};

	Acts.prototype.disconnect = function ()
	{
		this.chatClient["disconnect"]();
	};

	Acts.prototype.subscribe = function (channelNames, historyLength, lastIds)
	{
		var opt = {}
		var ids
		if (historyLength)
		{
			opt["historyLength"] = historyLength
		}
		if (lastIds)
		{
			opt["lastIds"] = lastIds.split(",").map(x => parseInt(x))
		}
		this.chatClient["subscribe"](channelNames.split(","), opt);
	};

	Acts.prototype.unsubscribe = function (channelNames)
	{
		this.chatClient["unsubscribe"](channelNames.split(","));
	};
		
	Acts.prototype.publishMessage = function(channelName, content)
	{
		this.chatClient["publishMessage"](channelName, content);
	};
	
	Acts.prototype.sendPrivateMessage = function(userId, content)
	{
		this.chatClient["sendPrivateMessage"](userId, content);
	};
		
	Acts.prototype.addFriends = function(userIds)
	{
		this.chatClient["addFriends"](userIds.split(","));
	};
	
	Acts.prototype.removeFriends = function (userIds)
	{
		this.chatClient["removeFriends"](userIds.split(","));
	};

	Acts.prototype.setUserStatus = function(statusOption, status, messageOption, statusMessage)
	{
		if (statusOption == 3) {
			if (status >=0 && status <=2 ) {
				this.errorCode = 0;
				this.errorMsg = "Custom status should equal one of reserved values 0, 1, 2";
				this.runtime.trigger(cr.plugins_.PhotonChat.prototype.cnds.onError, this);
				return;
			}			
		}
		else {
			status = statusOption;
		}
		this.chatClient["setUserStatus"](status, statusMessage, messageOption == 0);
	};

	Acts.prototype.reset = function ()
	{
		this.chatClient["disconnect"]();
		this.createChatClient();
		this.chatClient["logger"]["info"]("Photon chat client reset.");
	};
	
	// ... other actions here ...
	
	pluginProto.acts = new Acts();
	
	//////////////////////////////////////
	// Expressions
	function Exps() {}

	Exps.prototype.Result = function (ret)
	{
		ret.set_int(this.result || 0);
	};
	
	Exps.prototype.ErrorCode = function (ret)
	{
		ret.set_int(this.errorCode || 0);
	};
	
	Exps.prototype.ErrorMessage = function (ret)
	{
		ret.set_string(this.errorMsg || "");
	};
	
	Exps.prototype.State = function (ret)
	{
		ret.set_int(this.chatClient["state"]);
		// ret.set_float(0.5);			// for returning floats
		// ret.set_string("Hello");		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string
	};
	
	Exps.prototype.StateString = function (ret)
	{
		ret.set_string(Photon["Chat"]["ChatClient"]["StateToName"](this.chatClient["state"]));
	};

	Exps.prototype.UserId = function (ret)
	{
		ret.set_string(this.chatClient["getUserId"]() || "");
	};

	Exps.prototype.Channel = function (ret)	
	{
		ret.set_string(this.channel);
	};
	
	Exps.prototype.Message = function (ret)	
	{
		ret.set_string(this.message);
	};
	
	Exps.prototype.Sender = function (ret)	
	{
		ret.set_string(this.sender);
	};
	
	Exps.prototype.UserStatusUserId = function (ret)	
	{
		ret.set_string(this.userStatusUserId);
	};
	
	Exps.prototype.UserStatus = function (ret)	
	{
		ret.set_int(this.userStatus);
	};
	
	Exps.prototype.UserStatusString = function (ret)	
	{
		if (this.userStatus == 0) ret.set_string("Offline");
		else if (this.userStatus == 1) ret.set_string("Invisible"); // we never receive this status
		else if (this.userStatus == 2) ret.set_string("Online"); // we never receive this status
		else if (this.userStatus == 3) ret.set_string("Away"); // we never receive this status
		else if (this.userStatus == 4) ret.set_string("Dnd"); // we never receive this status
		else if (this.userStatus == 5) ret.set_string("Lfg"); // we never receive this status
		else if (this.userStatus == 6) ret.set_string("Playing"); // we never receive this status
		else ret.set_string("Custom " + this.userStatus);
	};
	
	Exps.prototype.UserStatusMessageUpdated = function (ret)	
	{
		ret.set_int(this.userStatusMessageUpdated);
	};
	
	Exps.prototype.UserStatusMessage = function (ret)	
	{
		ret.set_string(this.userStatusMessage);
	};

	Exps.prototype.ChannelLastMessageID = function (ret, channelName)
	{
		var ch = this.chatClient["getPublicChannels"]()[channelName];
		ret.set_int(ch ? (ch.getLastId() || 0) : 0);
	};

	// ... other expressions here ...
	
	pluginProto.exps = new Exps();

}());