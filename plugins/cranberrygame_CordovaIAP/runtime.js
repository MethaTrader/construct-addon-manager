// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/*
//cranberrygame start: structure
cr.plugins_.cranberrygame_CordovaIAP = function(runtime)
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
cr.plugins_.cranberrygame_CordovaIAP = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{

//cranberry start
	/////////////////////////////////////
	// Store definitions
	
	/* interface:
	function Store()
	{
		this.onpurchasesuccess = null;
		this.onpurchasefail = null;
		
		this.onconsumesuccess = null;
		this.onconsumefail = null;
		
		this.onstorelistingsuccess = null;
		this.onstorelistingfail = null;
		
//cranberrygame start
		this.onrestorepurchasessuccess = null;
		this.onrestorepurchasesfail = null;
//cranberrygame start
		
		this.product_id_list = [];
	};
	
	Store.prototype.isAvailable = function () {};
	Store.prototype.supportsConsumables = function () {};
	Store.prototype.addProductIds = function (ids) {};
	Store.prototype.isTrial = function () {};
	Store.prototype.isLicensed = function () {};
	Store.prototype.hasProduct = function (product_) {};
	Store.prototype.purchaseApp = function () {};
	Store.prototype.purchaseProduct = function (product_) {};
	Store.prototype.consumeProduct = function (product_) {}; //cranberrygame
	Store.prototype.restorePurchases = function (tag) {}; //cranberrygame
	Store.prototype.requestStoreListing = function () {};
	Store.prototype.getAppName = function () {};
	Store.prototype.getAppFormattedPrice = function () {};
	Store.prototype.getProductName = function (product_) {};
	Store.prototype.getProductFormattedPrice = function (product_) {};
	*/

	//////////////////////////////////////
	// Android store
	function AndroidStore(androidApplicationLicenseKey)
	{
		this.onpurchasesuccess = null;
		this.onpurchasefail = null;
		
		this.onconsumesuccess = null;
		this.onconsumefail = null;
		
		this.onstorelistingsuccess = null;
		this.onstorelistingfail = null;

//cranberrygame start
		this.onrestorepurchasessuccess = null;
		this.onrestorepurchasesfail = null;
//cranberrygame start
		
		this.product_id_list = [];
		
		this.existing_purchases = [];
		
		this.product_info = {};		// map product id to info

		this.androidApplicationLicenseKey = androidApplicationLicenseKey;//cranberrygame
		
		this.initialized = false; //cranberrygame		
		
		window['iap']['setUp'](this.androidApplicationLicenseKey);		
	};
	
	AndroidStore.prototype.isAvailable = function ()
	{
		return true;
	};
	
	AndroidStore.prototype.supportsConsumables = function ()
	{
		return false;
	};
	
	AndroidStore.prototype.addProductIds = function (idstring)
	{
//cranberrygame start	
/*	
		if (idstring.indexOf(",") === -1)
			this.product_id_list.push(idstring);
		else
			this.product_id_list.push.apply(this.product_id_list, idstring.split(","));
*/
		if (idstring.indexOf(",") === -1) {
			if (this.product_id_list.indexOf(idstring) == -1)
				this.product_id_list.push(idstring);
		}
		else {
			var arr = idstring.split(",");
			for (var i = 0 ; i < arr.length ; i++) {
				
				if (this.product_id_list.indexOf(arr[i]) == -1)
					this.product_id_list.push(arr[i]);				
			}
		}
//cranberrygame end			
	};
	
	AndroidStore.prototype.isTrial = function ()
	{
		return !this.isLicensed();
	};
	
	AndroidStore.prototype.isLicensed = function ()
	{
		return this.hasProduct("app");
	};
	
	AndroidStore.prototype.hasProduct = function (product_)
	{
		return this.existing_purchases.indexOf(product_) !== -1;
	};
	
	AndroidStore.prototype.purchaseApp = function ()
	{
		this.purchaseProduct("app");
	};

	AndroidStore.prototype.purchaseProduct = function (product_)
	{
		if (!this.isAvailable())
			return;
		
		var self = this;
		//https://github.com/Wizcorp/phonegap-plugin-wizPurchase/blob/46f32fdf0be4f9c5837fe873efe5d06bf70c6819/www/phonegap/plugin/wizPurchasePlugin/wizPurchasePlugin.js
		//https://github.com/Wizcorp/phonegap-plugin-wizPurchase/tree/46f32fdf0be4f9c5837fe873efe5d06bf70c6819
		window['iap']['purchaseProduct'](product_, function (result)
		{
			// on success
			if (self.existing_purchases.indexOf(product_) === -1)
				self.existing_purchases.push(product_);
			
			if (self.onpurchasesuccess)
				self.onpurchasesuccess(product_);
			
		}, 
		function (error)
		{
			// on error
			if (self.onpurchasefail)
				self.onpurchasefail(product_, error);
		});
	};
	
	AndroidStore.prototype.consumeProduct = function (product_)
	{
		if (!this.isAvailable())
			return;
		
		var self = this;	
		//alert("debug consumeProduct0: "+JSON.stringify(product_));
		var product_id_list = [];
		if (product_.indexOf(",") === -1)
			product_id_list.push(product_);
		else
			product_id_list.push.apply(product_id_list, product_.split(","));		
		window['iap']['consumeProduct'](product_id_list, function (result)
		{
			//alert("debug consumeProduct1: "+JSON.stringify(result));
		
			for (var i = 0 ; i < product_id_list.length ; i++) {
				if (self.existing_purchases.indexOf(product_id_list[i]) !== -1)
					self.existing_purchases.splice(self.existing_purchases.indexOf(product_id_list[i]),1);				
			}
	
			if (self.onconsumesuccess)
				self.onconsumesuccess(product_);			
		}, 
		function (error)
		{
			//alert("debug consumeProduct2: "+JSON.stringify(error));
			if (self.onconsumefail)
				self.onconsumefail(product_, error);
		});
		//alert("debug consumeProduct3");
	};
	
	AndroidStore.prototype.restorePurchases = function (tag)
	{
		if (!this.isAvailable())
			return;

		var self = this;

		//alert("debug restorePurchases0");
		window['iap']["restorePurchases"](function (result)
		{
			//alert("debug restorePurchases1: "+JSON.stringify(result));	
		
			// on success
			for (var i = 0 ; i < result.length; ++i)
			{
				var p = result[i];				
				//alert("debug restorePurchases2: "+JSON.stringify(p));		
			
				if (self.existing_purchases.indexOf(p['productId']) === -1)
					self.existing_purchases.push(p['productId']);
			}
			
			if (self.onrestorepurchasessuccess)
				self.onrestorepurchasessuccess(tag);			
		}, 
		function (error)
		{
			//alert("debug restorePurchases3: "+JSON.stringify(error));
			
			if (self.onrestorepurchasesfail)
				self.onrestorepurchasesfail(tag);
		});
		//alert("debug restorePurchases4");
	};

	AndroidStore.prototype.requestStoreListing = function ()
	{
		var self = this;
		
		window['iap']["requestStoreListing"](self.product_id_list, function (result)
		{
/*
[
    {
        "productId": "sword001",
        "title": "Sword of Truths",
        "price": "Formatted price of the item, including its currency sign.",
        "description": "Very pointy sword. Sword knows if you are lying, so don't lie."
    },
    {
        "productId": "shield001",
        "title": "Shield of Peanuts",
        "price": "Formatted price of the item, including its currency sign.",
        "description": "A shield made entirely of peanuts."
    }
]
*/
			//alert("debug requestStoreListing1: "+JSON.stringify(result));//debug for Caleb
			
			for (var i = 0 ; i < result.length; ++i)
			{
				var p = result[i];
				//alert("debug requestStoreListing2: "+JSON.stringify(p));	
				
				self.product_info[p["productId"]] = { title: p["title"], price: p["price"] };	
			}
			
			if (self.onstorelistingsuccess)
				self.onstorelistingsuccess();
		}, function (error)
		{
			//alert("debug requestStoreListing3: "+JSON.stringify(error));
			if (self.onstorelistingfail)
				self.onstorelistingfail();
		});
		//alert("debug requestStoreListing4");		
	};
	
	AndroidStore.prototype.getAppName = function ()
	{
		return this.getProductName("app");
	};
	
	AndroidStore.prototype.getAppFormattedPrice = function ()
	{
		return this.getProductFormattedPrice("app");
	};
	
	AndroidStore.prototype.getProductName = function (product_)
	{
		if (this.product_info.hasOwnProperty(product_))
			return this.product_info[product_].title;
		else
			return "";
	};
	
	AndroidStore.prototype.getProductFormattedPrice = function (product_)
	{
		// may not be immediately available in onstorelistingsuccess...
		if (this.product_info.hasOwnProperty(product_))
			return this.product_info[product_].price.toString();
		else
			return "";
	};

	
	//////////////////////////////////////
	// WP8 store
	function WP8Store()
	{
		this.onpurchasesuccess = null;
		this.onpurchasefail = null;
		
		this.onconsumesuccess = null;
		this.onconsumefail = null;
		
		this.onstorelistingsuccess = null;
		this.onstorelistingfail = null;
		
//cranberrygame start
		this.onrestorepurchasessuccess = null;
		this.onrestorepurchasesfail = null;
//cranberrygame start
		
		this.product_id_list = [];
		
		this.existing_purchases = [];
		
		this.product_info = {};		// map product id to info
		
		InAppPurchaseManager["init"](function (result)
		{
		}, function (error)
		{
		} , {showLog:true});		
	};
	
	WP8Store.prototype.isAvailable = function ()
	{
		return true;
	};
	
	WP8Store.prototype.supportsConsumables = function ()
	{
		return false;
	};
	
	WP8Store.prototype.addProductIds = function (idstring)
	{
//cranberrygame start	
/*	
		if (idstring.indexOf(",") === -1)
			this.product_id_list.push(idstring);
		else
			this.product_id_list.push.apply(this.product_id_list, idstring.split(","));
*/
		if (idstring.indexOf(",") === -1) {
			if (this.product_id_list.indexOf(idstring) == -1)
				this.product_id_list.push(idstring);
		}
		else {
			var arr = idstring.split(",");
			for (var i = 0 ; i < arr.length ; i++) {
				
				if (this.product_id_list.indexOf(arr[i]) == -1)
					this.product_id_list.push(arr[i]);				
			}
		}
//cranberrygame end			
	};
	
	WP8Store.prototype.isTrial = function ()
	{
		return !this.isLicensed();
	};
	
	WP8Store.prototype.isLicensed = function ()
	{
		return this.hasProduct("app");
	};
	
	WP8Store.prototype.hasProduct = function (product_)
	{
		return this.existing_purchases.indexOf(product_) !== -1;
	};
	
	WP8Store.prototype.purchaseApp = function ()
	{
		this.purchaseProduct("app");
	};
	
	WP8Store.prototype.purchaseProduct = function (product_)
	{
		if (!this.isAvailable())
			return;
		
		var self = this;
		
		InAppPurchaseManager["buy"](function (result)
		{
			// on success
			if (self.existing_purchases.indexOf(product_) === -1)
				self.existing_purchases.push(product_);
			
			if (self.onpurchasesuccess)
				self.onpurchasesuccess(product_);
			
		}, function (error)
		{
			// on error
			if (self.onpurchasefail)
				self.onpurchasefail(product_, error);
		} , product_);
	};
	
	WP8Store.prototype.consumeProduct = function (product_)
	{
	}
	
	WP8Store.prototype.restorePurchases = function (tag)
	{
		if (!this.isAvailable())
			return;
		
		InAppPurchaseManager["getPurchases"](function (result)
		{
			// on success
			var i, len, p;
			for (i = 0, len = result.length; i < len; ++i)
			{
				p = result[i]["productId"];
				
				if (self.existing_purchases.indexOf(p) === -1)
					self.existing_purchases.push(p);
			}
			
			if (self.onrestorepurchasessuccess)
				self.onrestorepurchasessuccess(tag);
		}, function (error)
		{
			// on error
			
			if (self.onrestorepurchasesfail)
				self.onrestorepurchasesfail(tag);
		});
	};

	WP8Store.prototype.requestStoreListing = function ()
	{
		var self = this;
		
		InAppPurchaseManager["getProductDetails"](function (result)
		{

			var i, len, p;
			for (i = 0, len = result.length; i < len; ++i)
			{
				p = result[i];
				self.product_info[p["productId"]] = { title: p["title"], price: p["price"] };
			}
			
			if (self.onstorelistingsuccess)
				self.onstorelistingsuccess();
			
		}, function (error)
		{
			if (self.onstorelistingfail)
				self.onstorelistingfail();
		}, this.product_id_list);
	};
	
	WP8Store.prototype.getAppName = function ()
	{
		return this.getProductName("app");
	};
	
	WP8Store.prototype.getAppFormattedPrice = function ()
	{
		return this.getProductFormattedPrice("app");
	};
	
	WP8Store.prototype.getProductName = function (product_)
	{
		if (this.product_info.hasOwnProperty(product_))
			return this.product_info[product_].title;
		else
			return "";
	};
	
	WP8Store.prototype.getProductFormattedPrice = function (product_)
	{
		// may not be immediately available in onstorelistingsuccess...
		if (this.product_info.hasOwnProperty(product_))
			return this.product_info[product_].price.toString();
		else
			return "";
	};	
//cranberry end

	/////////////////////////////////////
	// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
	//                            vvvvvvvv
	var pluginProto = cr.plugins_.cranberrygame_CordovaIAP.prototype;
		
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
	var curTag = "";
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
			self.runtime.trigger(cr.plugins_.cranberrygame_CordovaIAP.prototype.cnds.TriggerCondition, self);
		});
