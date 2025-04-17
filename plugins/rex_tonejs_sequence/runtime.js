// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
cr.plugins_.Rex_ToneJS_sequence = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	var pluginProto = cr.plugins_.Rex_ToneJS_sequence.prototype;
		
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

	instanceProto.onCreate = function()
	{
        this.subdivision = this.properties[0];
        this.loopCnt = this.properties[1];

        this.part = null;
        this.exp_TrigTime = 0;
        this.exp_TrigNote = "";
	};
    
	instanceProto.onDestroy = function ()
	{
        if (this.part)
        {
            this.part["dispose"]();
            this.part = null;
        }
	};   
    
	instanceProto.getPart = function (notes)
	{
        // create a new part
        if (notes != null)
            this.part = null;
        
        // return current part
        else if (this.part !== null)        
            return this.part;
        
        // create a new part with empty notes
        else
            notes = [];  

        var self=this;
        var callback = function(time, note)
        {
            self.exp_TrigTime = time;
            self.exp_TrigNote = note;            
            self.runtime.trigger(cr.plugins_.Rex_ToneJS_sequence.prototype.cnds.OnEvent, self); 
        };
        this.part = new window["Tone"]["Sequence"](callback, notes, this.subdivision);
        this.part["loop"] = (this.loopCnt === 0)? true : this.loopCnt;
        
        return this.part;
	};     

	//////////////////////////////////////
	// Conditions
	function Cnds() {};
	pluginProto.cnds = new Cnds();    

	Cnds.prototype.OnEvent = function ()
	{
        return true;  
	};	    
	//////////////////////////////////////
	// Actions
	function Acts() {};
	pluginProto.acts = new Acts();

	Acts.prototype.Start = function (time)
	{
        this.getPart()["start"](time);      
	};      

	Acts.prototype.Stop = function (time)
	{
        this.getPart()["stop"](time);      
	};    
    
	Acts.prototype.Reload = function (notes)
	{
        try
        {
            notes = JSON.parse(notes);
        }
        catch(e)
        {
            return;
        }
        this.getPart(notes);      
	}; 
	Acts.prototype.RemoveAll = function ()
	{
        this.getPart()["removeAll"]();      
	}; 

	Acts.prototype.Add = function (index, value)
	{
        if (value.indexOf(",") !== -1)
            value = value.split(",");
        this.getPart()["add"](index, value);      
	};

	Acts.prototype.Remove = function (index)
	{
        this.getPart()["remove"](index);      
	};    
	//////////////////////////////////////
	// Expressions
	function Exps() {};
	pluginProto.exps = new Exps();
    
	Exps.prototype.Progress = function (ret)
	{
		ret.set_float(this.getPart()["progress"]);
	};
    
	Exps.prototype.Time = function (ret)
	{
		ret.set_any(this.exp_TrigTime);
	};
    
	Exps.prototype.Note = function (ret)
	{
		ret.set_any(this.exp_TrigNote);
	};    
    
    var idxs = [];
	Exps.prototype.At = function (ret, idx0)
	{
        var i,cnt=arguments.length;
        for(i=1; i<cnt; i++)
            idxs.push(arguments[i]);        
        var note = this.getPart()["at"].apply(this.part, idxs);
        idxs.length = 0;
		ret.set_any(note);
	};

    
}());