// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
cr.plugins_.Touch2 = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	var pluginProto = cr.plugins_.Touch2.prototype;
		
	/////////////////////////////////////
	// Object type class
	pluginProto.Type = function(plugin)
	{
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};

	var typeProto = pluginProto.Type.prototype;

	typeProto.onCreate = function()
	{
	};

	/////////////////////////////////////
	// Instance class
	pluginProto.Instance = function(type)
	{
		this.type = type;
		this.runtime = type.runtime;
		this.touches = [];
		this.mouseDown = false;
	};
	
	var instanceProto = pluginProto.Instance.prototype;
	
	var dummyoffset = {left: 0, top: 0};

	instanceProto.saveTouches = function (t)
	{
		this.touches.length = 0;
		var offset = this.runtime.isWebKitMode ? dummyoffset : jQuery(this.runtime.canvas).offset();
		
		var i, len, touch;
		for (i = 0, len = t.length; i < len; i++)
		{
			touch = t[i];
			this.touches.push({ x: touch.pageX - offset.left, y: touch.pageY - offset.top });
		}
	};
	
	var appmobi_accisrequesting = false;
	var appmobi_accx = 0;
	var appmobi_accy = 0;
	var appmobi_accz = 0;
	
	function AppMobiGetAcceleration(evt)
	{
		appmobi_accx = evt.x;
		appmobi_accy = evt.y;
		appmobi_accz = evt.z;
		appmobi_accisrequesting = false;
	};

	instanceProto.onCreate = function()
	{
		this.orient_alpha = 0;
		this.orient_beta = 0;
		this.orient_gamma = 0;
		
		this.acc_g_x = 0;
		this.acc_g_y = 0;
		this.acc_g_z = 0;
		this.acc_x = 0;
		this.acc_y = 0;
		this.acc_z = 0;
		
		this.curTouchX = 0;
		this.curTouchY = 0;
		
		this.useMouseInput = (this.properties[0] !== 0);
		
		// Use document touch input for PhoneGap or fullscreen mode
		var elem = (this.runtime.fullscreen_mode > 0) ? document : this.runtime.canvas;
	
		elem.addEventListener("touchstart",
			(function (self) {
				return function(info) {
					self.onTouchStart(info);
				};
			})(this),
			false
		);
		
		elem.addEventListener("touchmove",
			(function (self) {
				return function(info) {
					self.onTouchMove(info);
				};
			})(this),
			false
		);
		
		elem.addEventListener("touchend",
			(function (self) {
				return function(info) {
					self.onTouchEnd(info);
				};
			})(this),
			false
		);
		
		if (this.runtime.overlay_canvas && !(this.runtime.isPhoneGap || this.runtime.isWebKitMode))
		{
			this.runtime.overlay_canvas.addEventListener("touchstart",
				(function (self) {
					return function(info) {
						self.onTouchStart(info);
					};
				})(this),
				false
			);
			
			this.runtime.overlay_canvas.addEventListener("touchmove",
				(function (self) {
					return function(info) {
						self.onTouchMove(info);
					};
				})(this),
				false
			);
			
			this.runtime.overlay_canvas.addEventListener("touchend",
				(function (self) {
					return function(info) {
						self.onTouchEnd(info);
					};
				})(this),
				false
			);
		}
		
		window.addEventListener("deviceorientation", (function (self) { return function (eventData) {
		
			self.orient_alpha = eventData["alpha"] || 0;
			self.orient_beta = eventData["beta"] || 0;
			self.orient_gamma = eventData["gamma"] || 0;
		
		}; })(this), false);
		
		window.addEventListener("devicemotion", (function (self) { return function (eventData) {
		
			if (eventData["accelerationIncludingGravity"])
			{
				self.acc_g_x = eventData["accelerationIncludingGravity"]["x"];
				self.acc_g_y = eventData["accelerationIncludingGravity"]["y"];
				self.acc_g_z = eventData["accelerationIncludingGravity"]["z"];
			}
			
			if (eventData["acceleration"])
			{
				self.acc_x = eventData["acceleration"]["x"];
				self.acc_y = eventData["acceleration"]["y"];
				self.acc_z = eventData["acceleration"]["z"];
			}
			
		}; })(this), false);
		
		if (this.useMouseInput && !this.runtime.isPhoneGap)
		{
			jQuery(document).mousemove(
				(function (self) {
					return function(info) {
						self.onMouseMove(info);
					};
				})(this)
			);
			
			jQuery(document).mousedown(
				(function (self) {
					return function(info) {
						self.onMouseDown(info);
					};
				})(this)
			);
			
			jQuery(document).mouseup(
				(function (self) {
					return function(info) {
						self.onMouseUp(info);
					};
				})(this)
			);
		}
		
		// Use AppMobi in case browser does not support accelerometer but device does
		if (this.runtime.isAppMobi)
		{
			AppMobi["accelerometer"]["watchAcceleration"](AppMobiGetAcceleration, { frequency: 50, adjustForRotation: false });
		}
	};

	instanceProto.onTouchMove = function (info)
	{
		info.preventDefault();
		this.saveTouches(info.touches);

        // Trigger OnTouchStart
        this.runtime.trigger(cr.plugins_.Touch2.prototype.cnds.OnTouchMove, this);

	};

	instanceProto.onTouchStart = function (info)
	{
		info.preventDefault();
		this.saveTouches(info.touches);
		
		// Trigger OnTouchStart
		this.runtime.trigger(cr.plugins_.Touch2.prototype.cnds.OnTouchStart, this);
		
		// Trigger OnTouchObject for each touch started event
		var offset = this.runtime.isWebKitMode ? dummyoffset : jQuery(this.runtime.canvas).offset();
		
		if (info.changedTouches)
		{
			var i, len;
			for (i = 0, len = info.changedTouches.length; i < len; i++)
			{
				var touch = info.changedTouches[i];
				
				this.curTouchX = touch.pageX - offset.left;
				this.curTouchY = touch.pageY - offset.top;
				this.runtime.trigger(cr.plugins_.Touch2.prototype.cnds.OnTouchObject, this);
			}
		}
	};

	instanceProto.onTouchEnd = function (info)
	{
		info.preventDefault();
		
		// Trigger OnTouchEnd
		this.runtime.trigger(cr.plugins_.Touch2.prototype.cnds.OnTouchEnd, this);
		
		// Save touches after, so OnTouchEnd can access the x and y of the touch
		this.saveTouches(info.touches);
	};
	
	var noop_func = function(){};

	instanceProto.onMouseDown = function(info)
	{
		// Send a fake touch start event
		var t = { pageX: info.pageX, pageY: info.pageY };
		var fakeinfo = { touches: [t], changedTouches: [t], preventDefault: noop_func };
		this.onTouchStart(fakeinfo);
		this.mouseDown = true;
	};
	
	instanceProto.onMouseMove = function(info)
	{
		if (!this.mouseDown)
			return;
			
		// Send a fake touch move event
		var t = { pageX: info.pageX, pageY: info.pageY };
		var fakeinfo = { touches: [t], preventDefault: noop_func };
		this.onTouchMove(fakeinfo);
	};

	instanceProto.onMouseUp = function(info)
	{
		// Send a fake touch end event
		var fakeinfo = { touches: [], preventDefault: noop_func };
		this.onTouchEnd(fakeinfo);
		this.mouseDown = false;
	};

	//////////////////////////////////////
	// Conditions
	pluginProto.cnds = {};
	var cnds = pluginProto.cnds;

	cnds.OnTouchStart = function ()
	{
		return true;
	};
	
	cnds.OnTouchEnd = function ()
	{
		return true;
	};

    cnds.OnTouchMove = function ()
    {
        return true;
    };
	
	cnds.IsInTouch = function ()
	{
		return this.touches.length;
	};
	
	cnds.OnTouchObject = function (type)
	{
		if (!type)
			return false;
			
		return this.runtime.testAndSelectCanvasPointOverlap(type, this.curTouchX, this.curTouchY, false);
	};
	
	cnds.IsTouchingObject = function (type)
	{
		if (!type)
			return false;
			
		var sol = type.getCurrentSol();
		var instances = sol.getObjects();
		var px, py;
		
		var touching = [];
			
		// Check all touches for overlap with any instance
		var i, leni, j, lenj;
		for (i = 0, leni = instances.length; i < leni; i++)
		{
			var inst = instances[i];
			inst.update_bbox();
			
			for (j = 0, lenj = this.touches.length; j < lenj; j++)
			{
				var touch = this.touches[j];
				
				px = inst.layer.canvasToLayer(touch.x, touch.y, true);
				py = inst.layer.canvasToLayer(touch.x, touch.y, false);
				
				if (inst.contains_pt(px, py))
				{
					touching.push(inst);
					break;
				}
			}
		}
		
		if (touching.length)
		{
			sol.select_all = false;
			sol.instances = touching;
			return true;
		}
		else
			return false;
	};
	
	cnds.OrientationSupported = function ()
	{
		return typeof window["DeviceOrientationEvent"] !== "undefined";
	};
	
	cnds.MotionSupported = function ()
	{
		return typeof window["DeviceMotionEvent"] !== "undefined";
	};

	//////////////////////////////////////
	// Expressions
	pluginProto.exps = {};
	var exps = pluginProto.exps;

	// TODO: multitouch support
	exps.X = function (ret, layerparam)
	{
		if (this.touches.length)
		{
			var layer, oldScale, oldZoomRate, oldParallaxX, oldAngle;
		
			if (cr.is_undefined(layerparam))
			{
				// calculate X position on bottom layer as if its scale were 1.0
				layer = this.runtime.getLayerByNumber(0);
				oldScale = layer.scale;
				oldZoomRate = layer.zoomRate;
				oldParallaxX = layer.parallaxX;
				oldAngle = layer.angle;
				layer.scale = this.runtime.running_layout.scale;
				layer.zoomRate = 1.0;
				layer.parallaxX = 1.0;
				layer.angle = this.runtime.running_layout.angle;
				ret.set_float(layer.canvasToLayer(this.touches[0].x, this.touches[0].y, true));
				layer.scale = oldScale;
				layer.zoomRate = oldZoomRate;
				layer.parallaxX = oldParallaxX;
				layer.angle = oldAngle;
			}
			else
			{
				// use given layer param
				if (cr.is_number(layerparam))
					layer = this.runtime.getLayerByNumber(layerparam);
				else
					layer = this.runtime.getLayerByName(layerparam);
					
				if (layer)
					ret.set_float(layer.canvasToLayer(this.touches[0].x, this.touches[0].y, true));
				else
					ret.set_float(0);
			}
		}
		else
			ret.set_float(0);
	};
	
	exps.Y = function (ret, layerparam)
	{
		if (this.touches.length)
		{
			var layer, oldScale, oldZoomRate, oldParallaxY, oldAngle;
		
			if (cr.is_undefined(layerparam))
			{
				// calculate X position on bottom layer as if its scale were 1.0
				layer = this.runtime.getLayerByNumber(0);
				oldScale = layer.scale;
				oldZoomRate = layer.zoomRate;
				oldParallaxY = layer.parallaxY;
				oldAngle = layer.angle;
				layer.scale = this.runtime.running_layout.scale;
				layer.zoomRate = 1.0;
				layer.parallaxY = 1.0;
				layer.angle = this.runtime.running_layout.angle;
				ret.set_float(layer.canvasToLayer(this.touches[0].x, this.touches[0].y, false));
				layer.scale = oldScale;
				layer.zoomRate = oldZoomRate;
				layer.parallaxY = oldParallaxY;
				layer.angle = oldAngle;
			}
			else
			{
				// use given layer param
				if (cr.is_number(layerparam))
					layer = this.runtime.getLayerByNumber(layerparam);
				else
					layer = this.runtime.getLayerByName(layerparam);
					
				if (layer)
					ret.set_float(layer.canvasToLayerY(this.touches[0].x, this.touches[0].y, false));
				else
					ret.set_float(0);
			}
		}
		else
			ret.set_float(0);
	};


    exps.TouchX = function (ret, index, layerparam)
    {
        if (this.touches.length>index)
        {
            var layer, oldScale, oldZoomRate, oldParallaxX, oldAngle;

            if (cr.is_undefined(layerparam))
            {
                // calculate X position on bottom layer as if its scale were 1.0
                layer = this.runtime.getLayerByNumber(0);
                oldScale = layer.scale;
                oldZoomRate = layer.zoomRate;
                oldParallaxX = layer.parallaxX;
                oldAngle = layer.angle;
                layer.scale = this.runtime.running_layout.scale;
                layer.zoomRate = 1.0;
                layer.parallaxX = 1.0;
                layer.angle = this.runtime.running_layout.angle;
                ret.set_float(layer.canvasToLayer(this.touches[index].x, this.touches[index].y, true));
                layer.scale = oldScale;
                layer.zoomRate = oldZoomRate;
                layer.parallaxX = oldParallaxX;
                layer.angle = oldAngle;
            }
            else
            {
                // use given layer param
                if (cr.is_number(layerparam))
                    layer = this.runtime.getLayerByNumber(layerparam);
                else
                    layer = this.runtime.getLayerByName(layerparam);

                if (layer)
                    ret.set_float(layer.canvasToLayer(this.touches[index].x, this.touches[index].y, true));
                else
                    ret.set_float(0);
            }
        }
        else
            ret.set_float(0);
    };

    exps.TouchY = function (ret, index, layerparam)
    {
        if (this.touches.length>index)
        {
            var layer, oldScale, oldZoomRate, oldParallaxY, oldAngle;

            if (cr.is_undefined(layerparam))
            {
                // calculate X position on bottom layer as if its scale were 1.0
                layer = this.runtime.getLayerByNumber(0);
                oldScale = layer.scale;
                oldZoomRate = layer.zoomRate;
                oldParallaxY = layer.parallaxY;
                oldAngle = layer.angle;
                layer.scale = this.runtime.running_layout.scale;
                layer.zoomRate = 1.0;
                layer.parallaxY = 1.0;
                layer.angle = this.runtime.running_layout.angle;
                ret.set_float(layer.canvasToLayer(this.touches[index].x, this.touches[index].y, false));
                layer.scale = oldScale;
                layer.zoomRate = oldZoomRate;
                layer.parallaxY = oldParallaxY;
                layer.angle = oldAngle;
            }
            else
            {
                // use given layer param
                if (cr.is_number(layerparam))
                    layer = this.runtime.getLayerByNumber(layerparam);
                else
                    layer = this.runtime.getLayerByName(layerparam);

                if (layer)
                    ret.set_float(layer.canvasToLayerY(this.touches[index].x, this.touches[index].y, false));
                else
                    ret.set_float(0);
            }
        }
        else
            ret.set_float(0);
    };


    exps.TouchCount = function (ret)
    {
      ret.set_float(this.touches.length);
    };


    exps.AbsoluteX = function (ret)
	{
		if (this.touches.length)
			ret.set_float(this.touches[0].x);
		else
			ret.set_float(0);
	};
	
	exps.AbsoluteY = function (ret)
	{
		if (this.touches.length)
			ret.set_float(this.touches[0].y);
		else
			ret.set_float(0);
	};
	
	exps.Alpha = function (ret)
	{
		if (this.runtime.isAppMobi && this.orient_alpha === 0 && appmobi_accz !== 0)
			ret.set_float(appmobi_accz * 90);
		else
			ret.set_float(this.orient_alpha);
	};
	
	exps.Beta = function (ret)
	{
		if (this.runtime.isAppMobi && this.orient_beta === 0 && appmobi_accy !== 0)
			ret.set_float(appmobi_accy * -90);
		else
			ret.set_float(this.orient_beta);
	};
	
	exps.Gamma = function (ret)
	{
		if (this.runtime.isAppMobi && this.orient_gamma === 0 && appmobi_accx !== 0)
			ret.set_float(appmobi_accx * 90);
		else
			ret.set_float(this.orient_gamma);
	};
	
	exps.AccelerationXWithG = function (ret)
	{
		ret.set_float(this.acc_g_x);
	};
	
	exps.AccelerationYWithG = function (ret)
	{
		ret.set_float(this.acc_g_y);
	};
	
	exps.AccelerationZWithG = function (ret)
	{
		ret.set_float(this.acc_g_z);
	};
	
	exps.AccelerationX = function (ret)
	{
		ret.set_float(this.acc_x);
	};
	
	exps.AccelerationY = function (ret)
	{
		ret.set_float(this.acc_y);
	};
	
	exps.AccelerationZ = function (ret)
	{
		ret.set_float(this.acc_z);
	};
	
}());