*/
//cranberrygame start
		if (!(this.runtime.isAndroid || this.runtime.isiOS || this.runtime.isWindowsPhone8 || this.runtime.isWindowsPhone81))
			return;			
		if (typeof window['iap'] == 'undefined')
            return;
			
		this.androidApplicationLicenseKey = this.properties[0];

		if (this.runtime.isAndroid && this.androidApplicationLicenseKey == '')
			return;			
			
		this.store = null;
		
		this.productId = "";
		this.errorMessage = "";

		if (this.runtime.isAndroid || this.runtime.isiOS)
		{
			this.store = new AndroidStore(this.androidApplicationLicenseKey);
		}
		else if (this.runtime.isiOS)
		{
			this.store = new AndroidStore(this.androidApplicationLicenseKey);
		}
		else if (this.runtime.isWindowsPhone8 || this.runtime.isWindowsPhone81)
		{
			this.store = new AndroidStore(this.androidApplicationLicenseKey);
		}
		
		var self = this;
		
		if (this.store)
		{
			this.store.onpurchasesuccess = function (product_)
			{
				self.productId = product_;
				self.errorMessage = "";
				self.runtime.trigger(cr.plugins_.cranberrygame_CordovaIAP.prototype.cnds.OnPurchaseProductSucceeded, self);
				self.runtime.trigger(cr.plugins_.cranberrygame_CordovaIAP.prototype.cnds.OnAnyPurchaseProductSucceeded, self);
			};
			
			this.store.onpurchasefail = function (product_, error_)
			{
				self.productId = product_;
				self.errorMessage = error_;
				self.runtime.trigger(cr.plugins_.cranberrygame_CordovaIAP.prototype.cnds.OnPurchaseProductFailed, self);
				self.runtime.trigger(cr.plugins_.cranberrygame_CordovaIAP.prototype.cnds.OnAnyPurchaseProductFailed, self);
			};
			
//cranberrygame start
			this.store.onconsumesuccess = function (product_)
			{
				self.productId = product_;
				self.errorMessage = "";
				self.runtime.trigger(cr.plugins_.cranberrygame_CordovaIAP.prototype.cnds.OnConsumeProductSucceeded, self);
			};
			
			this.store.onconsumefail = function (product_, error_)
			{
				self.productId = product_;
				self.errorMessage = error_;
				self.runtime.trigger(cr.plugins_.cranberrygame_CordovaIAP.prototype.cnds.OnConsumeProductFailed, self);
			};
//cranberrygame end
			
			this.store.onstorelistingsuccess = function ()
			{
				self.runtime.trigger(cr.plugins_.cranberrygame_CordovaIAP.prototype.cnds.OnRequestStoreListingSucceeded, self);
			};
			
			this.store.onstorelistingfail = function ()
			{
				self.runtime.trigger(cr.plugins_.cranberrygame_CordovaIAP.prototype.cnds.OnRequestStoreListingFailed, self);
			};
//cranberrygame start
			this.store.onrestorepurchasessuccess = function (tag)
			{
				curTag = tag;
				self.runtime.trigger(cr.plugins_.cranberrygame_CordovaIAP.prototype.cnds.OnRestorePurchasesSucceeded, self);
			};
			
			this.store.onrestorepurchasesfail = function (tag)
			{
				curTag = tag;
				self.runtime.trigger(cr.plugins_.cranberrygame_CordovaIAP.prototype.cnds.OnRestorePurchasesFailed, self);
			};
//cranberrygame end			
		}
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
	Cnds.prototype.OnPurchaseProductSucceeded = function (product_)
	{
		return product_ === this.productId;
	};
	
	Cnds.prototype.OnAnyPurchaseProductSucceeded = function ()
	{
		return true;
	};
	
	Cnds.prototype.OnPurchaseProductFailed = function (product_)
	{
		return product_ === this.productId;
	};
	
	Cnds.prototype.OnAnyPurchaseProductFailed = function ()
	{
		return true;
	};
