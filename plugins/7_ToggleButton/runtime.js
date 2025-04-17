// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
cr.plugins_.togglebutton = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	var pluginProto = cr.plugins_.togglebutton.prototype;
		
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
		this.triggerID = null;
		this.triggerToggle = null;
	};

	var instanceProto = pluginProto.Instance.prototype;

	// called whenever an instance is created
	instanceProto.onCreate = function()
	{
		// variables
			this.iOS_version = [true,false][this.properties[0]];
			this.toggle_status = [true,false][this.properties[1]];

		// Initialisation

			var newSwitch = document.createElement("span"); 
				newSwitch.id = "togglebutton_"+this.uid;
				newSwitch.style.zIndex = this.properties[2];
				if(this.toggle_status == true && this.iOS_version == true) 
					{ newSwitch.className = "switch4 on"; } 
				else if(this.toggle_status == false && this.iOS_version == true) 
					{ newSwitch.className = "switch4";}
				else if(this.toggle_status == true && this.iOS_version == false) 
					{ newSwitch.className = "switch5 on"; } 
				else if(this.toggle_status == false && this.iOS_version == false) 
					{ newSwitch.className = "switch5";};
		//	this.elem = newSwitch;				
			var newThumb = document.createElement("span");	
				newThumb.className = "thumb";
			var newCheckbox = document.createElement("input");
				newCheckbox.type = "checkbox";
			
			jQuery(newSwitch).appendTo(this.runtime.canvasdiv ? this.runtime.canvasdiv : "body");
				newSwitch.appendChild(newThumb);
				newSwitch.appendChild(newCheckbox);
				
			// CSS style 
				++toggle_t;
				if (toggle_t == 1) { jQuery(toggle_css).appendTo("head"); };
					
			// Triggers
				newSwitch.onclick = (function(self) {
								return function() {
								self.triggerID = "togglebutton_"+self.uid;
								if (newSwitch.className == "switch4 on" || newSwitch.className == "switch5 on")
								{ self.triggerToggle =  1; } else { self.triggerToggle = 0; };
							//	alert ("this.triggerID renvoie "+self.triggerID); //debug mode
							//	alert ("triggerToggle renvoie "+self.triggerToggle); //debug mode
								if (newSwitch.className == "switch4 on")
									{
										newSwitch.className = "switch4";
									} 
								else if (newSwitch.className == "switch5 on")
									{
										newSwitch.className = "switch5";
									} 
								else if (newSwitch.className == "switch4")
									{
										newSwitch.className = "switch4 on";
									} 	
								else if (newSwitch.className == "switch5")
									{
										newSwitch.className = "switch5 on";
									};		
							
								self.runtime.trigger(cr.plugins_.togglebutton.prototype.cnds.toggleStatus, self);
								};
							})(this);		

		// Prevent bugs
			document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false); // use this for compatibility with iDevice & Android (prevents whole window scrolling)
			newSwitch.addEventListener('touchstart', function(e) {
				e.stopPropagation();
				}, false);

		this.updatePosition();
		this.runtime.tickMe(this);
	};

	instanceProto.draw = function ()
	{
	};	
		
	instanceProto.drawGL = function(glw)
	{
	};
				
	instanceProto.onDestroy = function ()
	{
		jQuery(this.elem).remove();
		this.elem = null;
	};
		
	instanceProto.tick = function ()
	{
		this.updatePosition();
    };
	
	instanceProto.updatePosition = function () 
	{
		var newSwitch = document.getElementById("togglebutton_"+this.uid);
		this.elem = newSwitch;
		/*if (this.isFullScreen == true) // if destination is fullscreen ( prevent a bug )
		{  }
		else if (this.isFullScreen == false) // if destination is a frame ( prevent a bug )
		{*/
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
		
		
		/*if (this.truncate == true) // ability to disable
		{*/
			/*Truncate to canvas size
			if (left < 1)
				left = 1;
			if (top < 1)
				top = 1;
			if (right >= this.runtime.width)
				right = this.runtime.width - 1;
			if (bottom >= this.runtime.height)
				bottom = this.runtime.height - 1; 
		/*} else {};*/
			
		jQuery(this.elem).show();
		
		
		var offx = Math.round(left) + jQuery(this.runtime.canvas).offset().left;
		var offy = Math.round(top) + jQuery(this.runtime.canvas).offset().top;
		jQuery(this.elem).offset({left: offx, top: offy});
		jQuery(this.elem).width(right - left); 
		jQuery(this.elem).height(bottom - top); 

		//};
	};
	

	//////////////////////////////////////
	//Actions/////////////////////////////
	pluginProto.acts = {};
	var acts = pluginProto.acts;
	
	//ACTION set_toggleStatus
	acts.set_toggleStatus = function (status)
	{
		var elem = document.getElementById("togglebutton_"+this.uid);
			
		if (!elem) 
			{ return false; }
		else if (status === 0 && this.iOS_version == true) 
			{ elem.className = "switch4 on"; } 
		else if (status === 1 && this.iOS_version == true) 
			{ elem.className = "switch4"; }
		else if (status === 0 && this.iOS_version == false) 
			{ elem.className = "switch5 on"; } 
		else if (status === 1 && this.iOS_version == false) 
			{ elem.className = "switch5"; };	
			
	};
	
	//ACTION switch_toggleStatus
	acts.switch_toggleStatus = function ()
	{
		var elem = document.getElementById("togglebutton_"+this.uid);
		
		switch (elem.className)
		{
		case "switch4 on":	elem.className = "switch4";
							break;
		case "switch4":		elem.className = "switch4 on";
							break;
		case "switch5 on":	elem.className = "switch5";
							break;
		case "switch5":		elem.className = "switch5 on";
							break;					
		};
	};
	
	
	//////////////////////////////////////
	//Conditions/////////////////////////
	pluginProto.cnds = {};
	var cnds = pluginProto.cnds;

	//CONDITION toggleStatus
	cnds.toggleStatus = function (status) 
	{
		//alert(this.triggerID); //debug mode
		return "togglebutton_"+this.uid == this.triggerID && this.triggerToggle == status;
	};

	//////////////////////////////////////
	//Expressions/////////////////////////
	pluginProto.exps = {};
	var exps = pluginProto.exps;

	
	
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
}());