// ECMAScript 5 strict mode
"use strict";



assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

// global var please !!!	

var x_speed=0;
var y_speed=0;
var mycan;
var my2dstarfield;
var st_basecol,nbrs;
var shape = [];
/////////////////////////////////////
// Plugin class
cr.plugins_.c2dstarfieldshape = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	var pluginProto = cr.plugins_.c2dstarfieldshape.prototype;
		
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
	};
	
	var instanceProto = pluginProto.Instance.prototype;

	var fxNames = [ "lighter",
					"xor",
					"copy",
					"destination-over",
					"source-in",
					"destination-in",
					"source-out",
					"destination-out",
					"source-atop",
					"destination-atop"];

	instanceProto.effectToCompositeOp = function(effect)
	{
		// (none) = source-over
		if (effect <= 0 || effect >= 11)
			return "source-over";
			
		// (none)|Additive|XOR|Copy|Destination over|Source in|Destination in|Source out|Destination out|Source atop|Destination atop
		return fxNames[effect - 1];	// not including "none" so offset by 1
	};
	
	instanceProto.updateBlend = function(effect)
	{
		var gl = this.runtime.gl;
		
		if (!gl)
			return;
			
		// default alpha blend
		this.srcBlend = gl.ONE;
		this.destBlend = gl.ONE_MINUS_SRC_ALPHA;
		
		switch (effect) {
		case 1:		// lighter (additive)
			this.srcBlend = gl.ONE;
			this.destBlend = gl.ONE;
			break;
		case 2:		// xor
			break;	// todo
		case 3:		// copy
			this.srcBlend = gl.ONE;
			this.destBlend = gl.ZERO;
			break;
		case 4:		// destination-over
			this.srcBlend = gl.ONE_MINUS_DST_ALPHA;
			this.destBlend = gl.ONE;
			break;
		case 5:		// source-in
			this.srcBlend = gl.DST_ALPHA;
			this.destBlend = gl.ZERO;
			break;
		case 6:		// destination-in
			this.srcBlend = gl.ZERO;
			this.destBlend = gl.SRC_ALPHA;
			break;
		case 7:		// source-out
			this.srcBlend = gl.ONE_MINUS_DST_ALPHA;
			this.destBlend = gl.ZERO;
			break;
		case 8:		// destination-out
			this.srcBlend = gl.ZERO;
			this.destBlend = gl.ONE_MINUS_SRC_ALPHA;
			break;
		case 9:		// source-atop
			this.srcBlend = gl.DST_ALPHA;
			this.destBlend = gl.ONE_MINUS_SRC_ALPHA;
			break;
		case 10:	// destination-atop
			this.srcBlend = gl.ONE_MINUS_DST_ALPHA;
			this.destBlend = gl.SRC_ALPHA;
			break;
		}	
	};


	