//cranberrygame start
	Cnds.prototype.OnConsumeProductSucceeded = function (product_)
	{
		return product_ === this.productId;
	};
	Cnds.prototype.OnConsumeProductFailed = function (product_)
	{
		return product_ === this.productId;
	};	
//cranberrygame end	
	Cnds.prototype.OnRequestStoreListingSucceeded = function ()
	{
		return true;
	};
	
	Cnds.prototype.OnRequestStoreListingFailed = function ()
	{
		return true;
	};
	
	Cnds.prototype.HasProduct = function (product_)
	{
		return this.store && this.store.hasProduct(product_);
	};
	
	Cnds.prototype.IsAvailable = function ()
	{
		return this.store && this.store.isAvailable();
	};
	
	Cnds.prototype.IsAppPurchased = function ()
	{
		return this.store && this.store.isLicensed();
	};
//cranberrygame start
	Cnds.prototype.OnRestorePurchasesSucceeded = function (tag)
	{
		return cr.equals_nocase(tag, curTag);
	};
	
	Cnds.prototype.OnRestorePurchasesFailed = function (tag)
	{
		return cr.equals_nocase(tag, curTag);
	};
//cranberrygame end
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
		self.runtime.trigger(cr.plugins_.cranberrygame_CordovaIAP.prototype.cnds.TriggerCondition, self);	
	};	
