// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
cr.plugins_.Amiga_Protracker = function(runtime)
{
	this.runtime = runtime;
};
//var player= new Protracker();

var player=new Modplayer();
var Protracker,Fasttracker,ScreamTracker;
(function ()
{
	var pluginProto = cr.plugins_.Amiga_Protracker.prototype;
	
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
	    jsfile_load("pt.js");
	
		//if (console && console.log)
			//console.log("Protracker.js Loaded ... Ok !");
				 
	};
	
	var jsfile_load = function(file_name)
	{
	    var scripts=document.getElementsByTagName("script");
	    var exist=false;
	    for(var i=0;i<scripts.length;i++)
	    {
	    	if(scripts[i].src.indexOf(file_name) != -1)
	    	{
	    		exist=true;
	    		break;
	    	}
	    }
	    if(!exist)
	    {
	    	var newScriptTag=document.createElement("script");
	    	newScriptTag.setAttribute("type","text/javascript");
	    	newScriptTag.setAttribute("src", file_name);
	    	document.getElementsByTagName("head")[0].appendChild(newScriptTag);
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
	
	};
    
	instanceProto.onDestroy = function ()
	{
    };
  
    
	
    
	instanceProto.saveToJSON = function ()
	{
		
	};
	
	instanceProto.loadFromJSON = function (o)
	{
    };
 
	
	instanceProto.Loading = function ()
	{
		
    };
 
//*************************************************************************	
	
	//////////////////////////////////////
	// Conditions
	function Cnds() {};
	pluginProto.cnds = new Cnds();    

	Cnds.prototype.Onready = function ()
	{
	 	//console.log(player["ready"]);
		return player["ready"];
	};
    Cnds.prototype.Onpause = function ()
	{
	//	console.log(player["ready"]);
		return player["paused"];
	};
	
    
	//////////////////////////////////////
	// Actions
	function Acts() {};
	pluginProto.acts = new Acts();
	

	
	Acts.prototype.Loading = function (url)
	{


	 player["load"](url); // external file function-- for minify 
	
	
	 
	}
	
	
    Acts.prototype.Play = function ()
	{
	  player["play"](); 
   	};         
     
    Acts.prototype.Stop = function ()
	{ 
       player["stop"]();  
	};     
  
	Acts.prototype.SetRepeat = function (rept)
	{
	 // 0 = No repeat, 1 = Yes
		player["repeat"]=rept;
	};
	Acts.prototype.SetPause = function (pause)
	{
	
		player["paused"]=pause;
	};
	
	
	Acts.prototype.SetSpeed = function (spd)
	{
		player["speed"]=spd;
	};
  
  Acts.prototype.SetPosition = function (songpos)
	{
		player["position"]=(songpos);
	};
  Acts.prototype.SetBpm = function (sbpm)
	{
		player["bpm"]=(sbpm);
	};
  Acts.prototype.Setvolume = function (svol)
	{
		player["volNode"]["gain"]["value"]=(svol);
	};
   Acts.prototype.Setfftsize = function (fftsize)
	{
		player["analyzer"]["fftSize"]=(fftsize);
	};

   Acts.prototype. Settsmooth  = function (smooth)
	{
		player["analyzer"]["smoothingTimeConstant"]=(smooth);
	}; 
	//////////////////////////////////////
	// Expressions
	function Exps() {};
	pluginProto.exps = new Exps();

	// the example expression
	Exps.prototype.Modtitle = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	
	{
	//	ret.set_float(v);
	//console.log(player["title"]);  
	    ret.set_string(player["title"]);
	//	ret.set_int(a);				// return our value
	// for returning floats
	// ret.set_string("Hello");		// for ef_return_string
	// ret.set_any("woo");			// for ef_return_any, accepts either a number or string
	
		};	

	Exps.prototype.ModChannels = function (ret)	
		{
	      ret.set_int(player["channels"]);
	 	};	
	Exps.prototype.ModPatterns = function (ret)	
	    {
		 ret.set_int(player["patterns"]);
	 	};		
	Exps.prototype.Songposition = function (ret)	
	    {
	   ret.set_int(player["position"]);
	 	};	
	Exps.prototype.Vu0 = function (ret)	
	    {
	    ret.set_any(player["vu"][0]);
	 	};	
	Exps.prototype.Vu1 = function (ret)	
	    {
	    ret.set_any(player["vu"][1]);
	 	};	
	Exps.prototype.Vu2 = function (ret)	
	    {
	    ret.set_any(player["vu"][2]);
	 	};	
	Exps.prototype.Vu3 = function (ret)	
	    {
	    ret.set_any(player["vu"][3]);
	 	};	
   
	Exps.prototype.Songlength = function (ret)
	{
        ret.set_int(player["songlen"]);
	};      

	Exps.prototype.Songrow = function (ret)
	{
        ret.set_int(player["row"]);
	};  
	
	Exps.prototype.Songsignature = function (ret)
	{
        ret.set_string(player["signature"]);
	};  
	Exps.prototype.Songspeed = function (ret)
	{
        ret.set_string(player["speed"]);
	};  
	Exps.prototype.Songbpm= function (ret)
	{
        ret.set_string(player["bpm"]);
	};  
	Exps.prototype.Songvol= function (ret)
	{
        ret.set_string(player["volNode"]["gain"]);
	};  
	Exps.prototype.Fftsize= function (ret)
	{
        ret.set_int(player["analyzer"]["fftsize"]);
	}; 
	
	Exps.prototype.Smtimeconst= function (ret)
	{
        ret.set_int(player["analyzer"]["smoothingTimeConstant"]);
	}; 
	Exps.prototype.Getfreq= function (ret,index)
	{
        ret.set_any(player["getfreq"]()[index]);
	}; 
	
	
   pluginProto.exps = new Exps();
        	
}());

