// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
cr.plugins_.sirg_rpgdialog = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	var pluginProto = cr.plugins_.sirg_rpgdialog.prototype;
		
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
		if (this.is_family)
			return;
		
		// Create the texture
		this.texture_img = new Image();
		this.texture_img.cr_filesize = this.texture_filesize;
		
		// Tell runtime to wait for this to load
		this.runtime.waitForImageLoad(this.texture_img, this.texture_file);
		
		this.fillPattern = null;
		this.leftPattern = null;
		this.rightPattern = null;
		this.topPattern = null;
		this.bottomPattern = null;
		
		this.webGL_texture = null;
		this.webGL_fillTexture = null;
		this.webGL_leftTexture = null;
		this.webGL_rightTexture = null;
		this.webGL_topTexture = null;
		this.webGL_bottomTexture = null;
	};
	
	typeProto.onLostWebGLContext = function ()
	{
		if (this.is_family)
			return;
			
		this.webGL_texture = null;
		this.webGL_fillTexture = null;
		this.webGL_leftTexture = null;
		this.webGL_rightTexture = null;
		this.webGL_topTexture = null;
		this.webGL_bottomTexture = null;
	};
	
	typeProto.onRestoreWebGLContext = function ()
	{
		// No need to create textures if no instances exist, will create on demand
		if (this.is_family || !this.instances.length)
			return;
		
		if (!this.webGL_texture)
		{
			this.webGL_texture = this.runtime.glwrap.loadTexture(this.texture_img, true, this.runtime.linearSampling, this.texture_pixelformat);
		}
	};
	
	typeProto.unloadTextures = function ()
	{
		// Don't release textures if any instances still exist, they are probably using them
		if (this.is_family || this.instances.length)
			return;
		
		// WebGL renderer
		if (this.runtime.glwrap)
		{
			this.runtime.glwrap.deleteTexture(this.webGL_texture);
			this.runtime.glwrap.deleteTexture(this.webGL_fillTexture);
			this.runtime.glwrap.deleteTexture(this.webGL_leftTexture);
			this.runtime.glwrap.deleteTexture(this.webGL_rightTexture);
			this.runtime.glwrap.deleteTexture(this.webGL_topTexture);
			this.runtime.glwrap.deleteTexture(this.webGL_bottomTexture);
			
			this.webGL_texture = null;
			this.webGL_fillTexture = null;
			this.webGL_leftTexture = null;
			this.webGL_rightTexture = null;
			this.webGL_topTexture = null;
			this.webGL_bottomTexture = null;
		}
	};
	
	typeProto.slicePatch = function (x1, y1, x2, y2)
	{
		var tmpcanvas = document.createElement("canvas");
		var w = x2 - x1;
		var h = y2 - y1;
		tmpcanvas.width = w;
		tmpcanvas.height = h;
		var tmpctx = tmpcanvas.getContext("2d");
		tmpctx.drawImage(this.texture_img, x1, y1, w, h, 0, 0, w, h);
		return tmpcanvas;
	};
	
	typeProto.createPatch = function (lm, rm, tm, bm)
	{
		var iw = this.texture_img.width;
		var ih = this.texture_img.height;
		var re = iw - rm;
		var be = ih - bm;
		
		if (this.runtime.glwrap)
		{
			if (this.webGL_fillTexture)
				return;		// already created
				
			var glwrap = this.runtime.glwrap;
			var ls = this.runtime.linearSampling;
			var tf = this.texture_pixelformat;
			
			if (re > lm && be > tm)
				this.webGL_fillTexture = glwrap.loadTexture(this.slicePatch(lm, tm, re, be), true, ls, tf);
			
			if (lm > 0 && be > tm)
				this.webGL_leftTexture = glwrap.loadTexture(this.slicePatch(0, tm, lm, be), true, ls, tf, "repeat-y");
			if (rm > 0 && be > tm)
				this.webGL_rightTexture = glwrap.loadTexture(this.slicePatch(re, tm, iw, be), true, ls, tf, "repeat-y");
			if (tm > 0 && re > lm)
				this.webGL_topTexture = glwrap.loadTexture(this.slicePatch(lm, 0, re, tm), true, ls, tf, "repeat-x");
			if (bm > 0 && re > lm)
				this.webGL_bottomTexture = glwrap.loadTexture(this.slicePatch(lm, be, re, ih), true, ls, tf, "repeat-x");
		}
		else
		{
			if (this.fillPattern)
				return;		// already created
			
			var ctx = this.runtime.ctx;
			
			if (re > lm && be > tm)
				this.fillPattern = ctx.createPattern(this.slicePatch(lm, tm, re, be), "repeat");
			
			if (lm > 0 && be > tm)
				this.leftPattern = ctx.createPattern(this.slicePatch(0, tm, lm, be), "repeat");
			if (rm > 0 && be > tm)
				this.rightPattern = ctx.createPattern(this.slicePatch(re, tm, iw, be), "repeat");
			if (tm > 0 && re > lm)
				this.topPattern = ctx.createPattern(this.slicePatch(lm, 0, re, tm), "repeat");
			if (bm > 0 && re > lm)
				this.bottomPattern = ctx.createPattern(this.slicePatch(lm, be, re, ih), "repeat");
		}
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
		this.leftMargin = this.properties[0];
		this.rightMargin = this.properties[1];
		this.topMargin = this.properties[2];
		this.bottomMargin = this.properties[3];
		this.edges = this.properties[4];					// 0=tile, 1=stretch
		this.fill = this.properties[5];						// 0=tile, 1=stretch, 2=transparent
		this.visible = (this.properties[6] === 0);			// 0=visible, 1=invisible
		this.seamless = (this.properties[8] !== 0);			// 1px overdraw to hide seams
		
		if (this.recycled)
			this.rcTex.set(0, 0, 0, 0);
		else
			this.rcTex = new cr.rect(0, 0, 0, 0);
		
		if (this.runtime.glwrap)
		{
			// Create WebGL texture if type doesn't have it yet
			if (!this.type.webGL_texture)
			{
				this.type.webGL_texture = this.runtime.glwrap.loadTexture(this.type.texture_img, false, this.runtime.linearSampling, this.type.texture_pixelformat);
			}
		}
		
		// lazy create patches
		this.type.createPatch(this.leftMargin, this.rightMargin, this.topMargin, this.bottomMargin);

		this.componentSetting = {
			CHAT_CONTAINER_ID:"rpgdialog",
			DIALOGUE_CLASS_NAME:"dialogue",
			DIALOGUE_DATA_ATTRIBUTE_NAME:"data-outgoinglink",
			FINAL_OUTGOING_LINK_TAG:"final",
			END_OF_CONVERSATION_EVENT_NAME:"ConversationIsOver",
			STATEMENT_ELEMENT:"p",
			CHOICE_ELEMENT_CONTAINER:"ul",
			CHOICE_ELEMENT:"li",
			DEBUG_MODE: false
		};

		//make dialogue div
		this.elem = document.createElement("div");
		this.elem.id = this.sparkles_id = "rpgdialog";

		if(this.componentSetting.DEBUG_MODE){
			this.elem.style.border = "1px solid blue"; //for debug
		}
		this.element_hidden = false;
		jQuery(this.elem).appendTo(this.runtime.canvasdiv ? this.runtime.canvasdiv : "body");

		this.lastLeft = 0;
		this.lastTop = 0;
		this.lastRight = 0;
		this.lastBottom = 0;
		this.lastWinWidth = 0;
		this.lastWinHeight = 0;
		this.updatePosition(true);
		
		this.runtime.tickMe(this);
		
		this.data = this.dialogue = this.executeCodeBefore = this.executeCodeAfter = null;
		this.chatContainer = document.getElementById( this.componentSetting.CHAT_CONTAINER_ID );
		var self = this;

	};

	instanceProto.onDestroy = function ()
	{
		if (this.runtime.isDomFree)
			return;
		
		jQuery(this.elem).remove();
		this.elem = null;
	};
	
	instanceProto.tick = function ()
	{
		this.updatePosition();
	};
	
	var last_canvas_offset = null;
	var last_checked_tick = -1;

	/**@
	 * #DialoguesBuilder.setDialogues
	 * Set source data.
	 * 
	 * @param {Object} data
	 * @throw {Error} Data is not valid.
	 * @return {Object} this
	 * 
	 * @see Dialogues Builder tool ( http://kibo.github.com/dialoguesBuilder/ )
	 */
	instanceProto.setDialogues = function(data)
	{
		//if( !this.isValid( data )){
		//	throw new Error("Dialogue data is not valid.");
		//}
		var self = this;
		self.data = data;
		// preload avatars
		for(var idx = 0; idx < self.data["actors"].length; idx++){
			if( self.data["actors"][idx]["avatar"]){
				// Create the texture
				self.texture_img = new Image();
				self.texture_img.cr_filesize = self.texture_filesize;
				
				// Tell runtime to wait for this to load
				//console.log('preload: '+this.data["actors"][idx].avatar);
				self.runtime.waitForImageLoad(self.texture_img, self.data["actors"][idx]["avatar"]);
			}
		}
		return this;
	};

	/**@
	 * #DialoguesBuilder.getDialogues
	 * Get all dialogues.
	 * 
	 * @return {Object} dialogues
	 */
	instanceProto.getDialogues = function()
	{
		return this.data;
	};

	/**@
	* #DialoguesBuilder.setDialog
	* 
	* @trigger ConversationIsOver - when the conversation is at the end
	* @param {Integer} id
	*/
	instanceProto.setDialogue = function(id)
	{
	    	if(this.dialogue){
	    		this.executeCode(this.dialogue["codeAfter"]);
				this.executeCodeAfter = this.dialogue["codeAfter"];
				this.runtime.trigger(cr.plugins_.sirg_rpgdialog.prototype.cnds.OnExecutedCodeAfter, this);
	    	}
	    	if(id == this.componentSetting.FINAL_OUTGOING_LINK_TAG){
				this.runtime.trigger(cr.plugins_.sirg_rpgdialog.prototype.cnds.OnDialogueEnded, this);
	    		this.endOfConversation();
	    		return;
	    	}
	    	for(var idx = 0; idx < this.data["dialogues"].length; idx++){
	    		if( this.data["dialogues"][idx]["id"] == id){
	    			this.dialogue = this.data["dialogues"][idx];
	    			this.executeCode(this.dialogue["codeBefore"]);
					this.executeCodeBefore = this.dialogue["codeBefore"];
					this.runtime.trigger(cr.plugins_.sirg_rpgdialog.prototype.cnds.OnExecutedCodeBefore, this);
	    			if( !this.isActive(this.dialogue)){
	    				this.setDialogue( this.dialogue["isChoice"] || this.dialogue["outgoingLinks"][0] ? 
	    							this.dialogue["outgoingLinks"][0] : 
	    							this.componentSetting.FINAL_OUTGOING_LINK_TAG );
	    			}
	    			return;
	    			break;
	    		}
	    	}
	    	this.dialogue = null;
	};

	/**@
	 * #DialoguesBuilder.getDialogue
	 * 
	 * @return {Object} dialogue or root of dialogues
	 */
	instanceProto.getDialogue = function()
	{
		if(!this.dialogue){
			this.setDialogue( this.getRoot()["id"] );
		}
		return this.dialogue;
	};

	/**@
	* #DialoguesBuilder.getRoot
	* Root is the node, that has not parent.
	*
	* @return {Object} root
	*/
	instanceProto.getRoot = function()
	{
		for(var idx = 0; idx < this.data["dialogues"].length; idx++){
			if(!this.data["dialogues"][idx]["parent"]){
				return this.data["dialogues"][idx];
				break;
			}
		}
	};

	/**@
	* #DialoguesBuilder.findDialogueById
	* Find dialogue by id
	* 
	* @param {Integer} id
	* @return {Object} dialogue or null if dialogue is not exists
	*/
	instanceProto.findDialogueById = function(id)
	{
		if(!id){
			return null;
		}
		for(var idx = 0; idx < this.data["dialogues"].length; idx++){
			if( this.data["dialogues"][idx]["id"] == id){
				return this.data["dialogues"][idx];
				break;
			}
		}
		return null;
	};

	/**@
	* #DialoguesBuilder.showDialogue 
	* Show dialogue as HTML in your defined container. Default container is #chat.
	* 
	* @example
	* ~~~
	* <div id="chat"></div>
	*
	*call: 
	*DialoguesBuilder.showDialogue()
	*
	*result:
	* <div id="chat">
	*	<p class="dialogue ACTOR_NAME">DIALOGUE_TEXT</p>
	* </div>
	* ~~~
	*/
	instanceProto.showDialogue = function()
	{
		this.emptyChatContainer();
		this.chatContainer.appendChild( this.getDialogue()["isChoice"] ? this.createChoiceElement( this.getDialogue()) : this.createSentenceElement( this.getDialogue()));
	};

	/**@
	* #DialoguesBuilder.showDialogue 
	* Show dialogue as HTML in your defined container. Default container is #chat.
	* 
	* @example
	* ~~~
	* <div id="chat"></div>
	*
	*call: 
	*DialoguesBuilder.showDialogue()
	*
	*result:
	* <div id="chat">
	*	<p class="dialogue ACTOR_NAME">DIALOGUE_TEXT</p>
	* </div>
	* ~~~
	*/
	instanceProto.showDialogueById = function(id)
	{
		this.emptyChatContainer();
		this.chatContainer.appendChild( this.findDialogueById(id)["isChoice"] ? 
			this.createChoiceElement( this.findDialogueById(id) ) : 
			this.createSentenceElement( this.findDialogueById(id) )
		);
	};

	/**@
	* #DialoguesBuilder.endOfConversation
	* Leave resources after the end of the conversation
	*/
	instanceProto.endOfConversation = function()
	{
		if(this.dialogue){
			this.dialogue = null;
			this.emptyChatContainer();
		}
	};

	/**@
	* #DialoguesBuilder.emptyChatContainer
	* Remove all children from defined chat container.
	* Default container is #chat.
	*/	
	instanceProto.emptyChatContainer = function()
	{
		if(this.chatContainer){
			this.chatContainer.innerHTML = '';
		}
	};

	/**@
	* #DialoguesBuilder.isFinal
	* Determines whether the conversation is over.
	* 
	* @throw {Error} dialogue is null
	* @return {Boolean}
	*/
	instanceProto.isFinal = function()
	{
		if(this.dialogue){
			return !(this.dialogue["outgoingLinks"].length >= 1);
		}
		throw Error("Dialogue is null.");
	};

	/**@
	* #DialoguesBuilder.getActor
	*
	* @param {Integer} id
	* @return	{Object} actor or null
	*/
	instanceProto.getActor = function(id)
	{
		if(!id){
			return null;
		}
		for(var idx = 0; idx < this.data["actors"].length; idx++){
			if( this.data["actors"][idx]["id"] == id ){
				return this.data["actors"][idx];
			}
		}
		return null;
	};

	/*
	* Check the source data
	* 
	* @param {Object} data
	* @return {boolean}
	*/
	instanceProto.isValid = function(data)
	{
		var isValid = true;
		if( !data || !data["dialogues"] || data["dialogues"].length == 0 || !data["actors"] || data["actors"].length <= 1 || !this.hasRoot( data )){
			isValid = false;
		}
		return isValid;
	};

	/*
	* Check if data has only the one root dialog
	* 
	* @param {Object} data
	* @return {boolean}
	*/
	instanceProto.hasRoot = function(data)
	{
		var roots = [];
		for(var idx = 0; idx < data["dialogues"].length; idx++){
			if( !data["dialogues"][idx]["parent"]){
				roots.push( data["dialogues"][idx] );
			}
		}
		return roots.length == 1 ? true : false;
	};

	/*
	* Create DOM Element for sentence
	* 
	* @example
	* ~~~
	* <p>DIALOGUE_TEXT</p>
	* ~~~
	* @param {Object} dialogue
	* @return {Element} element
	* 
	* @see DOM element (http://www.w3.org/TR/DOM-Level-2-Core/core.html#ID-745549614)
	*/
	instanceProto.createSentenceElement = function(dialogue)
	{
		var self = this;
		var paragraph = document.createElement(this.componentSetting.STATEMENT_ELEMENT);
		//paragraph.setAttribute("class", this.componentSetting.DIALOGUE_CLASS_NAME + ' ' + this.getActor(dialogue.actor).name );
		paragraph.setAttribute("class", this.componentSetting.DIALOGUE_CLASS_NAME);
		paragraph.setAttribute(this.componentSetting.DIALOGUE_DATA_ATTRIBUTE_NAME, dialogue["outgoingLinks"][0] ? dialogue["outgoingLinks"][0] : this.componentSetting.FINAL_OUTGOING_LINK_TAG );
		//paragraph.appendChild( document.createTextNode( this.getActor(dialogue.actor).name + ': ' + dialogue.dialogueText));
		//var avatar = (this.getActor(dialogue.actor).avatar) ? '<div class="avatar"><img src="' + this.getActor(dialogue.actor).avatar + '"/></div>' : '';
		var avatar = '';
		paragraph.innerHTML = avatar + "<span class=\"actor\">" + this.getActor(dialogue["actor"])["name"] + ":</span> " + dialogue["dialogueText"];
		paragraph.addEventListener("click", function(e){
			var outgoingLink = e.target.getAttribute(self.componentSetting.DIALOGUE_DATA_ATTRIBUTE_NAME);
			self.setDialogue( outgoingLink );
			if(self.dialogue){
				self.showDialogue();
			}
		} , false);
		paragraph.addEventListener("touchend", function(e){
			var outgoingLink = e.target.getAttribute(self.componentSetting.DIALOGUE_DATA_ATTRIBUTE_NAME);
			self.setDialogue( outgoingLink );
			if(self.dialogue){
				self.showDialogue();
			}
		} , false);
		return paragraph;
	};

	/*
	* Create DOM Element for choice
	* 
	* @example
	* ~~~
	* <ul>
	* 	<li>MENU_TEXT</li>
	* 	<li>MENU_TEXT</li>
	* 	<li>MENU_TEXT</li>
	* </ul>
	* ~~~
	* 
	* @param {Object} dialogue
	* @return {Element} element
	* 
	* @see DOM element (http://www.w3.org/TR/DOM-Level-2-Core/core.html#ID-745549614)
	*/
	instanceProto.createChoiceElement = function(choice)
	{
		var self = this;
		var list = document.createElement( this.componentSetting.CHOICE_ELEMENT_CONTAINER );
		for(var idx = 0; idx < choice["outgoingLinks"].length; idx++ ){
			//User can call 'this.getDialogue()' in condition.
			//It uses 'this.dialogue' property.
			//That is way it temporarily change 'this.dialogue' property.
			this.dialogue = this.findDialogueById( choice["outgoingLinks"][idx] );
			if( !this.isActive(this.dialogue)){
				continue;
			}
			var item = document.createElement( this.componentSetting.CHOICE_ELEMENT );
			item.setAttribute(this.componentSetting.DIALOGUE_DATA_ATTRIBUTE_NAME, choice["outgoingLinks"][idx]);
			item.appendChild( document.createTextNode( this.dialogue["menuText"]));
			item.addEventListener("click", function(e){
				var outgoingLink = e.target.getAttribute(self.componentSetting.DIALOGUE_DATA_ATTRIBUTE_NAME);
				self.setDialogue( outgoingLink );
				self.showDialogue();
			});
			list.appendChild(item);
		}
		this.dialogue = choice;
		return list;
	};

	/*
	* Evaluates conditionString property in dialogue.
	* 
	* @param {String} code
	* @return {Boolean} result
	*/
	instanceProto.isActive = function(dialogue)
	{
		var result = true;
		if(dialogue["conditionsString"]){
			result = this.executeCode( dialogue["conditionsString"]);
		}
		return result;
	};

	/* 
	* Parse String and execute it as JavaScript code.
	* Use JavaScript eval(string) function
	* 
	* @param {Object} context
	* @param {String} code
	* @return {Object} result
	* 
	* @see eval(string) (https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/eval)
	*/
	instanceProto.executeCode = function(code)
	{
		if(code){
			// let's hope this is used responsibly
			try {
				if (eval){
					if(this.componentSetting.DEBUG_MODE){
						console.log("Execute code: " + code);
					}
					return eval( code );
				}
			} catch (e) {
				if (console && console.error){
					console.error("Syntax error on your code: " + code);
				}
			}
		}
	};

	instanceProto.updatePosition = function (first)
	{
		if (this.runtime.isDomFree)
			return;
		
		var left = this.layer.layerToCanvas(this.x, this.y, true);
		var top = this.layer.layerToCanvas(this.x, this.y, false);
		var right = this.layer.layerToCanvas(this.x + this.width, this.y + this.height, true);
		var bottom = this.layer.layerToCanvas(this.x + this.width, this.y + this.height, false);
		
		// Is entirely offscreen or invisible: hide
		if (!this.visible || !this.layer.visible || right <= 0 || bottom <= 0 || left >= this.runtime.width || top >= this.runtime.height)
		{
			if (!this.element_hidden)
				jQuery(this.elem).hide();
			
			this.element_hidden = true;
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
		
		var curWinWidth = window.innerWidth;
		var curWinHeight = window.innerHeight;
			
		// Avoid redundant updates
		if (!first && this.lastLeft === left && this.lastTop === top && this.lastRight === right && this.lastBottom === bottom && this.lastWinWidth === curWinWidth && this.lastWinHeight === curWinHeight)
		{
			if (this.element_hidden)
			{
				jQuery(this.elem).show();
				this.element_hidden = false;
			}
			
			return;
		}
		
		this.lastLeft = left;
		this.lastTop = top;
		this.lastRight = right;
		this.lastBottom = bottom;
		this.lastWinWidth = curWinWidth;
		this.lastWinHeight = curWinHeight;
		
		if (this.element_hidden)
		{
			jQuery(this.elem).show();
			this.element_hidden = false;
		}
		
		var offx = Math.round(left) + jQuery(this.runtime.canvas).offset().left;
		var offy = Math.round(top) + jQuery(this.runtime.canvas).offset().top;
		jQuery(this.elem).css("position", "absolute");
		jQuery(this.elem).offset({left: offx, top: offy});
		jQuery(this.elem).width(Math.round(right - left));
		jQuery(this.elem).height(Math.round(bottom - top));
	};

	// patterns tile their image content relative to the origin, which is really
	// annoying for drawing tiled content.  Work around to tile from draw co-ordinates
	// using translate.
	function drawPatternProperly(ctx, pattern, pw, ph, drawX, drawY, w, h, ox, oy)
	{
		ctx.save();
		ctx.fillStyle = pattern;
		
		var offX = drawX % pw;
		var offY = drawY % ph;
		if (offX < 0)
			offX += pw;
		if (offY < 0)
			offY += ph;
		
		ctx.translate(offX + ox, offY + oy);
		ctx.fillRect(drawX - offX - ox, drawY - offY - oy, w, h);
		ctx.restore();
	};

	instanceProto.draw = function(ctx)
	{
		var img = this.type.texture_img;
		var lm = this.leftMargin;
		var rm = this.rightMargin;
		var tm = this.topMargin;
		var bm = this.bottomMargin;
		var iw = img.width;
		var ih = img.height;
		var re = iw - rm;
		var be = ih - bm;
		
		ctx.globalAlpha = this.opacity;
		ctx.save();
		
		var myx = this.x;
		var myy = this.y;
		var myw = this.width;
		var myh = this.height;
		
		if (this.runtime.pixel_rounding)
		{
			myx = Math.round(myx);
			myy = Math.round(myy);
		}
		
		// Patterns tile from the origin no matter where you draw from.
		// Translate the canvas to align with the draw position, then offset the draw position as well.
		var drawX = -(this.hotspotX * this.width);
		var drawY = -(this.hotspotY * this.height);
		
		var offX = drawX % iw;
		var offY = drawY % ih;
		if (offX < 0)
			offX += iw;
		if (offY < 0)
			offY += ih;
			
		ctx.translate(myx + offX, myy + offY);
		
		var x = drawX - offX;
		var y = drawY - offY;
		
		var s = (this.seamless ? 1 : 0);
		
		// draw top-left, top-right, bottom-right and bottom-left corners
		// include an extra 1px from source image to avoid seams
		if (lm > 0 && tm > 0)
			ctx.drawImage(img, 0, 0, lm + s, tm + s, x, y, lm + s, tm + s);
			
		if (rm > 0 && tm > 0)
			ctx.drawImage(img, re - s, 0, rm + s, tm + s, x + myw - rm - s, y, rm + s, tm + s);
			
		if (rm > 0 && bm > 0)
			ctx.drawImage(img, re - s, be - s, rm + s, bm + s, x + myw - rm - s, y + myh - bm - s, rm + s, bm + s);
			
		if (lm > 0 && bm > 0)
			ctx.drawImage(img, 0, be - s, lm + s, bm + s, x, y + myh - bm - s, lm + s, bm + s);
		
		// draw edges, overlapping in to fill area by 1px to avoid seams unless fill is transparent
		if (this.edges === 0)		// tile edges
		{
			var off = (this.fill === 2 ? 0 : s);
			
			if (lm > 0 && be > tm)
				drawPatternProperly(ctx, this.type.leftPattern, lm, be - tm, x, y + tm, lm + off, myh - tm - bm, 0, 0);
				
			if (rm > 0 && be > tm)
				drawPatternProperly(ctx, this.type.rightPattern, rm, be - tm, x + myw - rm - off, y + tm, rm + off, myh - tm - bm, off, 0);
				
			if (tm > 0 && re > lm)
				drawPatternProperly(ctx, this.type.topPattern, re - lm, tm, x + lm, y, myw - lm - rm, tm + off, 0, 0);
				
			if (bm > 0 && re > lm)
				drawPatternProperly(ctx, this.type.bottomPattern, re - lm, bm, x + lm, y + myh - bm - off, myw - lm - rm, bm + off, 0, off);
		}
		else if (this.edges === 1)	// stretch edges
		{
			if (lm > 0 && be > tm && myh - tm - bm > 0)
				ctx.drawImage(img, 0, tm, lm, be - tm, x, y + tm, lm, myh - tm - bm);
				
			if (rm > 0 && be > tm && myh - tm - bm > 0)
				ctx.drawImage(img, re, tm, rm, be - tm, x + myw - rm, y + tm, rm, myh - tm - bm);
				
			if (tm > 0 && re > lm && myw - lm - rm > 0)
				ctx.drawImage(img, lm, 0, re - lm, tm, x + lm, y, myw - lm - rm, tm);
				
			if (bm > 0 && re > lm && myw - lm - rm > 0)
				ctx.drawImage(img, lm, be, re - lm, bm, x + lm, y + myh - bm, myw - lm - rm, bm);
		}
		
		// fill
		if (be > tm && re > lm)
		{
			if (this.fill === 0)		// tile fill
			{
				drawPatternProperly(ctx, this.type.fillPattern, re - lm, be - tm, x + lm, y + tm, myw - lm - rm, myh - tm - bm, 0, 0);
			}
			else if (this.fill === 1)	// stretch fill
			{
				if (myw - lm - rm > 0 && myh - tm - bm > 0)
				{
					ctx.drawImage(img, lm, tm, re - lm, be - tm, x + lm, y + tm, myw - lm - rm, myh - tm - bm);
				}
			}
			// else fill is 2, meaning transparent - don't draw
		}
		
		ctx.restore();
	};
	
	instanceProto.drawPatch = function(glw, tex, sx, sy, sw, sh, dx, dy, dw, dh)
	{
		glw.setTexture(tex);
		var rcTex = this.rcTex;
		rcTex.left = sx / tex.c2width;
		rcTex.top = sy / tex.c2height;
		rcTex.right = (sx + sw) / tex.c2width;
		rcTex.bottom = (sy + sh) / tex.c2height;
		glw.quadTex(dx, dy, dx + dw, dy, dx + dw, dy + dh, dx, dy + dh, rcTex);
	};
	
	instanceProto.tilePatch = function(glw, tex, dx, dy, dw, dh, ox, oy)
	{
		glw.setTexture(tex);
		var rcTex = this.rcTex;
		rcTex.left = -ox / tex.c2width;
		rcTex.top = -oy / tex.c2height;
		rcTex.right = (dw - ox) / tex.c2width;
		rcTex.bottom = (dh - oy) / tex.c2height;
		glw.quadTex(dx, dy, dx + dw, dy, dx + dw, dy + dh, dx, dy + dh, rcTex);
	};
	
	instanceProto.drawGL = function(glw)
	{
		var lm = this.leftMargin;
		var rm = this.rightMargin;
		var tm = this.topMargin;
		var bm = this.bottomMargin;
		var iw = this.type.texture_img.width;
		var ih = this.type.texture_img.height;
		var re = iw - rm;
		var be = ih - bm;
		
		glw.setOpacity(this.opacity);
		
		var rcTex = this.rcTex;
		var q = this.bquad;
		var myx = q.tlx;
		var myy = q.tly;
		var myw = this.width;
		var myh = this.height;
		
		if (this.runtime.pixel_rounding)
		{
			myx = Math.round(myx);
			myy = Math.round(myy);
		}
		
		var s = (this.seamless ? 1 : 0);
		
		// draw corners
		if (lm > 0 && tm > 0)
			this.drawPatch(glw, this.type.webGL_texture, 0, 0, lm + s, tm + s, myx, myy, lm + s, tm + s);
		
		if (rm > 0 && tm > 0)
			this.drawPatch(glw, this.type.webGL_texture, re - s, 0, rm + s, tm + s, myx + myw - rm - s, myy, rm + s, tm + s);
			
		if (rm > 0 && bm > 0)
			this.drawPatch(glw, this.type.webGL_texture, re - s, be - s, rm + s, bm + s, myx + myw - rm - s, myy + myh - bm - s, rm + s, bm + s);
			
		if (lm > 0 && bm > 0)
			this.drawPatch(glw, this.type.webGL_texture, 0, be - s, lm + s, bm + s, myx, myy + myh - bm - s, lm + s, bm + s);
		
		// draw edges
		if (this.edges === 0)		// tile edges
		{
			var off = (this.fill === 2 ? 0 : s);
			
			if (lm > 0 && be > tm)
				this.tilePatch(glw, this.type.webGL_leftTexture, myx, myy + tm, lm + off, myh - tm - bm, 0, 0);
			if (rm > 0 && be > tm)
				this.tilePatch(glw, this.type.webGL_rightTexture, myx + myw - rm - off, myy + tm, rm + off, myh - tm - bm, off, 0);
			if (tm > 0 && re > lm)
				this.tilePatch(glw, this.type.webGL_topTexture, myx + lm, myy, myw - lm - rm, tm + off, 0, 0);
			if (bm > 0 && re > lm)
				this.tilePatch(glw, this.type.webGL_bottomTexture, myx + lm, myy + myh - bm - off, myw - lm - rm, bm + off, 0, off);
		}
		else if (this.edges === 1)	// stretch edges
		{
			if (lm > 0 && be > tm)
				this.drawPatch(glw, this.type.webGL_texture, 0, tm, lm, be - tm, myx, myy + tm, lm, myh - tm - bm);
			if (rm > 0 && be > tm)
				this.drawPatch(glw, this.type.webGL_texture, re, tm, rm, be - tm, myx + myw - rm, myy + tm, rm, myh - tm - bm);
			if (tm > 0 && re > lm)
				this.drawPatch(glw, this.type.webGL_texture, lm, 0, re - lm, tm, myx + lm, myy, myw - lm - rm, tm);
			if (bm > 0 && re > lm)
				this.drawPatch(glw, this.type.webGL_texture, lm, be, re - lm, bm, myx + lm, myy + myh - bm, myw - lm - rm, bm);
		}
		
		if (be > tm && re > lm)
		{
			if (this.fill === 0)		// tile fill
			{
				this.tilePatch(glw, this.type.webGL_fillTexture, myx + lm, myy + tm, myw - lm - rm, myh - tm - bm, 0, 0);
			}
			else if (this.fill === 1)	// stretch fill
			{
				this.drawPatch(glw, this.type.webGL_texture, lm, tm, re - lm, be - tm, myx + lm, myy + tm, myw - lm - rm, myh - tm - bm);
			}
			// else fill is 2, meaning transparent - don't draw
		}
	};

	//////////////////////////////////////
	// Conditions
	function Cnds() {};
	
	Cnds.prototype.OnURLLoaded = function ()
	{
		return true;
	};
	
	Cnds.prototype.OnDialogueEnded = function ()
	{
		return true;
	};
	
	Cnds.prototype.OnDialogueStart = function ()
	{
		return true;
	};
	
	Cnds.prototype.OnExecutedCodeBefore = function (tag)
	{
		return cr.equals_nocase(tag, this.executeCodeBefore);
	};
	
	Cnds.prototype.OnExecutedCodeAfter = function (tag)
	{
		return cr.equals_nocase(tag, this.executeCodeAfter);
	};
	
	pluginProto.cnds = new Cnds();
	//////////////////////////////////////
	// Actions
	function Acts() {};

	Acts.prototype.LoadDialogue = function (data){
		var DIALOGUES_DATA_SOURCE = JSON.parse(data);
		this.setDialogues(DIALOGUES_DATA_SOURCE);
	};

	Acts.prototype.ShowDialogue = function (id){
		this.runtime.trigger(cr.plugins_.sirg_rpgdialog.prototype.cnds.OnDialogueStart, this);
		this.showDialogueById(id);
	};

	Acts.prototype.ExecuteDialogueCode = function (code){
		this.executeCode(code);
	};

	Acts.prototype.CloseDialogue = function (){
		this.runtime.trigger(cr.plugins_.sirg_rpgdialog.prototype.cnds.OnDialogueEnded, this);
		this.endOfConversation();
	};

	pluginProto.acts = new Acts();
	//////////////////////////////////////
	// Expressions
	function Exps() {};

	Exps.prototype.CodeBefore = function (ret)
	{
		this.executeCodeBefore = (this.executeCodeBefore==null) ? '' : this.executeCodeBefore;
		ret.set_string(this.executeCodeBefore);
	};
	
	Exps.prototype.CodeAfter = function (ret)
	{
		this.executeCodeAfter = (this.executeCodeAfter==null) ? '' : this.executeCodeAfter;
		ret.set_string(this.executeCodeAfter);
	};

	pluginProto.exps = new Exps();

}());