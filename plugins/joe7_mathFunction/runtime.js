// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
cr.plugins_.mFunc = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	var pluginProto = cr.plugins_.mFunc.prototype;
		
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
		// Create the texture
		this.texture_img = new Image();
		this.texture_img.src = this.texture_file;
		this.texture_img.cr_filesize = this.texture_filesize;
		
		// Tell runtime to wait for this to load
		this.runtime.wait_for_textures.push(this.texture_img);
		
		//this.pattern = null;
		this.webGL_texture = null;
	};

	/////////////////////////////////////
	// Instance class
	pluginProto.Instance = function(type)
	{
		this.type = type;
		this.runtime = type.runtime;
	};
	
	var instanceProto = pluginProto.Instance.prototype;

	instanceProto.onCreate = function()
	{
		
		this.myRuntimeGraph= ""; // saving the Graph
		this.myRuntimeOffScreenCanvasId= ""; // saving the id of the offscreen canvas
		
		this.myFunctionString= "";
		
		this.returnValue= ""; // for debugging
		
		this.minX = parseFloat(this.properties[0]);
		if (isNaN(this.minX)) this.minX= -5;
		
		this.maxX = parseFloat(this.properties[1]);
		if (isNaN(this.maxX)) this.maxX= 5;
		
		this.minY = parseFloat(this.properties[2]);
		if (isNaN(this.minY)) this.minY= -5;
		
		this.maxY = parseFloat(this.properties[3]);
		if (isNaN(this.maxY)) this.maxY= 5;
		
		this.stepRangeX = parseFloat(this.properties[4]);
		if (this.stepRangeX <= 0) this.stepRangeX= 1;

		this.stepRangeY = parseFloat(this.properties[5]);
		if (this.stepRangeY <= 0) this.stepRangeY= 1;
		
		this.stepXValues = parseFloat(this.properties[6]);
		if (this.stepXValues <= 0) this.stepXValues= 1;
		
		this.strokeWidthAxes = parseFloat(this.properties[7]);
		if (this.strokeWidthAxes <= 0) this.strokeWidthAxes= 1;
		
		this.strokeWidthGraph = parseFloat(this.properties[8]);
		if (this.strokeWidthGraph <= 0) this.strokeWidthGraph= 1;
		
		this.axesColor = this.properties[9];
		this.graphColor = this.properties[10];
		if (this.properties[11] == "true") this.arrowsAxes= true;
		else this.arrowsAxes= false;
		if (this.properties[12] == "true") this.stepTicks= true;
		else this.stepTicks= false;
		if (this.properties[13] == "true") this.stepDigits= true;
		else this.stepDigits= false;
		if (this.properties[14] == "true") this.axesChars= true;
		else this.axesChars= false;
				
		
		this.visible = 1;		// 0=invisible, 1=visible

		this.canvas = document.createElement('canvas');
		this.canvas.width=this.width;
		this.canvas.height=this.height;
		this.ctx = this.canvas.getContext('2d');
		this.ctx.drawImage(this.type.texture_img,0,0,this.width,this.height);
						
	};
	
	instanceProto.draw = function(ctx)
	{	
		ctx.save();
		
		ctx.globalAlpha = this.opacity;
	
		var myx = this.x;
		var myy = this.y;
		
		if (this.runtime.pixel_rounding)
		{
			myx = Math.round(myx);
			myy = Math.round(myy);
		}
		
		ctx.translate(myx, myy);
		ctx.rotate(this.angle);
				
		ctx.drawImage(this.canvas,
						  0 - (this.hotspotX * this.width),
						  0 - (this.hotspotY * this.height),
						  this.width,
						  this.height);
		ctx.restore();
	};
	
	instanceProto.drawGL = function(glw)
	{
		var tex=glw.loadTexture(this.canvas, false, this.runtime.linearSampling);
		glw.setTexture(tex);
		glw.setOpacity(this.opacity);

		var q = this.bquad;
		
		if (this.runtime.pixel_rounding)
		{
			var ox = Math.round(this.x) - this.x;
			var oy = Math.round(this.y) - this.y;
			
			glw.quad(q.tlx + ox, q.tly + oy, q.trx + ox, q.try_ + oy, q.brx + ox, q.bry + oy, q.blx + ox, q.bly + oy);
		}
		else
			glw.quad(q.tlx, q.tly, q.trx, q.try_, q.brx, q.bry, q.blx, q.bly);
		glw.deleteTexture(tex);
	};

	instanceProto.ClearStage= function ()
	{
		this.canvas = document.createElement('canvas');
		this.canvas.width=this.width;
		this.canvas.height=this.height;
		this.ctx = this.canvas.getContext('2d');
	}
	//////////////////////////////////////
	// Conditions
	pluginProto.cnds = {};
	var cnds = pluginProto.cnds;
	
	//////////////////////////////////////
	// Actions
	pluginProto.acts = {};
	var acts = pluginProto.acts;

	acts.StepRangX = function (stepRangeX)
	{
		try 
		{
			this.ClearStage();
			if (stepRangeX > 0) this.stepRangeX= stepRangeX;
			else this.stepRangeX= 1;
		
					
			loadObj(this.canvas,this.minX, this.maxX, this.minY, this.maxY, this.stepRangeX, this.stepRangeY, this.stepXValues, this.strokeWidthAxes, this.strokeWidthGraph, this.axesColor, this.graphColor , this.arrowsAxes, this.stepTicks, this.stepDigits, this.axesChars, this.myFunctionString); 
			
			this.runtime.redraw = true;
			this.myRuntimeGraph= getCurrentGraph();
			this.myRuntimeOffScreenCanvasId= getOffscreenCanvasId();
					
		} 
		catch(err)
		{
			this.returnValue= err;
        }		
	};
	acts.StepRangY = function (stepRangeY)
	{
		try 
		{
			this.ClearStage();
			if (stepRangeY > 0) this.stepRangeY= stepRangeY;
			else this.stepRangeY= 1;
			
			loadObj(this.canvas,this.minX, this.maxX, this.minY, this.maxY, this.stepRangeX, this.stepRangeY, this.stepXValues, this.strokeWidthAxes, this.strokeWidthGraph, this.axesColor, this.graphColor, this.arrowsAxes, this.stepTicks, this.stepDigits, this.axesChars,this.myFunctionString); 
			this.runtime.redraw = true;
			this.myRuntimeGraph= getCurrentGraph();
			this.myRuntimeOffScreenCanvasId= getOffscreenCanvasId();
		} 
		catch(err)
		{
			this.returnValue= err;
        }
	};
	
	acts.SetMaxX = function (maxX)
	{
		try 
		{
			this.ClearStage();
			this.maxX= maxX;
					
			loadObj(this.canvas,this.minX, this.maxX, this.minY, this.maxY, this.stepRangeX, this.stepRangeY, this.stepXValues, this.strokeWidthAxes, this.strokeWidthGraph, this.axesColor, this.graphColor , this.arrowsAxes, this.stepTicks, this.stepDigits, this.axesChars, this.myFunctionString); 
			
			this.runtime.redraw = true;
			this.myRuntimeGraph= getCurrentGraph();
			this.myRuntimeOffScreenCanvasId= getOffscreenCanvasId();
					
		} 
		catch(err)
		{
			this.returnValue= err;
        }		
	};
	acts.SetMinX = function (minX)
	{
		try 
		{
			this.ClearStage();
			this.minX= minX;
					
			loadObj(this.canvas,this.minX, this.maxX, this.minY, this.maxY, this.stepRangeX, this.stepRangeY, this.stepXValues, this.strokeWidthAxes, this.strokeWidthGraph, this.axesColor, this.graphColor , this.arrowsAxes, this.stepTicks, this.stepDigits, this.axesChars, this.myFunctionString); 
			
			this.runtime.redraw = true;
			this.myRuntimeGraph= getCurrentGraph();
			this.myRuntimeOffScreenCanvasId= getOffscreenCanvasId();
					
		} 
		catch(err)
		{
			this.returnValue= err;
        }		
	};
	acts.SetMaxY = function (maxY)
	{
		try 
		{
			this.ClearStage();
			this.maxY= maxY;
					
			loadObj(this.canvas,this.minX, this.maxX, this.minY, this.maxY, this.stepRangeX, this.stepRangeY, this.stepXValues, this.strokeWidthAxes, this.strokeWidthGraph, this.axesColor, this.graphColor , this.arrowsAxes, this.stepTicks, this.stepDigits, this.axesChars, this.myFunctionString); 
			
			this.runtime.redraw = true;
			this.myRuntimeGraph= getCurrentGraph();
			this.myRuntimeOffScreenCanvasId= getOffscreenCanvasId();
					
		} 
		catch(err)
		{
			this.returnValue= err;
        }		
	};
	acts.SetMinY = function (minY)
	{
		try 
		{
			this.ClearStage();
			this.minY= minY;
					
			loadObj(this.canvas,this.minX, this.maxX, this.minY, this.maxY, this.stepRangeX, this.stepRangeY, this.stepXValues, this.strokeWidthAxes, this.strokeWidthGraph, this.axesColor, this.graphColor , this.arrowsAxes, this.stepTicks, this.stepDigits, this.axesChars, this.myFunctionString); 
			
			this.runtime.redraw = true;
			this.myRuntimeGraph= getCurrentGraph();
			this.myRuntimeOffScreenCanvasId= getOffscreenCanvasId();
					
		} 
		catch(err)
		{
			this.returnValue= err;
        }		
	};
	
	
	acts.GraphStrokeWidth = function ( strokeWidth )
	{
		var tempNumber= parseFloat(strokeWidth)
		if ( (isNaN(tempNumber)) || (tempNumber <= 0) ) this.strokeWidthGraph= 1;
		else this.strokeWidthGraph= tempNumber;
	}
	acts.GraphColor = function ( colorString )
	{
		this.graphColor= colorString;
	}
	
	acts.GraphColor = function ( color )
	{
		this.graphColor= color;
	}
	
	acts.ClearDrawing = function ()
	{	
		this.ClearStage();
		this.runtime.redraw = true;
	}
	
	acts.GetDrawing = function ()
	{
		copy2Canvas(this.myRuntimeOffScreenCanvasId,this.canvas); 
		this.runtime.redraw = true;
	}
	acts.DrawGraph = function ( functionString )
	{
		try 
		{
			this.myFunctionString= functionString;
		
			loadObj(this.canvas,this.minX, this.maxX, this.minY, this.maxY, this.stepRangeX, this.stepRangeY, this.stepXValues, this.strokeWidthAxes, this.strokeWidthGraph, this.axesColor, this.graphColor, this.arrowsAxes, this.stepTicks, this.stepDigits, this.axesChars, this.myFunctionString); 
			
			this.runtime.redraw = true;
			this.myRuntimeGraph= getCurrentGraph();
			this.myRuntimeOffScreenCanvasId= getOffscreenCanvasId();
		}
		catch(err)
		{
			this.returnValue= err;
        }	
	};

	
	//////////////////////////////////////
	// Expressions
	pluginProto.exps = {};
	var exps = pluginProto.exps;
	
}());