instanceProto.onCreate=function(){this.visible=0===this.properties[5];this.compositeOp=this.effectToCompositeOp(this.properties[1]);this.updateBlend(this.properties[0]);mycan=new canvas(320,240);this.canvas=mycan.canvas;this.canvas.width=this.width;this.canvas.height=this.height;this.ctx=mycan.canvas.getContext("2d");x_speed=this.properties[1];y_speed=this.properties[2];nbrs=this.properties[3];shape[0]=new image(this.properties[4]);my2dstarfield=new starfield2D_img(mycan,shape,[{nb:.3*nbrs,speedy:.2,
speedx:.2,size:3,params:0},{nb:.25*nbrs,speedy:.4,speedx:.4,size:6,params:0},{nb:.15*nbrs,speedy:.8,speedx:.8,size:9,params:0},{nb:.15*nbrs,speedy:1.2,speedx:1.2,size:12,params:0},{nb:.08*nbrs,speedy:1.6,speedx:1.6,size:15,params:0},{nb:.04*nbrs,speedy:2,speedx:2,size:18,params:0},{nb:.02*nbrs,speedy:2.5,speedx:2.5,size:21,params:0},{nb:.01*nbrs,speedy:4,speedx:4,size:24,params:0}]);this.runtime.tickMe(this)};
		
	
instanceProto.tick=function(){mycan.clear();my2dstarfield.draw();this.update_tex=this.runtime.redraw=!0};

 

   
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
            "canvas_w":this.canvas.width,
            "canvas_h":this.canvas.height,
            "image":this.ctx.getImageData(0,0,this.canvas.width,this.canvas.height).data
			// e.g.
			//"myValue": this.myValue
		};
	};
	
	// called when loading the full state of the game
	instanceProto.loadFromJSON = function (o)
	{
        var canvasWidth = this.canvas.width = o["canvas_w"];
        var canvasHeight = this.canvas.height = o["canvas_h"];
        var data = this.ctx.getImageData(0,0,this.canvas.width,this.canvas.height).data;
        for (var y = 0; y < canvasHeight; ++y) {
            for (var x = 0; x < canvasWidth; ++x) {
                var index = (y * canvasWidth + x)*4;
                for (var c = 0; c < 4; ++c)
                data[index+c] = o["image"][index+c];
            }
        }
	 
	};
	
	
	
	
	instanceProto.draw = function(ctx)
	{	
		ctx.save();
		
		ctx.globalAlpha = this.opacity;
		ctx.globalCompositeOperation = this.compositeOp;
		
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
		
		glw.setBlend(this.srcBlend, this.destBlend);
        if (this.update_tex)
        {
            if (this.tex)
                glw.deleteTexture(this.tex);
            this.tex=glw.loadTexture(this.canvas, false, this.runtime.linearSampling);
            this.update_tex = false;
        }
		glw.setTexture(this.tex);
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
				
	};




	//////////////////////////////////////
	// Conditions
	pluginProto.cnds = {};
	var cnds = pluginProto.cnds;
	
	//////////////////////////////////////
	// Actions
	function Acts() {};
	pluginProto.acts = new Acts();
	 Acts.prototype.SetEffect = function (effect)
	 {	
		 this.compositeOp = this.effectToCompositeOp(effect);
		 this.runtime.redraw = true;
         this.update_tex = true;
	 };
		
	 
	Acts.prototype.SetSpeed = function (spd)
	{
	x_speed=spd;
		
	};
	Acts.prototype.SetYSpeed = function (spd)
	{
	y_speed=spd;
	};
 
    Acts.prototype.LoadShape = function (shp)
	{
	shape[0]=new image(shp);
	};
	
	
	// Acts.prototype.SbaseColor = function (col)
	// {
	// for(var i=0;i<nbrs;i++)
	// {
	  // my2dstarfield.stars[i].color=col;
		// st_basecol=col;
	// }	
	//st_basecol=col;
	
	// this.runtime.redraw = true;
    // this.update_tex = true;
		// console.log(col);
	// };
	
	
	
	//////////////////////////////////////
	// Expressions
	pluginProto.exps = {};
	var exps = pluginProto.exps;
	
		
    
    exps.AsJSON = function(ret)
    {
        ret.set_string( JSON.stringify({
			"c2array": true,
			"size": [1, 1, this.canvas.width * this.canvas.height * 4],
			"data": [[this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height).data]]
		}));
    };

}());

 

