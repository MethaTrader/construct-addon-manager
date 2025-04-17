// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");


//Import CSS function
function importcssfile(filename){
	var fileref=document.createElement("link")
	fileref.setAttribute("rel", "stylesheet")
	fileref.setAttribute("type", "text/css")
	fileref.setAttribute("href", filename)
	document.getElementsByTagName("head")[0].appendChild(fileref)
};


/////////////////////////////////////
// Plugin class
// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
//          vvvvvvvv
cr.plugins_.PKP_SweetAlert = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	/////////////////////////////////////
	// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
	//                            vvvvvvvv
	var pluginProto = cr.plugins_.PKP_SweetAlert.prototype;
		
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
		importcssfile("sweetalert.css");
	};

	/////////////////////////////////////
	// Instance class
	pluginProto.Instance = function(type)
	{
		this.type = type;
		this.runtime = type.runtime;
		this.Tag;

		// any other properties you need, e.g...
		// this.myValue = 0;
	};
	
	var instanceProto = pluginProto.Instance.prototype;

	// called whenever an instance is created
	instanceProto.onCreate = function()
	{
		// note the object is sealed after this call; ensure any properties you'll ever need are set on the object
		// e.g...
		this.inputFeed	=	'';
		
		// this.myValue = 0;
	};
	
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
	function Cnds() {};

	// the example condition

	Cnds.prototype.confirmClicked = function ()
	{
		return true;
	};

	Cnds.prototype.option1Selected = function ()
	{
		return true;
	};
	

	Cnds.prototype.option2Selected = function ()
	{
		return true;
	};

	Cnds.prototype.promptRead = function ()
	{
		return true;
	};

	Cnds.prototype.loaderClicked = function ()
	{
		return true;
	};	
	
	// ... other conditions here ...
	
	pluginProto.cnds = new Cnds();
	
	//////////////////////////////////////
	// Actions
	function Acts() {};

	// the example action
	Acts.prototype.BasicMessge = function (inMsg,inTag)
	{
		this.Tag	= inTag;
		swal(inMsg);
	};

	Acts.prototype.TitledMessge = function (inTitle,inMsg,inTag)
	{
		this.Tag	= inTag;
		swal(inTitle,inMsg);
	};
	
	Acts.prototype.AlertWithTitleMsgSucErrWarn = function (inTitle,inMsg,inAlertType,inTag)
	{
		this.Tag	= inTag;
		
		var	AlertType;
		
		switch(inAlertType)
		{
			case 0:
				AlertType	= "success";
				break;

			case 1:
				AlertType	= "error";
				break;

			case 2:
				AlertType	= "warning";
				break;

			case 3:
				AlertType	= "info";
				break;

			default:
				AlertType	= "success";
				break;
		}
			
		swal(inTitle,inMsg,AlertType);
	};
		
	Acts.prototype.AlertWithTitleMsgSucErrWarnAndConfCan = function (inTitle,inMsg,inAlertType,inConfirmText,inCancelText,inConfirmColour,inTag)
	{
		this.Tag	= inTag;
		
		var	AlertType;
		var self = this;

		switch(inAlertType)
		{
			case 0:
				AlertType	= "success";
				break;

			case 1:
				AlertType	= "error";
				break;

			case 2:
				AlertType	= "warning";
				break;

			case 3:
				AlertType	= "info";
				break;

				
			default:
				AlertType	= "success";
				break;
		}
			
			swal({
			  "title": inTitle,
			  "text": inMsg,
			  "type": AlertType,
			  "showCancelButton": true,
			  "confirmButtonColor": "#" + inConfirmColour,
			  "confirmButtonText": inConfirmText,
			  "cancelButtonText": inCancelText,
			  "closeOnConfirm": true
			},
			function(){
				self.runtime.trigger(cr.plugins_.PKP_SweetAlert.prototype.cnds.confirmClicked, self);
			});

		};
	
	
	Acts.prototype.AlertWithTitleMsgSucErrWarnAndTwoTrigg = function (inTitle,inMsg,inAlertType,inOpt1Text,inOpt2Text,inConfirmColour,inTag)
	{
		this.Tag	= inTag;
		
		var	AlertType;
		var self = this;

		switch(inAlertType)
		{
			case 0:
				AlertType	= "success";
				break;

			case 1:
				AlertType	= "error";
				break;

			case 2:
				AlertType	= "warning";
				break;

			case 3:
				AlertType	= "info";
				break;

			default:
				AlertType	= "success";
				break;
		}
		
		var trueObj	= true;
			
			swal({
			  "title": inTitle,
			  "text": inMsg,
			  "type": AlertType,
			  "showCancelButton": trueObj,
			  "confirmButtonColor": "#" + inConfirmColour,
			  "confirmButtonText": inOpt2Text,
			  "cancelButtonText": inOpt1Text,
			  "closeOnConfirm": true,
			  "closeOnCancel": true
			},
			function(isConfirm){
				  if (isConfirm) {
				self.runtime.trigger(cr.plugins_.PKP_SweetAlert.prototype.cnds.option2Selected, self);
				  } else {
				self.runtime.trigger(cr.plugins_.PKP_SweetAlert.prototype.cnds.option1Selected, self);
				}
			}
			);

	};

	
	Acts.prototype.AlertWithTitleMsgCustIcon = function (inTitle,inMsg,inURL,inTag)
	{
		this.Tag	= inTag;
		
		swal({
		  "title": inTitle,
		  "text": inMsg,
		  "imageUrl": inURL
		});
	};
	
	
	Acts.prototype.AlertWithTitleMsgAutoClose = function (inTitle,inMsg,inTimer,inTag)
	{
		this.Tag	= inTag;
		
		swal({
		  "title": inTitle,
		  "text": inMsg,
		  "timer": inTimer,
		  "showConfirmButton": false
		});
	};
	

	Acts.prototype.PromptWithTitleMsg = function (inTitle,inMsg,inPlaceHolder,inTag)
	{
		this.Tag	= inTag;
		
		this.inputFeed	= '';
		var self = this;

		swal({
		  "title": inTitle,
		  "text": inMsg,
		  "type": "input",
		  "showCancelButton": true,
		  "closeOnConfirm": true,
		  "animation": "slide-from-top",
		  "inputPlaceholder": inPlaceHolder
		},
		function(inputValue){
		  if (inputValue === false) return false;
		  
		  if (inputValue === "") {
			swal.showInputError("You need to write something!");
			return false
		  }
			console.log(inputValue);
		    self.inputFeed	= inputValue;
			self.runtime.trigger(cr.plugins_.PKP_SweetAlert.prototype.cnds.promptRead, self);

		  });
	};
	
	
	Acts.prototype.AlertWithLoader = function (inTitle,inMsg,inAlertType,inTag)
	{
		this.Tag	= inTag;
		
		var	AlertType;
		var self = this;

		switch(inAlertType)
		{
			case 0:
				AlertType	= "success";
				break;

			case 1:
				AlertType	= "error";
				break;

			case 2:
				AlertType	= "warning";
				break;

			case 3:
				AlertType	= "info";
				break;

			default:
				AlertType	= "success";
				break;
		}
			
		swal({
		  "title": inTitle,
		  "text": inMsg,
		  "type": AlertType,
		  "showCancelButton": false,
		  "closeOnConfirm": false,
		  "showLoaderOnConfirm": true,
		},
		function(){
				self.runtime.trigger(cr.plugins_.PKP_SweetAlert.prototype.cnds.loaderClicked, self);
			}
		);
	};
	
	Acts.prototype.AlertWithLoaderAndCancel = function (inTitle,inMsg,inAlertType,inTag)
	{
		this.Tag	= inTag;
		
		var	AlertType;
		var self = this;

		switch(inAlertType)
		{
			case 0:
				AlertType	= "success";
				break;

			case 1:
				AlertType	= "error";
				break;

			case 2:
				AlertType	= "warning";
				break;

			case 3:
				AlertType	= "info";
				break;

			default:
				AlertType	= "success";
				break;
		}
		
		swal({
		  "title": inTitle,
		  "text": inMsg,
		  "type": AlertType,
		  "showCancelButton": true,
		  "closeOnConfirm": false,
		  "showLoaderOnConfirm": true,
		},
		function(){
				self.runtime.trigger(cr.plugins_.PKP_SweetAlert.prototype.cnds.loaderClicked, self);
			}
		);
	};
	
	Acts.prototype.AlertWithTitleMsgSucErrWarnAndConfTrigger = function (inTitle,inMsg,inAlertType,inConfirmText,inConfirmColour,inTag)
	{
		this.Tag	= inTag;
		
		var	AlertType;
		var self = this;

		switch(inAlertType)
		{
			case 0:
				AlertType	= "success";
				break;

			case 1:
				AlertType	= "error";
				break;

			case 2:
				AlertType	= "warning";
				break;

			case 3:
				AlertType	= "info";
				break;

				
			default:
				AlertType	= "success";
				break;
		}
			
			swal({
			  "title": inTitle,
			  "text": inMsg,
			  "type": AlertType,
//			  "showCancelButton": true,
			  "confirmButtonColor": "#" + inConfirmColour,
			  "confirmButtonText": inConfirmText,
//			  ,
//			  "cancelButtonText": inCancelText,
			  "closeOnConfirm": true
			},
			function(){
				self.runtime.trigger(cr.plugins_.PKP_SweetAlert.prototype.cnds.confirmClicked, self);
			});

		};
	
	
	
	Acts.prototype.CloseSWAL = function ()
	{
		swal.close();
	};
	
	// ... other actions here ...
	
	pluginProto.acts = new Acts();
	
	//////////////////////////////////////
	// Expressions
	function Exps() {};
	
	// the example expression
	Exps.prototype.inPutFromPrompt = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		//ret.set_int(1337);				// return our value
		// ret.set_float(0.5);			// for returning floats
		 ret.set_string(this.inputFeed);		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string
	};
	
	Exps.prototype.alertTag = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	{
		//ret.set_int(1337);				// return our value
		// ret.set_float(0.5);			// for returning floats
		 ret.set_string(this.Tag);		// for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string
	};	
	
	
	
	
	pluginProto.exps = new Exps();

}());