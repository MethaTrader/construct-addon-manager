﻿// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
cr.plugins_.DropShadowText = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	var pluginProto = cr.plugins_.DropShadowText.prototype;

	pluginProto.onCreate = function ()
	{
		// Override the 'set width' action
		pluginProto.acts.SetWidth = function (w)
		{
			if (this.width !== w)
			{
				this.width = w;
				this.text_changed = true;	// also recalculate text wrapping
				this.set_bbox_changed();
			}
		};
	};

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
	
	typeProto.onLostWebGLContext = function ()
	{
		if (this.is_family)
			return;
			
		var i, len, inst;
		for (i = 0, len = this.instances.length; i < len; i++)
		{
			inst = this.instances[i];
			inst.mycanvas = null;
			inst.myctx = null;
			inst.mytex = null;
		}
	};

	/////////////////////////////////////
	// Instance class
	pluginProto.Instance = function(type)
	{
		this.type = type;
		this.runtime = type.runtime;
		this.lines = [];		// for word wrapping
		this.text_changed = true;
	};
	
	var instanceProto = pluginProto.Instance.prototype;

	var requestedWebFonts = {};		// already requested web fonts have an entry here
	
	instanceProto.onCreate = function()
	{
		this.text = this.properties[0];
		this.visible = (this.properties[1] === 0);		// 0=visible, 1=invisible
		
		// "[bold|italic] 12pt Arial"
		this.font = this.properties[2];
		
		this.color = this.properties[3];
		this.halign = this.properties[4];				// 0=left, 1=center, 2=right
		this.valign = this.properties[5];				// 0=top, 1=center, 2=bottom
		
		this.wrapbyword = (this.properties[7] === 0);	// 0=word, 1=character
		this.lastwidth = this.width;
		this.lastwrapwidth = this.width;
		this.lastheight = this.height;
		
		this.line_height_offset = this.properties[8];
		
		this.dropShadowOffsetX = this.properties[9];
		this.dropShadowOffsetY = this.properties[10];
		this.dropShadowColor = this.properties[11];
		this.dropShadowBlur = this.properties[12];
		
		// Get the font height in pixels.
		// Look for token ending "NNpt" in font string (e.g. "bold 12pt Arial").
		this.facename = "";
		this.fontstyle = "";
		var arr = this.font.split(" ");
		this.ptSize = 0;
		this.textWidth = 0;
		this.textHeight = 0;
		
		var i;
		for (i = 0; i < arr.length; i++)
		{
			// Ends with 'pt'
			if (arr[i].substr(arr[i].length - 2, 2) === "pt")
			{
				this.ptSize = parseInt(arr[i].substr(0, arr[i].length - 2));
				this.pxHeight = Math.ceil((this.ptSize / 72.0) * 96.0) + 4;	// assume 96dpi...
				
				this.facename = arr[i + 1];
				
				if (i > 0)
					this.fontstyle = arr[i - 1];
					
				break;
			}
		}
		
		// For WebGL rendering
		this.mycanvas = null;
		this.myctx = null;
		this.mytex = null;
		this.need_text_redraw = false;
		this.rcTex = new cr.rect(0, 0, 1, 1);
		
		assert2(this.pxHeight, "Could not determine font text height");
	};
	
	instanceProto.onDestroy = function ()
	{
		// Remove references to allow GC to collect and save memory
		this.myctx = null;
		this.mycanvas = null;
		
		if (this.runtime.glwrap && this.mytex)
			this.runtime.glwrap.deleteTexture(this.mytex);
		
		this.mytex = null;
	};
	
	instanceProto.updateFont = function ()
	{
		this.font = this.fontstyle + " " + this.ptSize.toString() + "pt " + this.facename;
		this.text_changed = true;
		this.runtime.redraw = true;
	};

	instanceProto.draw = function(ctx, glmode)
	{
		ctx.font = this.font;
		ctx.textBaseline = "top";
		ctx.fillStyle = this.color;
		
		ctx.globalAlpha = glmode ? 1 : this.opacity;

		var myscale = 1;
		
		if (glmode)
		{
			myscale = this.layer.getScale();
			ctx.save();
			ctx.scale(myscale, myscale);
		}
		
		// If text has changed, run the word wrap.
		if (this.text_changed || this.width !== this.lastwrapwidth)
		{
			this.type.plugin.WordWrap(this.text, this.lines, ctx, this.width, this.wrapbyword);
			this.text_changed = false;
			this.lastwrapwidth = this.width;
		}
		
		// Draw each line after word wrap
		this.update_bbox();
		var penX = glmode ? 0 : this.bquad.tlx;
		var penY = glmode ? 0 : this.bquad.tly;
		
		if (this.runtime.pixel_rounding)
		{
			penX = (penX + 0.5) | 0;
			penY = (penY + 0.5) | 0;
		}
		
		if (this.angle !== 0 && !glmode)
		{
			ctx.save();
			ctx.translate(penX, penY);
			ctx.rotate(this.angle);
			penX = 0;
			penY = 0;
		}
		
		var endY = penY + this.height;
		var line_height = this.pxHeight;
		line_height += (this.line_height_offset * this.runtime.devicePixelRatio);
		var drawX;
		var i;
		var drawY;
		
		// Adjust penY for vertical alignment
		if (this.valign === 1)		// center
			penY += Math.max(this.height / 2 - (this.lines.length * line_height) / 2, 0);
		else if (this.valign === 2)	// bottom
			penY += Math.max(this.height - (this.lines.length * line_height) - 2, 0);
		
		
		if(!glmode)
			ctx.save();
		ctx.shadowOffsetX = this.dropShadowOffsetX;
		ctx.shadowOffsetY = this.dropShadowOffsetY;
		ctx.shadowBlur = this.dropShadowBlur;
		ctx.shadowColor = this.dropShadowColor;
		
		
		for (i = 0; i < this.lines.length; i++)
		{
			// Adjust the line draw position depending on alignment
			drawX = penX;
			drawY = penY;
			
			if (this.halign === 1) {	// center
				drawX = penX + (this.width - this.lines[i].width) / 2;
			}
			else if (this.halign === 2)	{// right
				drawX = penX + (this.width - this.lines[i].width);
			}
			if(glmode) {
				drawX += this.dropShadowOffsetX < 0 ? Math.floor(Math.abs(this.dropShadowOffsetX) + this.dropShadowBlur) : 0;
				drawY += this.dropShadowOffsetY < 0 ? Math.abs(this.dropShadowOffsetY) + this.dropShadowBlur : 0;
			}
			
			//console.log("drawX: " + drawX);
			
			ctx.fillText(this.lines[i].text, drawX, drawY);
			penY += line_height;
			
			if (penY >= endY - line_height)
				break;
		}
		
		//ctx.restore();
		
		//if (this.angle !== 0 || glmode)
			ctx.restore();
	};
	
	instanceProto.drawGL = function(glw)
	{
		if (this.width < 1 || this.height < 1)
			return;
		
		var need_redraw = this.text_changed || this.need_text_redraw;
		this.need_text_redraw = false;
		var layer_scale = this.layer.getScale();
		var layer_angle = this.layer.getAngle();
		var rcTex = this.rcTex;
		

		// Calculate size taking in to account scale
		var floatscaledwidth = layer_scale * (this.width + Math.abs(this.dropShadowOffsetX));
		var floatscaledheight = layer_scale * (this.height + Math.abs(this.dropShadowOffsetY));
		var scaledwidth = Math.ceil(floatscaledwidth);
		var scaledheight = Math.ceil(floatscaledheight);
		
		var windowWidth = this.runtime.width;
		var windowHeight = this.runtime.height;
		var halfw = windowWidth / 2;
		var halfh = windowHeight / 2;
		
		// Create 2D context for this instance if not already
		if (!this.myctx)
		{
			this.mycanvas = document.createElement("canvas");
			this.mycanvas.width = scaledwidth;
			this.mycanvas.height = scaledheight;
			this.lastwidth = scaledwidth;
			this.lastheight = scaledheight;
			need_redraw = true;
			this.myctx = this.mycanvas.getContext("2d");
		}
		

		// Update size if changed
		if (scaledwidth !== this.lastwidth || scaledheight !== this.lastheight)
		{
			this.mycanvas.width = scaledwidth;
			this.mycanvas.height = scaledheight;
			
			if (this.mytex)
			{
				glw.deleteTexture(this.mytex);
				this.mytex = null;
			}
			
			need_redraw = true;
		}
		
		// Need to update the GL texture
		if (need_redraw)
		{
			// Draw to my context
			this.myctx.clearRect(0, 0, scaledwidth, scaledheight);
			this.draw(this.myctx, true);
			
			// Create GL texture if none exists
			if (!this.mytex)
				this.mytex = glw.createEmptyTexture(scaledwidth, scaledheight, this.runtime.linearSampling);
				
			// Copy context to GL texture
			glw.videoToTexture(this.mycanvas, this.mytex);
		}
		
		this.lastwidth = scaledwidth;
		this.lastheight = scaledheight;
		
		// Draw GL texture
		glw.setTexture(this.mytex);
		glw.setOpacity(this.opacity);
		
		glw.resetModelView();
		glw.translate(-halfw, -halfh);
		glw.updateModelView();
		
		var q = this.bquad;
		
		var tlx = this.layer.layerToCanvas(q.tlx, q.tly, true);
		var tly = this.layer.layerToCanvas(q.tlx, q.tly, false);
		var trx = this.layer.layerToCanvas(q.trx, q.try_, true);
		var try_ = this.layer.layerToCanvas(q.trx, q.try_, false);
		var brx = this.layer.layerToCanvas(q.brx, q.bry, true);
		var bry = this.layer.layerToCanvas(q.brx, q.bry, false);
		var blx = this.layer.layerToCanvas(q.blx, q.bly, true);
		var bly = this.layer.layerToCanvas(q.blx, q.bly, false);
		
		
		tlx += this.dropShadowOffsetX < 0 ? this.dropShadowOffsetX - this.dropShadowBlur: 0;
		tlx = tlx < 0 ? tlx - 1 : tlx;
		tly += this.dropShadowOffsetY < 0 ? this.dropShadowOffsetY - this.dropShadowBlur: 0;
		tly = tly < 0 ? tly - 1 : tly;
		
		//console.log("tlx: " + tlx);
		
		if (this.runtime.pixel_rounding || (this.angle === 0 && layer_angle === 0))
		{
			var ox = ((tlx + 0.5) | 0) - tlx;
			var oy = ((tly + 0.5) | 0) - tly
			
			tlx += ox;
			tly += oy;
			trx += ox;
			try_ += oy;
			brx += ox;
			bry += oy;
			blx += ox;
			bly += oy;
		}
		
		if (this.angle === 0 && layer_angle === 0)
		{
			trx = tlx + scaledwidth;
			try_ = tly;
			brx = trx;
			bry = tly + scaledheight;
			blx = tlx;
			bly = bry;
			rcTex.right = 1;
			rcTex.bottom = 1;
		}
		else
		{
			rcTex.right = floatscaledwidth / scaledwidth;
			rcTex.bottom = floatscaledheight / scaledheight;
		}

		glw.quadTex(tlx, tly, trx, try_, brx, bry, blx, bly, rcTex);
		
		glw.resetModelView();
		glw.scale(layer_scale, layer_scale);
		glw.rotateZ(-this.layer.getAngle());
		glw.translate((this.layer.viewLeft + this.layer.viewRight) / -2, (this.layer.viewTop + this.layer.viewBottom) / -2);
		glw.updateModelView();
	};
	
	var wordsCache = [];

	pluginProto.TokeniseWords = function (text)
	{
		wordsCache.length = 0;
		var cur_word = "";
		var ch;
		
		// Loop every char
		var i = 0;
		
		while (i < text.length)
		{
			ch = text.charAt(i);
			
			if (ch === "\n")
			{
				// Dump current word if any
				if (cur_word.length)
				{
					wordsCache.push(cur_word);
					cur_word = "";
				}
				
				// Add newline word
				wordsCache.push("\n");
				
				++i;
			}
			// Whitespace or hyphen: swallow rest of whitespace and include in word
			else if (ch === " " || ch === "\t" || ch === "-")
			{
				do {
					cur_word += text.charAt(i);
					i++;
				}
				while (i < text.length && (text.charAt(i) === " " || text.charAt(i) === "\t"));
				
				wordsCache.push(cur_word);
				cur_word = "";
			}
			else if (i < text.length)
			{
				cur_word += ch;
				i++;
			}
		}
		
		// Append leftover word if any
		if (cur_word.length)
			wordsCache.push(cur_word);
	};

	pluginProto.WordWrap = function (text, lines, ctx, width, wrapbyword)
	{
		if (!text || !text.length)
		{
			lines.length = 0;
			return;
		}
			
		if (width <= 2.0)
		{
			lines.length = 0;
			return;
		}
		
		// If under 100 characters (i.e. a fairly short string), try a short string optimisation: just measure the text
		// and see if it fits on one line, without going through the tokenise/wrap (which tends to create garbage)
		// Text musn't contain a linebreak!
		if (text.length <= 100 && text.indexOf("\n") === -1)
		{
			var all_width = 0;
			all_width = ctx.measureText(text).width;
			
			if (all_width <= width)
			{
				// fits on one line
				if (lines.length)
					lines.length = 1;
				else
					lines.push({});
					
				lines[0].text = text;
				lines[0].width = all_width;
				return;
			}
		}
			
		this.WrapText(text, lines, ctx, width, wrapbyword);
	};

	pluginProto.WrapText = function (text, lines, ctx, width, wrapbyword)
	{
		var wordArray;
		
		if (wrapbyword)
		{
			this.TokeniseWords(text);	// writes to wordsCache
			wordArray = wordsCache;
		}
		else
			wordArray = text;
			
		var cur_line = "";
		var prev_line;
		var line_width;
		var i;
		var lineIndex = 0;
		var line;
		
		for (i = 0; i < wordArray.length; i++)
		{
			// Look for newline
			if (wordArray[i] === "\n")
			{
				// Flush line.  Recycle a line if possible
				if (lineIndex >= lines.length)
					lines.push({});
					
				line = lines[lineIndex];
				line.text = cur_line;
				line.width = 0;
				line.width = ctx.measureText(cur_line).width;
					
				lineIndex++;
				cur_line = "";
				continue;
			}
			
			// Otherwise add to line
			prev_line = cur_line;
			cur_line += wordArray[i];
			
			// Measure line (no measureText in DC yet)
			line_width = 0;
			line_width = ctx.measureText(cur_line).width;
			
			// Line too long: wrap the line before this word was added
			if (line_width >= width)
			{
				// Append the last line's width to the string object
				if (lineIndex >= lines.length)
					lines.push({});
					
				line = lines[lineIndex];
				line.text = prev_line;
				line.width = 0;
				line.width = ctx.measureText(prev_line).width;
					
				lineIndex++;
				cur_line = wordArray[i];
				
				// Wrapping by character: avoid lines starting with spaces
				if (!wrapbyword && cur_line === " ")
					cur_line = "";
			}
		}
		
		// Add any leftover line
		if (cur_line.length)
		{
			if (lineIndex >= lines.length)
				lines.push({});
				
			line = lines[lineIndex];
			line.text = cur_line;
			line.width = 0;
			line.width = ctx.measureText(cur_line).width;
				
			lineIndex++;
		}
		
		// truncate lines to the number that were used
		lines.length = lineIndex;
	};

	//////////////////////////////////////
	// Conditions
	function Cnds() {};

	Cnds.prototype.CompareText = function(text_to_compare, case_sensitive)
	{
		if (case_sensitive)
			return this.text == text_to_compare;
		else
			return this.text.toLowerCase() == text_to_compare.toLowerCase();
	};
	
	pluginProto.cnds = new Cnds();

	//////////////////////////////////////
	// Actions
	function Acts() {};

	Acts.prototype.SetText = function(param)
	{
		if (cr.is_number(param) && param < 1e9)
			param = Math.round(param * 1e10) / 1e10;	// round to nearest ten billionth - hides floating point errors
		
		var text_to_set = param.toString();
		
		if (this.text !== text_to_set)
		{
			this.text = text_to_set;
			this.text_changed = true;
			this.runtime.redraw = true;
		}
	};
	
	Acts.prototype.AppendText = function(param)
	{
		if (cr.is_number(param))
			param = Math.round(param * 1e10) / 1e10;	// round to nearest ten billionth - hides floating point errors
			
		var text_to_append = param.toString();
		
		if (text_to_append)	// not empty
		{
			this.text += text_to_append;
			this.text_changed = true;
			this.runtime.redraw = true;
		}
	};
	
	Acts.prototype.SetFontFace = function (face_, style_)
	{
		var newstyle = "";
		
		switch (style_) {
		case 1: newstyle = "bold"; break;
		case 2: newstyle = "italic"; break;
		case 3: newstyle = "bold italic"; break;
		}
		
		if (face_ === this.facename && newstyle === this.fontstyle)
			return;		// no change
			
		this.facename = face_;
		this.fontstyle = newstyle;
		this.updateFont();
	};
	
	Acts.prototype.SetFontSize = function (size_)
	{
		if (this.ptSize === size_)
			return;

		this.ptSize = size_;
		this.pxHeight = Math.ceil((this.ptSize / 72.0) * 96.0) + 4;	// assume 96dpi...
		this.updateFont();
	};
	
	Acts.prototype.SetFontColor = function (rgb)
	{
		var newcolor = "rgb(" + cr.GetRValue(rgb).toString() + "," + cr.GetGValue(rgb).toString() + "," + cr.GetBValue(rgb).toString() + ")";
		
		if (newcolor === this.color)
			return;

		this.color = newcolor;
		this.need_text_redraw = true;
		this.runtime.redraw = true;
	};
	
	Acts.prototype.SetWebFont = function (familyname_, cssurl_)
	{
		if (this.runtime.isDomFree)
		{
			cr.logexport("[Construct 2] Text plugin: 'Set web font' not supported on this platform - the action has been ignored");
			return;		// DC todo
		}
		
		var self = this;
		var refreshFunc = (function () {
							self.runtime.redraw = true;
							self.text_changed = true;
						});

		// Already requested this web font?
		if (requestedWebFonts.hasOwnProperty(cssurl_))
		{
			// Use it immediately without requesting again.  Whichever object
			// made the original request will refresh the canvas when it finishes
			// loading.
			var newfacename = "'" + familyname_ + "'";
			
			if (this.facename === newfacename)
				return;	// no change
				
			this.facename = newfacename;
			this.updateFont();
			
			// There doesn't seem to be a good way to test if the font has loaded,
			// so just fire a refresh every 100ms for the first 1 second, then
			// every 1 second after that up to 10 sec - hopefully will have loaded by then!
			for (var i = 1; i < 10; i++)
			{
				setTimeout(refreshFunc, i * 100);
				setTimeout(refreshFunc, i * 1000);
			}
		
			return;
		}
		
		// Otherwise start loading the web font now
		var wf = document.createElement("link");
		wf.href = cssurl_;
		wf.rel = "stylesheet";
		wf.type = "text/css";
		wf.onload = refreshFunc;
					
		document.getElementsByTagName('head')[0].appendChild(wf);
		requestedWebFonts[cssurl_] = true;
		
		this.facename = "'" + familyname_ + "'";
		this.updateFont();
					
		// Another refresh hack
		for (var i = 1; i < 10; i++)
		{
			setTimeout(refreshFunc, i * 100);
			setTimeout(refreshFunc, i * 1000);
		}
		
		log("Requesting web font '" + cssurl_ + "'... (tick " + this.runtime.tickcount.toString() + ")");
	};
	
	
	Acts.prototype.SetDropShadowOffsetX = function (offset_)
	{
		this.dropShadowOffsetX = offset_;
		this.need_text_redraw = true;
		this.runtime.redraw = true;
	}
	
	Acts.prototype.SetDropShadowOffsetY = function (offset_)
	{
		this.dropShadowOffsetY = offset_;
		this.need_text_redraw = true;
		this.runtime.redraw = true;
	}
	
	Acts.prototype.SetDropShadowBlur = function (blur_)
	{
		
		this.dropShadowBlur = blur_ > 0 ? Math.round(blur_) : 0;
		this.need_text_redraw = true;
		this.runtime.redraw = true;
	}
	
	Acts.prototype.SetDropShadowColor = function (rgb)
	{
		var newcolor = "rgb(" + cr.GetRValue(rgb).toString() + "," + cr.GetGValue(rgb).toString() + "," + cr.GetBValue(rgb).toString() + ")";
		
		if (newcolor === this.dropShadowColor)
			return;

		this.dropShadowColor = newcolor;
		this.need_text_redraw = true;
		this.runtime.redraw = true;
	}
	

	pluginProto.acts = new Acts();
	
	//////////////////////////////////////
	// Expressions
	function Exps() {};

	Exps.prototype.Text = function(ret)
	{
		ret.set_string(this.text);
	};
	
	Exps.prototype.FaceName = function (ret)
	{
		ret.set_string(this.facename);
	};
	
	Exps.prototype.FaceSize = function (ret)
	{
		ret.set_int(this.ptSize);
	};
	
	Exps.prototype.TextWidth = function (ret)
	{
		var w = 0;
		var i, len, x;
		for (i = 0, len = this.lines.length; i < len; i++)
		{
			x = this.lines[i].width;
			
			if (w < x)
				w = x;
		}
		
		ret.set_int(w);
	};
	
	Exps.prototype.TextHeight = function (ret)
	{
		ret.set_int(this.lines.length * this.pxHeight);
	};
	
	Exps.prototype.DropShadowX = function (ret)
	{
		ret.set_int(this.dropShadowOffsetX);
	}
	
	Exps.prototype.DropShadowY = function (ret)
	{
		ret.set_int(this.dropShadowOffsetY);
	}
	
	Exps.prototype.DropShadowBlur = function (ret)
	{
		ret.set_int(this.dropShadowBlur);
	}
	
	pluginProto.exps = new Exps();
		
}());