function canvas(l,m,p){this.width=l;this.height=m;this.canvas;this.contex;this.canvas=document.createElement("canvas");this.canvas.setAttribute("width",l);this.canvas.setAttribute("height",m);this.contex=this.canvas.getContext("2d");this.handley=this.handlex=0;this.midhandled=!1;this.tilestart=this.tileh=this.tilew=0;this.fill=function(a){var b=this.contex.fillStyle,c=this.contex.globalAlpha;this.contex.globalAlpha=1;this.contex.fillStyle=a;this.contex.fillRect(0,0,this.canvas.width,this.canvas.height);
this.contex.fillStyle=b;this.contex.globalAlpha=c};this.clear=function(){this.contex.clearRect(0,0,this.canvas.width,this.canvas.height)};this.plot=function(a,b,c,e){var d=this.contex.fillStyle;this.contex.fillStyle=e;this.contex.fillRect(a,b,c,c);this.contex.fillStyle=d};this.line=function(a,b,c,e,d,g){var f=this.contex.strokeStyle;this.contex.strokeStyle=g;this.contex.lineWidth=d;this.contex.beginPath();this.contex.moveTo(a,b);this.contex.lineTo(c,e);this.contex.stroke();this.contex.closePath();
this.contex.strokeStyle=f};this.triangle=function(a,b,c,e,d,g,f){this.contex.beginPath();this.contex.moveTo(a,b);this.contex.lineTo(c,e);this.contex.lineTo(d,g);this.contex.closePath();this.contex.fillStyle=f;this.contex.fill()};this.quad=function(a,b,c,e,d,g,f,k,h){var n=this.contex.fillStyle;5==arguments.length?(this.contex.fillStyle=d,this.contex.fillRect(a,b,c,e)):(this.contex.beginPath(),this.contex.moveTo(a,b),this.contex.lineTo(c,e),this.contex.lineTo(d,g),this.contex.lineTo(f,k),this.contex.closePath(),
this.contex.fillStyle=h,this.contex.fill());this.contex.fillStyle=n};this.initTile=function(a,b,c){this.tileh=b;this.tilew=a;"undefined"!=typeof c&&(this.tilestart=c)};this.draw=function(a,b,c,e,d,g,f){var k=a.contex.globalAlpha;"undefined"==typeof e&&(e=1);a.contex.globalAlpha=e;3==arguments.length||4==arguments.length?a.contex.drawImage(this.canvas,b-this.handlex,c-this.handley):(5==arguments.length?(a.contex.translate(b,c),a.contex.rotate(d*Math.PI/180)):(a.contex.translate(b,c),a.contex.rotate(d*
Math.PI/180),a.contex.scale(g,f)),a.contex.translate(-this.handlex,-this.handley),a.contex.drawImage(this.canvas,0,0),a.contex.setTransform(1,0,0,1,0,0));a.contex.globalAlpha=k};this.drawTile=function(a,b,c,e,d,g,f,k){var h=a.contex.globalAlpha;"undefined"==typeof d&&(d=1);a.contex.globalAlpha=d;this.drawPart(a,c,e,Math.floor(b%(this.canvas.width/this.tilew))*this.tilew,Math.floor(b/(this.canvas.width/this.tilew))*this.tileh,this.tilew,this.tileh,d,g,f,k);a.contex.globalAlpha=h};this.drawPart=function(a,
b,c,e,d,g,f,k,h,n,l){if(!(0>=g||0>=f)){var m=a.contex.globalAlpha;"undefined"==typeof k&&(k=1);a.contex.globalAlpha=k;7==arguments.length||8==arguments.length?a.contex.translate(b,c):9==arguments.length?(a.contex.translate(b,c),a.contex.rotate(h*Math.PI/180)):(a.contex.translate(b,c),a.contex.rotate(h*Math.PI/180),a.contex.scale(n,l));1==this.midhandled?a.contex.translate(-g/2,-f/2):a.contex.translate(-this.handlex,-this.handley);a.contex.drawImage(this.canvas,e,d,g,f,0,0,g,f);a.contex.setTransform(1,
0,0,1,0,0);a.contex.globalAlpha=m}};this.setmidhandle=function(){this.handlex=parseInt(this.canvas.width/2);this.handley=parseInt(this.canvas.height/2);this.midhandled=!0};this.sethandle=function(a,b){this.handlex=a;this.handley=b;this.midhandled=!1};this.print=function(a,b,c,e,d,g,f,k){for(var h=0;h<b.length;h++)"undefined"!=typeof f?this.drawTile(a,b[h].charCodeAt(0)-this.tilestart,c+h*this.tilew*f,e,d,g,f,k):this.drawTile(a,b[h].charCodeAt(0)-this.tilestart,c+h*this.tilew,e,d,g,f,k)};return this}
;


 
function image(l){this.img=new Image;this.img.src=l;this.handley=this.handlex=0;this.midhandled=!1;this.tilestart=this.tileh=this.tilew=0;this.initTile=function(a,b,c){this.tileh=b;this.tilew=a;"undefined"!=typeof c&&(this.tilestart=c)};this.draw=function(a,b,c,g,d,h,e){var k=a.contex.globalAlpha;"undefined"==typeof g&&(g=1);a.contex.globalAlpha=g;3==arguments.length||4==arguments.length?a.contex.drawImage(this.img,b-this.handlex,c-this.handley):(5==arguments.length?(a.contex.translate(b,c),a.contex.rotate(d*
Math.PI/180)):(a.contex.translate(b,c),a.contex.rotate(d*Math.PI/180),a.contex.scale(h,e)),a.contex.translate(-this.handlex,-this.handley),a.contex.drawImage(this.img,0,0),a.contex.setTransform(1,0,0,1,0,0));a.contex.globalAlpha=k};this.drawTile=function(a,b,c,g,d,h,e,k){var f=a.contex.globalAlpha;"undefined"==typeof d&&(d=1);a.contex.globalAlpha=d;this.drawPart(a,c,g,Math.floor(b%(this.img.width/this.tilew))*this.tilew,Math.floor(b/(this.img.width/this.tilew))*this.tileh,this.tilew,this.tileh,d,
h,e,k);a.contex.globalAlpha=f};this.drawPart=function(a,b,c,g,d,h,e,k,f,l,m){var n=a.contex.globalAlpha;"undefined"==typeof k&&(k=1);a.contex.globalAlpha=k;7==arguments.length||8==arguments.length?a.contex.translate(b,c):9==arguments.length?(a.contex.translate(b,c),a.contex.rotate(f*Math.PI/180)):(a.contex.translate(b,c),a.contex.rotate(f*Math.PI/180),a.contex.scale(l,m));1==this.midhandled?a.contex.translate(-h/2,-e/2):a.contex.translate(-this.handlex,-this.handley);a.contex.drawImage(this.img,g,
d,h,e,null,null,h,e);a.contex.setTransform(1,0,0,1,0,0);a.contex.globalAlpha=n};this.setmidhandle=function(){this.handlex=parseInt(this.img.width/2);this.handley=parseInt(this.img.height/2);this.midhandled=!0};this.sethandle=function(a,b){this.handlex=a;this.handley=b;this.midhandled=!1};this.print=function(a,b,c,g,d,h,e,k){for(var f=0;f<b.length;f++)"undefined"!=typeof e?this.drawTile(a,b[f].charCodeAt(0)-this.tilestart,c+f*this.tilew*e,g,d,h,e,k):this.drawTile(a,b[f].charCodeAt(0)-this.tilestart,
c+f*this.tilew,g,d,h,e,k)};return this};


function starfield2D_img(d,b,c){this.dst=d;this.stars=[];this.img=b;for(b=d=0;b<c.length;b++)for(var e=0;e<c[b].nb;e++)this.stars[d]={x:Math.random()*this.dst.canvas.width,y:Math.random()*this.dst.canvas.height,speedx:c[b].speedx,speedy:c[b].speedy,size:c[b].size,params:c[b].params},d++;this.draw=function(){for(var a=0;a<this.stars.length;a++)this.dst.contex.drawImage(this.img[this.stars[a].params].img,this.stars[a].x,this.stars[a].y,this.stars[a].size,this.stars[a].size),this.stars[a].x+=this.stars[a].speedx*
x_speed,this.stars[a].y+=this.stars[a].speedy*y_speed,this.stars[a].x>this.dst.canvas.width&&(this.stars[a].x=0),0>this.stars[a].x&&(this.stars[a].x=this.dst.canvas.width),this.stars[a].y>this.dst.canvas.height&&(this.stars[a].y=0),0>this.stars[a].y&&(this.stars[a].y=this.dst.canvas.height)}};