*/
	
//cranberrygame start
	Acts.prototype.AddProductID = function (product_)
	{
		if (!(this.runtime.isAndroid || this.runtime.isiOS || this.runtime.isWindowsPhone8 || this.runtime.isWindowsPhone81))
			return;			
		if (typeof window['iap'] == 'undefined')
            return;

		if (this.runtime.isAndroid && this.androidApplicationLicenseKey == '')
			return;	
			
		if (!this.store)
			return;
		
		this.store.addProductIds(product_);
	};
	
	Acts.prototype.PurchaseProduct = function (product_)
	{
		if (!(this.runtime.isAndroid || this.runtime.isiOS || this.runtime.isWindowsPhone8 || this.runtime.isWindowsPhone81))
			return;			
		if (typeof window['iap'] == 'undefined')
            return;
			
		if (this.runtime.isAndroid && this.androidApplicationLicenseKey == '')
			return;	
			
		if (!this.store)
			return;
		
		this.store.purchaseProduct(product_);
	};
	
	Acts.prototype.ConsumeProduct = function (product_) //cranberrygame
	{
		if (!(this.runtime.isAndroid || this.runtime.isiOS || this.runtime.isWindowsPhone8 || this.runtime.isWindowsPhone81))
			return;			
		if (typeof window['iap'] == 'undefined')
            return;

		if (this.runtime.isAndroid && this.androidApplicationLicenseKey == '')
			return;	
			
		if (!this.store)
			return;
		
		this.store.consumeProduct(product_);
	};
	
	Acts.prototype.PurchaseApp = function ()
	{
		if (!(this.runtime.isAndroid || this.runtime.isiOS || this.runtime.isWindowsPhone8 || this.runtime.isWindowsPhone81))
			return;			
		if (typeof window['iap'] == 'undefined')
            return;
			
		if (this.runtime.isAndroid && this.androidApplicationLicenseKey == '')
			return;	
			
		if (!this.store)
			return;
		
		this.store.purchaseApp();
	};
	
	Acts.prototype.RestorePurchases = function (tag)
	{
		if (!(this.runtime.isAndroid || this.runtime.isiOS || this.runtime.isWindowsPhone8 || this.runtime.isWindowsPhone81))
			return;			
		if (typeof window['iap'] == 'undefined')
            return;
			
		if (this.runtime.isAndroid && this.androidApplicationLicenseKey == '')
			return;	
			
		if (!this.store)
			return;
		
		this.store.restorePurchases(tag);
	};
	
	Acts.prototype.RequestStoreListing = function ()
	{
		if (!(this.runtime.isAndroid || this.runtime.isiOS || this.runtime.isWindowsPhone8 || this.runtime.isWindowsPhone81))
			return;			
		if (typeof window['iap'] == 'undefined')
            return;
			
		if (this.runtime.isAndroid && this.androidApplicationLicenseKey == '')
			return;	
			
		if (!this.store)
			return;
		
		this.store.requestStoreListing();
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
	Exps.prototype.ProductName = function (ret, product_)
	{
		ret.set_string(this.store ? this.store.getProductName(product_) : "");
	};
	
	Exps.prototype.ProductPrice = function (ret, product_)
	{
		ret.set_string(this.store ? this.store.getProductFormattedPrice(product_) : "");
	};
	
	Exps.prototype.AppName = function (ret)
	{
		ret.set_string(this.store ? this.store.getAppName() : "");
	};
	
	Exps.prototype.AppPrice = function (ret)
	{
		ret.set_string(this.store ? this.store.getAppFormattedPrice() : "");
	};
	
	Exps.prototype.ProductID = function (ret)
	{
		ret.set_string(this.productId);
	};
	
	Exps.prototype.ErrorMessage = function (ret)
	{
		ret.set_string(this.errorMessage);
	};
//cranberrygame end
	
	// ... other expressions here ...
	
	pluginProto.exps = new Exps();

}());