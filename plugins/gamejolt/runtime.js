// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
cr.plugins_.GameJolt = function(runtime) {
	this.runtime = runtime;
};

(function () {
	// NanoAjax function. By yours truly.
	function njx(address, handler/*, params*/) {
		var wnd = window, // shortcut
			request = // create request instance
			(request = wnd.ActiveXObject) ?
				new request("Microsoft.XMLHTTP")
			: (request = wnd.XMLHttpRequest) ?
				new request()
			: 0;
		if (request) { // condition works as exit if HTTP requests are not supported
			request.onreadystatechange = function() {
				if (request.readyState == 4 && handler) handler(request.responseText);
			};
			// POST/GET determination:
			//if (params) {
				request.open("POST", address, true);
				//request.setRequestHeader("X-Requested-With", "XMLHttpRequest");
				request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
			//} else request.open("GET", address, true);
			// send the request after all:
			request.send(/*params*/);
		}
		return request; // solely to be able to determine whether a request was sent at all.
	}
	//{ Md5 class from Haxe
	var cca = function(s,index) {
		var x = s.charCodeAt(index);
		if(x != x) return undefined;
		return x;
	}
	var Md5 = function() { };
	Md5.encode = function(s) { return new Md5().doEncode(s) }
	Md5.prototype = {
		doEncode: function(str) {
			var x = this.str2blks(str);
			var a = 1732584193;
			var b = -271733879;
			var c = -1732584194;
			var d = 271733878;
			var step;
			var i = 0;
			while(i < x.length) {
				var olda = a;
				var oldb = b;
				var oldc = c;
				var oldd = d;
				step = 0;
				a = this.ff(a,b,c,d,x[i],7,-680876936);
				d = this.ff(d,a,b,c,x[i + 1],12,-389564586);
				c = this.ff(c,d,a,b,x[i + 2],17,606105819);
				b = this.ff(b,c,d,a,x[i + 3],22,-1044525330);
				a = this.ff(a,b,c,d,x[i + 4],7,-176418897);
				d = this.ff(d,a,b,c,x[i + 5],12,1200080426);
				c = this.ff(c,d,a,b,x[i + 6],17,-1473231341);
				b = this.ff(b,c,d,a,x[i + 7],22,-45705983);
				a = this.ff(a,b,c,d,x[i + 8],7,1770035416);
				d = this.ff(d,a,b,c,x[i + 9],12,-1958414417);
				c = this.ff(c,d,a,b,x[i + 10],17,-42063);
				b = this.ff(b,c,d,a,x[i + 11],22,-1990404162);
				a = this.ff(a,b,c,d,x[i + 12],7,1804603682);
				d = this.ff(d,a,b,c,x[i + 13],12,-40341101);
				c = this.ff(c,d,a,b,x[i + 14],17,-1502002290);
				b = this.ff(b,c,d,a,x[i + 15],22,1236535329);
				a = this.gg(a,b,c,d,x[i + 1],5,-165796510);
				d = this.gg(d,a,b,c,x[i + 6],9,-1069501632);
				c = this.gg(c,d,a,b,x[i + 11],14,643717713);
				b = this.gg(b,c,d,a,x[i],20,-373897302);
				a = this.gg(a,b,c,d,x[i + 5],5,-701558691);
				d = this.gg(d,a,b,c,x[i + 10],9,38016083);
				c = this.gg(c,d,a,b,x[i + 15],14,-660478335);
				b = this.gg(b,c,d,a,x[i + 4],20,-405537848);
				a = this.gg(a,b,c,d,x[i + 9],5,568446438);
				d = this.gg(d,a,b,c,x[i + 14],9,-1019803690);
				c = this.gg(c,d,a,b,x[i + 3],14,-187363961);
				b = this.gg(b,c,d,a,x[i + 8],20,1163531501);
				a = this.gg(a,b,c,d,x[i + 13],5,-1444681467);
				d = this.gg(d,a,b,c,x[i + 2],9,-51403784);
				c = this.gg(c,d,a,b,x[i + 7],14,1735328473);
				b = this.gg(b,c,d,a,x[i + 12],20,-1926607734);
				a = this.hh(a,b,c,d,x[i + 5],4,-378558);
				d = this.hh(d,a,b,c,x[i + 8],11,-2022574463);
				c = this.hh(c,d,a,b,x[i + 11],16,1839030562);
				b = this.hh(b,c,d,a,x[i + 14],23,-35309556);
				a = this.hh(a,b,c,d,x[i + 1],4,-1530992060);
				d = this.hh(d,a,b,c,x[i + 4],11,1272893353);
				c = this.hh(c,d,a,b,x[i + 7],16,-155497632);
				b = this.hh(b,c,d,a,x[i + 10],23,-1094730640);
				a = this.hh(a,b,c,d,x[i + 13],4,681279174);
				d = this.hh(d,a,b,c,x[i],11,-358537222);
				c = this.hh(c,d,a,b,x[i + 3],16,-722521979);
				b = this.hh(b,c,d,a,x[i + 6],23,76029189);
				a = this.hh(a,b,c,d,x[i + 9],4,-640364487);
				d = this.hh(d,a,b,c,x[i + 12],11,-421815835);
				c = this.hh(c,d,a,b,x[i + 15],16,530742520);
				b = this.hh(b,c,d,a,x[i + 2],23,-995338651);
				a = this.ii(a,b,c,d,x[i],6,-198630844);
				d = this.ii(d,a,b,c,x[i + 7],10,1126891415);
				c = this.ii(c,d,a,b,x[i + 14],15,-1416354905);
				b = this.ii(b,c,d,a,x[i + 5],21,-57434055);
				a = this.ii(a,b,c,d,x[i + 12],6,1700485571);
				d = this.ii(d,a,b,c,x[i + 3],10,-1894986606);
				c = this.ii(c,d,a,b,x[i + 10],15,-1051523);
				b = this.ii(b,c,d,a,x[i + 1],21,-2054922799);
				a = this.ii(a,b,c,d,x[i + 8],6,1873313359);
				d = this.ii(d,a,b,c,x[i + 15],10,-30611744);
				c = this.ii(c,d,a,b,x[i + 6],15,-1560198380);
				b = this.ii(b,c,d,a,x[i + 13],21,1309151649);
				a = this.ii(a,b,c,d,x[i + 4],6,-145523070);
				d = this.ii(d,a,b,c,x[i + 11],10,-1120210379);
				c = this.ii(c,d,a,b,x[i + 2],15,718787259);
				b = this.ii(b,c,d,a,x[i + 9],21,-343485551);
				a = this.addme(a,olda);
				b = this.addme(b,oldb);
				c = this.addme(c,oldc);
				d = this.addme(d,oldd);
				i += 16;
			}
			return this.rhex(a) + this.rhex(b) + this.rhex(c) + this.rhex(d);
		}
		,ii: function(a,b,c,d,x,s,t) {
			return this.cmn(this.bitXOR(c,this.bitOR(b,~d)),a,b,x,s,t);
		}
		,hh: function(a,b,c,d,x,s,t) {
			return this.cmn(this.bitXOR(this.bitXOR(b,c),d),a,b,x,s,t);
		}
		,gg: function(a,b,c,d,x,s,t) {
			return this.cmn(this.bitOR(this.bitAND(b,d),this.bitAND(c,~d)),a,b,x,s,t);
		}
		,ff: function(a,b,c,d,x,s,t) {
			return this.cmn(this.bitOR(this.bitAND(b,c),this.bitAND(~b,d)),a,b,x,s,t);
		}
		,cmn: function(q,a,b,x,s,t) {
			return this.addme(this.rol(this.addme(this.addme(a,q),this.addme(x,t)),s),b);
		}
		,rol: function(num,cnt) {
			return num << cnt | num >>> 32 - cnt;
		}
		,str2blks: function(str) {
			var nblk = (str.length + 8 >> 6) + 1;
			var blks = new Array();
			var _g1 = 0, _g = nblk * 16;
			while(_g1 < _g) {
				var i = _g1++;
				blks[i] = 0;
			}
			var i = 0;
			while(i < str.length) {
				blks[i >> 2] |= cca(str,i) << (str.length * 8 + i) % 4 * 8;
				i++;
			}
			blks[i >> 2] |= 128 << (str.length * 8 + i) % 4 * 8;
			var l = str.length * 8;
			var k = nblk * 16 - 2;
			blks[k] = l & 255;
			blks[k] |= (l >>> 8 & 255) << 8;
			blks[k] |= (l >>> 16 & 255) << 16;
			blks[k] |= (l >>> 24 & 255) << 24;
			return blks;
		}
		,rhex: function(num) {
			var str = "";
			var hex_chr = "0123456789abcdef";
			var _g = 0;
			while(_g < 4) {
				var j = _g++;
				str += hex_chr.charAt(num >> j * 8 + 4 & 15) + hex_chr.charAt(num >> j * 8 & 15);
			}
			return str;
		}
		,addme: function(x,y) {
			var lsw = (x & 65535) + (y & 65535);
			var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
			return msw << 16 | lsw & 65535;
		}
		,bitAND: function(a,b) {
			var lsb = a & 1 & (b & 1);
			var msb31 = a >>> 1 & b >>> 1;
			return msb31 << 1 | lsb;
		}
		,bitXOR: function(a,b) {
			var lsb = a & 1 ^ b & 1;
			var msb31 = a >>> 1 ^ b >>> 1;
			return msb31 << 1 | lsb;
		}
		,bitOR: function(a,b) {
			var lsb = a & 1 | b & 1;
			var msb31 = a >>> 1 | b >>> 1;
			return msb31 << 1 | lsb;
		}
	}
	//}
	//
	var gameId, privateKey, userName = null, userToken = null, loggedIn = false,
		gjRt, gjInst, gj = { }, gjLog = false, tabActive = true;
	//
	function Conditions() {};
	var cnds = Conditions.prototype;
	// Trophy variables:
	var trophyId = 0, trophyTitle = "", trophyDescription = "", trophyDifficulty = "", trophyImage = "", trophyAchieved = "";
	// Score variables:
	var scoreTable = 0, scoreCount = 0, scorePlace = 0, scoreLocal = 0;
	var scoreName = "", scoreId = 0, scoreText = 0, scoreValue = 0, scoreExtra = "", scoreTime = "";
	// Store variables:
	var storeKey = "", storeValue = "", storeLocal = 0;
	// Ensures that we don't break URLs.
	function wrap(value) { return encodeURIComponent(value.toString()) }
	//
	// Forms a URL from needed parameters.
	function compile(adr, par, sign, fmt) {
		var url = "http://gamejolt.com/api/game/v1" + adr + "?game_id=" + gameId;
		url += "&format=" + (fmt || "dump");
		if (par) url += par;
		if (sign && userToken) url += "&username=" + encodeURIComponent(userName)
			+ "&user_token=" + encodeURIComponent(userToken);
		url += "&signature=" + Md5.encode(url + privateKey);
		//
		if (gjLog) console.log(url);
		return url;
	}
	// generic request function
	function request(url, par, hdl, sign, fmt) {
		njx(compile(url, par, sign, fmt), hdl);
	}
	// signed request
	function srequest(url, par, hdl, fmt) {
		njx(compile(url, par, true, fmt), hdl);
	}
	// unsigned request
	function urequest(url, par, hdl, fmt) {
		njx(compile(url, par, false, fmt), hdl);
	}
	// 
	var keypairIdent = (function() {
		var r = "_", i, n;
		for (i = "0".charCodeAt(), n = "9".charCodeAt(); i <= n; i++) r += String.fromCharCode(i);
		for (i = "A".charCodeAt(), n = "Z".charCodeAt(); i <= n; i++) r += String.fromCharCode(i);
		for (i = "a".charCodeAt(), n = "z".charCodeAt(); i <= n; i++) r += String.fromCharCode(i);
		return r;
	})();
	var keypairSpace = "\r\n\t ";
	// allows iterating through key-value pairs in `keypair` format
	function parseKeypairs(text, handler/*:function(key, value)*/) {
		var p = -1, l = text.length, q, c, o, key, value, done;
		//
		while (++p < l) {
			while (p < l && keypairSpace.indexOf(c = text.charAt(p)) >= 0) p++;
			if (p >= l) break;
			if (keypairIdent.indexOf(c) < 0) break;
			q = p;
			while (p < l && keypairIdent.indexOf(c = text.charAt(p)) >= 0) p++;
			key = text.substring(q, p);
			while (p < l && keypairSpace.indexOf(c = text.charAt(p)) >= 0) p++;
			if (c != ":") break;
			p++;
			while (p < l && keypairSpace.indexOf(c = text.charAt(p)) >= 0) p++;
			if (c == "\"" || c == "'") {
				o = c;
				value = "";
				done = false;
				while ((p < l) && !done) switch (c = text.charAt(++p)) {
					case "\\": switch (c = text.charAt(++p)) {
						case "n": value += "\n"; break;
						case "r": value += "\r"; break;
						case "\\": value += "\\"; break;
						default:
							value += "\\" + c;
						} break
					default:
						if (o == c) {
							done = true;
						} else value += c;
				}
				handler(key, value);
			} else break;
		}
	}
	//
	function gjOnSuspend(suspended) {
		tabActive = !suspended;
	}
	//{ User
	gj.auth = function(name, token) {
		userName = name;
		loggedIn = false;
		if (userToken = token) srequest("/users/auth/", "", function(_) {
			loggedIn = (_.indexOf("SUCCESS") == 0);
			if (loggedIn) {
				gjRt.trigger(cnds.OnLogin, gjInst);
			} else userToken = null;
		});
	};
	//}
	//{ Session
	gj.sessionGoing = false;
	gj.sessionPing = function() {
		srequest("/sessions/ping/",
			"&status=" + (gj.sessionStatus || (tabActive ? "active" : "idle")));
	}
	gj.sessionOpen = function() {
		if (!gj.sessionGoing) {
			gj.sessionGoing = true;
			srequest("/sessions/open/");
			gj.sessionTimer = setInterval(gj.sessionPing, 30000);
		}
	};
	gj.sessionClose = function() {
		if (gj.sessionGoing) {
			gj.sessionGoing = false;
			clearInterval(gj.sessionTimer);
			srequest("/sessions/close/");
		}
	};
	//}
	//{ Trophy
	gj.trophyAdd = function(id) {
		srequest("/trophies/add-achieved/", "&trophy_id=" + id, function(_) {
			trophyId = id;
			trophyAchieved = (_.indexOf("SUCCESS") == 0) ? "just now" : "";
			gjRt.trigger(cnds.OnTrophy, gjInst);
		});
	};
	gj.trophyFetch = function(ids, filter) {
		var r = "";
		if (ids) r += "&trophy_id=" + wrap(ids);
		switch (filter) {
		case 1: r += "&achieved=true"; break
		case 2: r += "&achieved=false"; break
		}
		srequest("/trophies/", r, function(data) {
			var trophies = [], trophy = null;
			parseKeypairs(data, function(k, v) {
				switch (k) {
				case "id": trophies.push(trophy = { id: parseInt(v) }); break
				case "title": trophy.title = v; break;
				case "description": trophy.desc = v; break;
				case "difficulty": trophy.diff = v; break;
				case "image_url": trophy.url = v; break;
				case "achieved": trophy.achieved = (v != "false") ? v : ""; break;
				}
			});
			for (var i = 0, n = trophies.length; i < n; i++) {
				trophy = trophies[i];
				trophyId = trophy.id;
				trophyTitle = trophy.title;
				trophyDescription = trophy.desc;
				trophyDifficulty = trophy.diff;
				trophyImage = trophy.url;
				trophyAchieved = trophy.achieved;
				gjRt.trigger(cnds.OnTrophyData, gjInst);
			}
		}, "keypair");
	}
	//}
	//{ Scores
	// scoreAdd(value, score, ?table_id, ?extra_data)
	gj.scoreAdd = function(v, s, t, x) {
		var r = "&score=" + wrap(s || v)
			+ "&sort=" + wrap(v);
		if (t) r += "&table_id=" + t;
		if (x) r += "&extra_data=" + wrap(x);
		if (!userToken) r += "&guest=" + wrap(userName || "Guest");
		request("/scores/add/", r, function(_) {
			if (_.indexOf("SUCCESS") == 0) {
				scoreTable = t;
				scoreExtra = x;
				scoreValue = v;
				scoreText = s;
				scorePlace = 0;
				scoreTime = "just now";
				scoreName = userName;
				scoreId = 0;
				gjRt.trigger(cnds.OnScore, gjInst);
			}
		}, !!userToken);
	}
	// scoreGet(?table_id, ?limit, ?local)
	gj.scoreGet = function(t, m, o) {
		var r = "";
		if (t) r += "&table_id=" + t;
		if (m) r += "&limit=" + m;
		request("/scores/", r, function(data) {
			var entries = [], entry = null;
			parseKeypairs(data, function(k, v) {
				switch (k) {
				case 'score':
					entries.push(entry = { });
					entry.scoreText = v;
					break;
				case 'sort': entry.score = parseFloat(v); break;
				case 'extra_data': entry.extraData = v; break;
				case 'user': entry.name = v; break;
				case 'user_id': entry.id = parseInt(v); break;
				case 'guest':
					if (v != '') {
						entry.name = v;
						entry.id = -1;
					} break;
				case 'stored': entry.stored = v; break;
				}
			});
			scoreTable = t;
			scoreLocal = o;
			scoreCount = entries.length;
			gjRt.trigger(cnds.OnScoreStart, gjInst);
			for (var i = 0, n = scoreCount; i < n; i++) {
				entry = entries[i];
				scorePlace = i + 1;
				scoreName = entry.name;
				scoreId = entry.id;
				scoreText = entry.scoreText;
				scoreValue = entry.score;
				scoreExtra = entry.extraData;
				scoreTime = entry.stored;
				gjRt.trigger(cnds.OnScoreItem, gjInst);
			}
			gjRt.trigger(cnds.OnScoreEnd, gjInst);
			scoreCount = 0;
		}, o, "keypair");
	};
	//}
	//{ Store
	gj.storeGet = function(key, local) {
		request("/data-store/", "&key=" + wrap(key), function(data) {
			if (data.indexOf("SUCCESS") == 0) {
				data = data.substr(data.charAt(7) == "\r" ? 9 : 8);
			} else data = "";
			//
			storeKey = key;
			storeValue = data;
			storeLocal = local ? 1 : 0;
			gjRt.trigger(cnds.OnStoreGet, gjInst);
		}, local);
	}
	gj.storeSet = function(key, value, local) {
		request("/data-store/set/", "&key=" + wrap(key) + "&data=" + wrap(value), function(data) {
			if (data.indexOf("SUCCESS") == 0) {
				storeValue = value;
			} else storeValue = "";
			//
			storeKey = key;
			storeLocal = local ? 1 : 0;
			gjRt.trigger(cnds.OnStoreSet, gjInst);
		}, local);
	}
	gj.storeUpdate = function(key, operation, value, local) {
		request("/data-store/update/",
		"&key=" + wrap(key) + "&value=" + wrap(value) + "&operation=" + wrap(operation),
		function(data) {
			if (data.indexOf("SUCCESS") == 0) {
				data = data.substr(data.charAt(7) == "\r" ? 9 : 8);
			} else data = "";
			//
			storeKey = key;
			storeValue = data;
			storeLocal = local ? 1 : 0;
			gjRt.trigger(cnds.OnStoreUpdate, gjInst);
		}, local);
	}
	gj.storeRemove = function(key, local) {
		request("/data-store/remove/", "&key=" + wrap(key), function(data) {
			if (data.indexOf("SUCCESS") == 0) {
				storeValue = "";
			} else storeValue = "false";
			//
			storeKey = key;
			storeLocal = local ? 1 : 0;
			gjRt.trigger(cnds.OnStoreRemove, gjInst);
		}, local);
	}
	//}
	/////////////////////////////////////
	// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
	//                            vvvvvvvv
	var pluginProto = cr.plugins_.GameJolt.prototype;
		
	/////////////////////////////////////
	// Object type class
	pluginProto.Type = function(plugin) {
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};

	var typeProto = pluginProto.Type.prototype;

	// called on startup for each object type
	typeProto.onCreate = function() {
	};

	/////////////////////////////////////
	// Instance class
	pluginProto.Instance = function(type) {
		this.type = type;
		this.runtime = type.runtime;
		//
		gjRt = this.runtime;
		gjInst = this;
	};
	
	var instanceProto = pluginProto.Instance.prototype;

	// called whenever an instance is created
	instanceProto.onCreate = function() {
		// note the object is sealed after this call; ensure any properties you'll ever need are set on the object
		// e.g...
		// this.myValue = 0;
		gameId = this.properties[0];
		privateKey = this.properties[1];
		gjLog = this.properties[2] != 0;
		var argv = document.location.href,
			argl, args, i, l, p, k, v;
		argv = argv.substr(argv.indexOf("?") + 1);
		argl = argv.split("&");
		args = { };
		l = argl.length;
		for (i = 0; i < l; i++) {
			p = argl[i].indexOf("=");
			if (p >= 0) {
				k = argl[i].substr(0, p);
				v = argl[i].substr(p + 1);
				args[k] = v;
			}
		}
		if (gjLog) console.log(args);
		// auto-auth:
		if (args["gjapi_username"] && args["gjapi_token"]) {
			gj.auth(args["gjapi_username"], args["gjapi_token"]);
		}
		//
		this.runtime.addSuspendCallback(gjOnSuspend);
	};
	
	instanceProto.onLayoutChange = function () {
		if (userToken) gjRt.trigger(cr.plugins_.GameJolt.prototype.cnds.OnLogin, gjInst);
	};
	//{
	// called whenever an instance is destroyed
	// note the runtime may keep the object after this call for recycling; be sure
	// to release/recycle/reset any references to other objects in this function.
	instanceProto.onDestroy = function () {
	};
	
	// called when saving the full state of the game
	instanceProto.saveToJSON = function () {
		// return a Javascript object containing information about your object's state
		// note you MUST use double-quote syntax (e.g. "property": value) to prevent
		// Closure Compiler renaming and breaking the save format
		return {
			// e.g.
			//"myValue": this.myValue
		};
	};
	
	// called when loading the full state of the game
	instanceProto.loadFromJSON = function (o) {
		// load from the state previously saved by saveToJSON
		// 'o' provides the same object that you saved, e.g.
		// this.myValue = o["myValue"];
		// note you MUST use double-quote syntax (e.g. o["property"]) to prevent
		// Closure Compiler renaming and breaking the save format
	};
	
	// only called if a layout object - draw to a canvas 2D context
	instanceProto.draw = function(ctx) {
	};
	
	// only called if a layout object in WebGL mode - draw to the WebGL context
	// 'glw' is not a WebGL context, it's a wrapper - you can find its methods in GLWrap.js in the install
	// directory or just copy what other plugins do.
	instanceProto.drawGL = function (glw) {
	};
	
	// The comments around these functions ensure they are removed when exporting, since the
	// debugger code is no longer relevant after publishing.
	/**BEGIN-PREVIEWONLY**/
	instanceProto.getDebuggerValues = function (propsections) {
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
	
	instanceProto.onDebugValueEdited = function (header, name, value) {
		// Called when a non-readonly property has been edited in the debugger. Usually you only
		// will need 'name' (the property name) and 'value', but you can also use 'header' (the
		// header title for the section) to distinguish properties with the same name.
		if (name === "My property")
			this.myProperty = value;
	};
	/**END-PREVIEWONLY**/
	//}
	
	//{ Conditions
	// (moved prototype declaration upwards)
	cnds.IsLoggedIn = function() {
		return loggedIn;
	}
	function rtt() { return function trigger() { return true } }
	// Triggers:
	cnds.OnLogin = rtt();
	cnds.OnScore = rtt();
	cnds.OnScoreStart = rtt();
	cnds.OnScoreItem = rtt();
	cnds.OnScoreEnd = rtt();
	//
	cnds.OnStoreGet = rtt();
	cnds.OnStoreSet = rtt();
	cnds.OnStoreUpdate = rtt();
	cnds.OnStoreRemove = rtt();
	//
	cnds.OnTrophy = rtt();
	cnds.OnTrophyData = rtt();
	//
	pluginProto.cnds = new Conditions();
	//}
	
	//{ Actions
	function Actions() {};
	var acts = Actions.prototype;
	//
	acts.UserAuth = function(name, token) { gj.auth(name, token); };
	acts.UserGuest = function(name) { gj.auth(name); }
	//
	acts.SessionOpen = function() { gj.sessionOpen(); }
	acts.SessionClose = function() { gj.sessionClose(); }
	acts.SessionStatus = function(_) { gj.sessionStatus = _; }
	//
	acts.TrophyAchieve = function(_) { gj.trophyAdd(_); }
	acts.TrophyFetch = function(id, a) { gj.trophyFetch(id, a); }
	//
	acts.ScoreAdd = function(v, s, t, x) { gj.scoreAdd(v, s, t, x); }
	acts.ScoreGet = function(t, m) { gj.scoreGet(t, m, false) }
	acts.ScoreGetLocal = function(t, m) { gj.scoreGet(t, m, true) }
	//
	acts.StoreGetGlobal = function(k) { gj.storeGet(k, false) }
	acts.StoreGetLocal = function(k) { gj.storeGet(k, true) }
	acts.StoreSetGlobal = function(k, v) { gj.storeSet(k, v, false) }
	acts.StoreSetLocal = function(k, v) { gj.storeSet(k, v, true) }
	acts.StoreUpdateGlobal = function(k, o, v) { gj.storeUpdate(k, o, v, false) }
	acts.StoreUpdateLocal = function(k, o, v) { gj.storeUpdate(k, o, v, true) }
	acts.StoreRemoveGlobal = function(k) { gj.storeRemove(k, false) }
	acts.StoreRemoveLocal = function(k) { gj.storeRemove(k, true) }
	//
	pluginProto.acts = new Actions();
	//}
	
	//{ Expressions
	function Expressions() {};
	var exps = Expressions.prototype;
	exps.Username = function(r) { r.set_string(userName) }
	//
	exps.TrophyId = function(r) { r.set_int(trophyId) }
	exps.TrophyTitle = function(r) { r.set_string(trophyTitle) }
	exps.TrophyDescription = function(r) { r.set_string(trophyDescription) }
	exps.TrophyDifficulty = function(r) { r.set_string(trophyDifficulty) }
	exps.TrophyImageURL = function(r) { r.set_string(trophyImage) }
	exps.TrophyAchieved = function(r) { r.set_string(trophyAchieved) }
	//
	exps.ScorePlace = function(r) { r.set_int(scorePlace) }
	exps.ScoreCount = function(r) { r.set_int(scoreCount) }
	exps.ScoreUserName = function(r) { r.set_string(scoreName) }
	exps.ScoreUserId = function(r) { r.set_int(scoreId) }
	exps.ScoreText = function(r) { r.set_string(scoreText) }
	exps.ScoreValue = function(r) { r.set_float(scoreValue) }
	exps.ScoreExtraData = function(r) { r.set_string(scoreExtra) }
	exps.ScoreTime = function(r) { r.set_string(scoreTime) }
	exps.ScoreTable = function(r) { r.set_float(scoreTable) }
	exps.ScoreLocal = function(r) { r.set_float(scoreLocal) }
	//
	exps.StoreKey = function(r) { r.set_string(storeKey) }
	exps.StoreValue = function(r) { r.set_string(storeValue) }
	exps.StoreLocal = function(r) { r.set_float(storeLocal) }
	//
	pluginProto.exps = new Expressions();
	//}

}());