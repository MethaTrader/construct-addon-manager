// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
//          vvvvvvvv
cr.plugins_.FileReader = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	/////////////////////////////////////
	// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
	//                            vvvvvvvv
	var pluginProto = cr.plugins_.FileReader.prototype;
		
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
	
	// called whenever an instance is created
	instanceProto.onCreate = function()
	{
		// note the object is sealed after this call; ensure any properties you'll ever need are set on the object
		// e.g...
		// this.myValue = 0;
		this.textFileContent = "";
		this.file = "";
		this.filename = "";
		this.filetype = "";
		this.filesize = "";
		
		this.r = new FileReader();
		this.r.onload = (function (self) {
			return function(info) {
				self.fileLoaded(info);
				self.runtime.trigger(cr.plugins_.FileReader.prototype.cnds.onLoaded, self);
			};
		})(this);

		
		this.elem = document.createElement("input");
		this.elem.type = "file";		
		this.elem.id = "fileinput";	
		this.elem.onchange = (function (self) {
			return function(info) {
				self.fileChanged(info);
			};
		})(this);

		jQuery(this.elem).appendTo("body");
		
		this.updatePosition();
		
		this.runtime.tickMe(this);
	};

	instanceProto.tick = function ()
	{
		this.updatePosition();
	};
	
	instanceProto.updatePosition = function ()
	{
		var left = this.layer.layerToCanvas(this.x, this.y, true);
		var top = this.layer.layerToCanvas(this.x, this.y, false);
		var right = this.layer.layerToCanvas(this.x + this.width, this.y + this.height, true);
		var bottom = this.layer.layerToCanvas(this.x + this.width, this.y + this.height, false);
		
		// Is entirely offscreen or invisible: hide
		if (!this.visible || !this.layer.visible || right <= 0 || bottom <= 0 || left >= this.runtime.width || top >= this.runtime.height)
		{
			jQuery(this.elem).hide();
			return;
		}
		
		// Truncate to canvas size
		if (left < 1)
			left = 1;
		if (top < 1)
			top = 1;
		if (right >= this.runtime.width)
			right = this.runtime.width - 1;
		if (bottom >= this.runtime.height)
			bottom = this.runtime.height - 1;
			
		jQuery(this.elem).show();
		
		var offx = left + (this.runtime.isWebKitMode ? 0 : jQuery(this.runtime.canvas).offset().left);
		var offy = top + (this.runtime.isWebKitMode ? 0 : jQuery(this.runtime.canvas).offset().top);
		jQuery(this.elem).offset({left: offx, top: offy});
		jQuery(this.elem).width(right - left);
		jQuery(this.elem).height(bottom - top);
	};
	
	instanceProto.fileChanged = function(info)
	{
		String.prototype.endsWith = function(str)
			{return (this.match(str+"$")==str)}
	
		this.file = info.target.files[0]
		if(this.file){
			if(this.file.name.endsWith("txt") 
												//|| f[i].name.endsWith("log") 
												|| this.file.name.endsWith("xml") 
												|| this.file.name.endsWith("svg") 												
												//|| f[i].name.endsWith("tmx") 	
												|| this.file.name.endsWith("html") 	
												|| this.file.name.endsWith("htm") 	)
				this.r.readAsText(this.file);
			if(this.file.name.endsWith("png") 
													|| this.file.name.endsWith("jpg") 
													|| this.file.name.endsWith("jpeg") 
													|| this.file.name.endsWith("bmp") 
													|| this.file.name.endsWith("gif")
													|| this.file.name.endsWith("xbm") 
												)
				this.r.readAsDataURL(this.file);
		} else { 
			alert("Failed to load file");
		}
		//this.runtime.trigger(cr.plugins_.Touch.prototype.cnds.onChanged, this);
	};
	
	instanceProto.fileLoaded = function(info)
	{
		this.filename = this.file.name;
		this.filetype = this.file.type;
		this.filesize = this.file.size;
		this.textFileContent = info.target.result;
		
		//self.runtime.trigger(cr.plugins_.FileReader.prototype.cnds.onLoaded, self);
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

	//////////////////////////////////////
	// Conditions
	/*pluginProto.cnds = {};
	var cnds = pluginProto.cnds;

	// the example condition
	cnds.MyCondition = function (myparam)
	{
		// return true if number is positive
		return myparam >= 0;
	};
	
	cnds.onLoaded = function ()
	{
	
		return true;
	};
	
	cnds.onChanged = function ()
	{
	
		return true;
	};*/
	function Cnds() {};

	// the example condition
	Cnds.prototype.onLoaded = function ()
	{
		return true;
	};
	// the example condition
	Cnds.prototype.onChanged = function ()
	{
		return true;
	};	
	// ... other conditions here ...
	
	pluginProto.cnds = new Cnds();
	
	//////////////////////////////////////
	// Actions
	/*pluginProto.acts = {};
	var acts = pluginProto.acts;

	// the example action
	acts.MyAction = function (myparam)
	{
		// alert the message
		alert(myparam);
	};
	
	acts.returnFileReader = function()
	{
		return this.r;
	};
	
	//function readSingleFile(evt) {
	acts.setFileName = function(filename) {
		this.name = filename;
	};
	
	acts.setSize = function(size) {
		this.size = size;
	};
	
	acts.setType = function(type) {
		this.size = type;
	};
	
	acts.setContent = function(content) {
		this.textFileContent = content;
	};*/
	
	function Acts() {};

	// the example action
	Acts.prototype.returnFileReader = function ()
	{
		return this.r;
	};
	Acts.prototype.setFileName = function(filename) {
		this.filename = filename;
	};
	
	Acts.prototype.setSize = function(size) {
		this.filesize = size;
	};
	
	Acts.prototype.setType = function(type) {
		this.filesize = type;
	};
	
	Acts.prototype.setContent = function(content) {
		this.textFileContent = content;
	};
	
	pluginProto.acts = new Acts();
	
	//acts.readSingleFile = function(evt) {
	//instanceProto.readSingleFile = function(evt) {
	//acts.readSingleFile = function(_thisArgs) {
    //Retrieve the first (and only!) File from the FileList object
   // var file = evt.target.files[0]; 
	//var file = _thisArgs.evt.target.files[0]; 
	//var file = _thisArgs[0].target.files[0]; 

   // if (this.file) {
      //var r = new FileReader();
		 /* r.onload = function(e) { 
		  //r.onload = function(self) { 
		  //r.onload = (function (e) {
			  //var contents = e.target.result;
			//alert( "Got the file.n" 
			//	  +"name: " + f.name + "n"
			//	  +"type: " + f.type + "n"
			//	  +"size: " + f.size + " bytesn"
			//	  + "starts with: " + contents.substr(1, contents.indexOf("n"))
			//); 
				this.name = file.name;
				this.type = file.type;
				this.size = file.size;
				this.textFileContent = e.target.result;
				this.file = file;
			}*/
			
			//self.runtime.trigger(cr.plugins_.FileReader.prototype.cnds.onLoaded, self);
			/*r.onload = (function (self) {
				return function(e) {
					//self.runtime.trigger(cr.plugins_.FileReader.prototype.cnds.onLoaded, self);
					//self.runtime.trigger(cr.plugins_.FileReader.prototype.cnds.onLoaded, self);
					cr.runtime.trigger(cr.plugins_.FileReader.prototype.cnds.onLoaded, self);
				};
			})(this);*/
			/*r.onload = (function (self) {
				return function(e) {
					//self.runtime.trigger(cr.plugins_.FileReader.prototype.cnds.onLoaded, self);
					//self.runtime.trigger(cr.plugins_.FileReader.prototype.cnds.onLoaded, self);
					self.runtime.trigger(cr.plugins_.FileReader.prototype.cnds.onLoaded, self);
				};
			})(this);*/
			//_thisArgs.r.readAsText(file);
			//_thisArgs[1].readAsText(file);
			//var r = cr.plugins_.FileReader.prototype.acts.returnFileReader();
		//	this.r.readAsText(file);
			//this.name = file.name;
			/*this.type = file.type;
			this.size = file.size;
			this.textFileContent = e.target.result;
			this.file = file;*/
			/*this.name = file.name;
			this.type = file.type;
			this.size = file.size;
			this.textFileContent = e.target.result;
			this.file = file;*/
  /*  } else { 
      alert("Failed to load file");
    }
  }*/
	
	
	
	//////////////////////////////////////
	// Expressions
	/*pluginProto.exps = {};
	var exps = pluginProto.exps;
	
	exps.fileName = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		//ret.set_int(1337);				// return our value
		// ret.set_float(0.5);			// for returning floats
		// ret.set_string("Hello");		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string
		ret.set_string(this.name);
	};
	exps.fileType = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_string(this.type);
	};
	exps.fileSize = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_any(this.size);
	};
	exps.fileContent = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_any(this.textFileContent);
	};*/
	function Exps() {};
	
	// the example expression
	Exps.prototype.fileName = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_string(this.filename);				// return our value
		// ret.set_float(0.5);			// for returning floats
		// ret.set_string("Hello");		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string
	};
	
	// the example expression
	Exps.prototype.fileType = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_string(this.filetype);				// return our value
	};
	Exps.prototype.fileSize = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_any(this.filesize);				// return our value
	};	
	Exps.prototype.fileContent = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		ret.set_string(this.textFileContent);				// return our value
	};		
	pluginProto.exps = new Exps();
}());