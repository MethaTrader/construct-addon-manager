// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
//          vvvvvvvv
cr.plugins_.drawsprite = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	/////////////////////////////////////
	// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
	//                            vvvvvvvv
	var pluginProto = cr.plugins_.drawsprite.prototype;
		
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
                this.parsestring = "";
		// note the object is sealed after this call; ensure any properties you'll ever need are set on the object
		// e.g...
		// this.myValue = 0;
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
	pluginProto.cnds = {};
	var cnds = pluginProto.cnds;

	// the example condition
	//cnds.MyCondition = function (myparam)
	//{
	//	// return true if number is positive
	//	return myparam >= 0;
	//};
	
	//////////////////////////////////////
	// Actions
	pluginProto.acts = {};
	var acts = pluginProto.acts;

	// the example action
	//acts.setparsestring = function (myparam)
	//{
	//    var pstring = myparam.toString();
        //    this.parsestring = pstring;	
	//};

        acts.draw_sprite_maze = function (obj, layer, gridx, gridy , myrow, mycol, xpos, ypos, owidth, oheight, pestring)
	{
                var GRIDx = gridx;
                var GRIDy = gridy;
                var ROWS = myrow;
                var COLS = mycol;                                 
                var Maze;                                       
                var Stack;
                var mywidth = obj.instances[0].width;
                var myheight = obj.instances[0].height;
                var i, j, r, c, d, k, dir1;
                var a = 0;
                var startx = Math.floor(mywidth*obj.instances[0].hotspotX)+xpos;
                var starty = Math.floor(myheight*obj.instances[0].hotspotY)+ypos;
                var stackpos = 0;
                var curx = 0;
                var cury = 0;
                var visited = 1;
                var direction = 0;
                var move = [[ 0, 1], [ 0, -1], [ 1, 0], [ -1, 0]];
                var next = [[ 0, 0], [ 0, 0], [ 0, 0], [ 0, 0]];
                var mystring = pestring;
                var temp = mystring.split(",");

                if ( owidth > 0 )
                {
                    mywidth = owidth;
                }
                if ( oheight > 0 )
                {
                    myheight = oheight;
                }

                Maze = new Array(ROWS);
                for (i = 0; i < ROWS; i++)
	            Maze[i] = new Array(COLS);

                for (i = 0; i < ROWS; i++)
                    for (j = 0; j < COLS; j++)
                        Maze[i][j] = parseInt("15");

                Stack = new Array(ROWS*COLS);
                for (i = 0; i < ROWS*COLS; i++)
                    Stack[i] = new Array(2);

                for (i = 0; i < ROWS*COLS; i++)
                    for (j = 0; j < 2; j++)
                        Stack[i][j] = parseInt("0"); 

                curx = Math.floor((Math.random()*(43541)))%ROWS;
                cury = Math.floor((Math.random()*(43481
)))%COLS;

                while ( visited < (ROWS*COLS) )
                {
                    j = 0;
                    for (i = 0; i < 4; i++)
                    {
                        r = curx + move[i][0];
                        c = cury + move[i][1];

                        if ( r >= 0 && c >= 0 && r < ROWS && c < COLS )
                        {
                            if ( Maze[r][c] == 15 )
                            {
                                next[j][0] = move[i][0];
                                next[j][1] = move[i][1];
                                j++;
                            }
                        }
                    }
                    if ( j > 0 )
                    {
                        stackpos++;
                        Stack[stackpos][0] = curx;
                        Stack[stackpos][1] = cury;

                        i = Math.floor((Math.random()*(7919)))%j;
                        
                        if ( next[i][0] == -1 )
                        {
                            Maze[curx][cury] -= 8; 
                            curx--;
                            Maze[curx][cury] -= 2;
                        }
                        if ( next[i][0] == 1 )
                        {
                            Maze[curx][cury] -= 2; 
                            curx++;
                            Maze[curx][cury] -= 8;
                        }
                        if ( next[i][1] == -1 )
                        {
                            Maze[curx][cury] -= 1; 
                            cury--;
                            Maze[curx][cury] -= 4;
                        }
                        if ( next[i][1] == 1 )
                        {
                            Maze[curx][cury] -= 4; 
                            cury++;
                            Maze[curx][cury] -= 1;
                        }
                        visited++;
                    }
                    else
                    {
                        curx = Stack[stackpos][0];
                        cury = Stack[stackpos][1];
                        stackpos--;
                    }
                }

                while ( a < temp.length )
                {
                    if ( temp[a] < ROWS && temp[a+1] < COLS )
                    {
                        Maze[parseInt(temp[a])][parseInt(temp[a+1])] -= parseInt(temp[a+2]);
                    }
                    a = a + 3;
                }

                for (i = 0; i < ROWS; i++)
                    for (j = 0; j < COLS; j++)
                    {
                        dir1 = 0;
                        if ( (Maze[i][j] & parseInt("1")) == 1 )
                        {
                            dir1 = 1;
                            for (k = 0; k < GRIDx; k++)
                            { 
                                this.runtime.createInstance(obj, layer, startx+(i*mywidth*GRIDx)+(mywidth*k), starty+(j*myheight*GRIDy));
                            } 
                        }
                        if ( (Maze[i][j] & parseInt("8")) == 8 )
                        {
                            if ( j < (COLS-1) )
                            {
                                if ( (Maze[i][j+1] & parseInt("1")) != 1 && (Maze[i][j+1] & parseInt("8")) != 8 )
                                {
                                    this.runtime.createInstance(obj, layer, startx+(i*mywidth*GRIDx), starty+(j*myheight*GRIDy)+(myheight*GRIDy));    
                                }
                            }
                            for (k = 0; k < GRIDy; k++)
                            {
                                if ( dir1 == 0 )
                                {
                                    this.runtime.createInstance(obj, layer, startx+(i*mywidth*GRIDx), starty+(j*myheight*GRIDy)+(myheight*k));
                                }
                                if ( k == 0 )
                                {
                                    dir1 = 0;
                                }
                            }
                        } 
                        if ( (Maze[i][j] & parseInt("4")) == 4 && j == (COLS-1) )
                        {
                            for (k = 0; k < GRIDx; k++)
                            {
                                this.runtime.createInstance(obj, layer, startx+(i*mywidth*GRIDx)+(mywidth*k), starty+(j*myheight*GRIDy)+(myheight*(GRIDy)));   
                            } 
                        }
                        if ( (Maze[i][j] & parseInt("2")) == 2 && i == (ROWS-1) )
                        {
                            for (k = 0; k < GRIDy; k++)
                            {
                                this.runtime.createInstance(obj, layer, startx+(i*mywidth*GRIDx)+(mywidth*(GRIDx)), starty+(j*myheight*GRIDy)+(myheight*k));
                            }
                            if ( j == (COLS-1) )
                            {
                                this.runtime.createInstance(obj, layer, startx+(i*mywidth*GRIDx)+(mywidth*(GRIDx)), starty+(j*myheight*GRIDy)+(myheight*k));
                            }                      
                        }         
                    }               
                            
	};

        acts.draw_sprite_path = function (obj, layer, ostring, owidth, oheight)
	{
                var myx = 0;
                var myy = 0;
                var myx2 = 0;
                var myy2 = 0;
                var myloop = -1;
                var a = 2;
                var temp = new Array();
                var mystring = ostring;
                temp = mystring.split(",");
                var mywidth = obj.instances[0].width;
                var myheight = obj.instances[0].height;

                if ( owidth > 0 )
                {
                    mywidth = owidth;
                }
                if ( oheight > 0 )
                {
                    myheight = oheight;
                }
                
                myx = parseInt(temp[0]);
                myy = parseInt(temp[1]);
    
		while ( a < temp.length )
                {	
                    if ( temp[a].toLowerCase()  == "r" )
                    {
                        while ( myloop < parseInt(temp[a+1]) )
                        {
                            this.runtime.createInstance(obj, layer,myx+((myloop+1)*mywidth),myy);
                            myx2 = myx+((myloop+1)*mywidth);
                            myy2 = myy;
                            ++myloop;
                        }
                    }
                    if ( temp[a].toLowerCase() == "l" )
                    {
                        while ( myloop < parseInt(temp[a+1]) )
                        {
                            this.runtime.createInstance(obj, layer,myx-((myloop+1)*mywidth),myy);
                            myx2 = myx-((myloop+1)*mywidth);
                            myy2 = myy;
                            ++myloop;
                        }
                    }
                    if ( temp[a].toLowerCase() == "u" )
                    {
                        while ( myloop < parseInt(temp[a+1]) )
                        {
                            this.runtime.createInstance(obj, layer,myx,myy-((myloop+1)*myheight));
                            myx2 = myx;
                            myy2 = myy-((myloop+1)*myheight)
                            ++myloop;
                        }
                    }
                    if ( temp[a].toLowerCase() == "d" )
                    {
                        while ( myloop < parseInt(temp[a+1]) )
                        {
                            this.runtime.createInstance(obj, layer,myx,myy+((myloop+1)*myheight));
                            myx2 = myx;
                            myy2 = myy+((myloop+1)*myheight);
                            ++myloop;
                        }
                    }
                    myx = myx2;
                    myy = myy2;
                    a = a + 2;
                    myloop = 0;
                }
	};


        acts.draw_sprite = function (obj, layer, ostring, owidth, oheight)
	{
                var myloop = 0;
                var a = 0;
                var temp = new Array();
                var mystring = ostring.toString();
                temp = mystring.split(",");
                var mywidth = obj.instances[0].width;
                var myheight = obj.instances[0].height;

                if ( owidth > 0 )
                {
                    mywidth = owidth;
                }
                if ( oheight > 0 )
                {
                    myheight = oheight;
                }

		while ( a < temp.length )
                {	
                    this.runtime.createInstance(obj, layer,parseInt(temp[a]),parseInt(temp[a+1]));
                    myloop = 1;
                    if ( temp[a+2].toLowerCase()  == "dul" )
                    {
                        while ( myloop < parseInt(temp[a+3]) )
                        {
                            this.runtime.createInstance(obj, layer,parseInt(temp[a])-(myloop*mywidth),parseInt(temp[a+1])-(myloop*myheight));
                            ++myloop;
                        } 
                    }
                    if ( temp[a+2].toLowerCase()  == "dur" )
                    {
                        while ( myloop < parseInt(temp[a+3]) )
                        {
                            this.runtime.createInstance(obj, layer,parseInt(temp[a])+(myloop*mywidth),parseInt(temp[a+1])-(myloop*myheight));
                            ++myloop;
                        } 
                    }
                    if ( temp[a+2].toLowerCase()  == "dll" )
                    {
                        while ( myloop < parseInt(temp[a+3]) )
                        {
                            this.runtime.createInstance(obj, layer,parseInt(temp[a])-(myloop*mywidth),parseInt(temp[a+1])+(myloop*myheight));
                            ++myloop;
                        } 
                    }
                    if ( temp[a+2].toLowerCase()  == "dlr" )
                    {
                        while ( myloop < parseInt(temp[a+3]) )
                        {
                            this.runtime.createInstance(obj, layer,parseInt(temp[a])+(myloop*mywidth),parseInt(temp[a+1])+(myloop*myheight));
                            ++myloop;
                        } 
                    }
                    if ( temp[a+2].toLowerCase()  == "ulc" )
                    {
                        while ( myloop < parseInt(temp[a+3]) )
                        {
                            this.runtime.createInstance(obj, layer,parseInt(temp[a])+(myloop*mywidth),parseInt(temp[a+1]));
                            this.runtime.createInstance(obj, layer,parseInt(temp[a]),parseInt(temp[a+1])+(myloop*myheight));
                            ++myloop;
                        } 
                    } 
                    if ( temp[a+2].toLowerCase() == "urc" )
                    {
                        while ( myloop < parseInt(temp[a+3]) )
                        {
                            this.runtime.createInstance(obj, layer,parseInt(temp[a])-(myloop*mywidth),parseInt(temp[a+1]));
                            this.runtime.createInstance(obj, layer,parseInt(temp[a]),parseInt(temp[a+1])+(myloop*myheight));
                            ++myloop;
                        } 
                    }
                    if ( temp[a+2].toLowerCase()  == "llc" )
                    {
                        while ( myloop < parseInt(temp[a+3]) )
                        {
                            this.runtime.createInstance(obj, layer,parseInt(temp[a])+(myloop*mywidth),parseInt(temp[a+1]));
                            this.runtime.createInstance(obj, layer,parseInt(temp[a]),parseInt(temp[a+1])-(myloop*myheight));
                            ++myloop;
                        } 
                    } 
                    if ( temp[a+2].toLowerCase() == "lrc" )
                    {
                        while ( myloop < parseInt(temp[a+3]) )
                        {
                            this.runtime.createInstance(obj, layer,parseInt(temp[a])-(myloop*mywidth),parseInt(temp[a+1]));
                            this.runtime.createInstance(obj, layer,parseInt(temp[a]),parseInt(temp[a+1])-(myloop*myheight));
                            ++myloop;
                        } 
                    }
                    if ( temp[a+2].toLowerCase()  == "r" )
                    {
                        while ( myloop < parseInt(temp[a+3]) )
                        {
                            this.runtime.createInstance(obj, layer,parseInt(temp[a])+(myloop*mywidth),parseInt(temp[a+1]));
                            ++myloop;
                        } 
                    }
                    if ( temp[a+2].toLowerCase() == "l" )
                    {
                        while ( myloop < parseInt(temp[a+3]) )
                        {
                            this.runtime.createInstance(obj, layer,parseInt(temp[a])-(myloop*mywidth),parseInt(temp[a+1]));
                            ++myloop;
                        } 
                    }
                    if ( temp[a+2].toLowerCase() == "u" )
                    {
                        while ( myloop < parseInt(temp[a+3]) )
                        {
                            this.runtime.createInstance(obj, layer,parseInt(temp[a]),parseInt(temp[a+1])-(myloop*myheight));
                            ++myloop;
                        } 
                    }
                    if ( temp[a+2].toLowerCase() == "d" )
                    {
                        while ( myloop < parseInt(temp[a+3]) )
                        {
                            this.runtime.createInstance(obj, layer,parseInt(temp[a]),parseInt(temp[a+1])+(myloop*myheight));
                            ++myloop;
                        } 
                    }
                    a = a + 4;
                }
	};


        acts.draw_sprite2 = function (obj, obj2, layer, ostring, owidth, oheight, owidth2, oheight2)
	{
                var mypos = 0;
                var mylength = 0;
                var mywidth = 0;
                var myheight = 0;
                var mywidth2 = 0;
                var myheight2 = 0;
                var myloop = 0;
                var a = 0;
                var temp = new Array();
                var mystring = ostring;
                temp = mystring.split(",");

                mywidth = obj.instances[0].width;
                myheight = obj.instances[0].height;
                mywidth2 = obj2.instances[0].width;
                myheight2 = obj2.instances[0].height;

                if ( owidth > 0 )
                {
                    mywidth = owidth;
                }
                if ( oheight > 0 )
                {
                    myheight = oheight;
                }

                if ( owidth2 > 0 )
                {
                    mywidth2 = owidth2;
                }
                if ( oheight2 > 0 )
                {
                    myheight2 = oheight2;
                }
             
		while ( a < temp.length )
                {	
                    mylength = parseInt(temp[a+3]);
                    myloop = 2;
                    mypos = 1;
                    if ( temp[a+2].toLowerCase()  == "r" )
                    {
                        var inst = this.runtime.createInstance(obj, layer,parseInt(temp[a]),parseInt(temp[a+1]));
                        var inst2 = this.runtime.createInstance(obj2, layer,parseInt(temp[a])+((mywidth+mywidth2)/2),parseInt(temp[a+1]));
                        while ( myloop < mylength )
                        {
                            this.runtime.createInstance(obj, layer,parseInt(temp[a])+(mypos*(mywidth+mywidth2)),parseInt(temp[a+1]));
                            ++myloop;
                            if ( myloop < mylength )
                            {
                                this.runtime.createInstance(obj2, layer,parseInt(temp[a])+(mypos*(mywidth+mywidth2))+((mywidth+mywidth2)/2),parseInt(temp[a+1]));
                            }
                            ++myloop;
                            ++mypos;
                        } 
                    }
                    if ( temp[a+2].toLowerCase()  == "l" )
                    {
                        var inst = this.runtime.createInstance(obj, layer,parseInt(temp[a]),parseInt(temp[a+1]));
                        var inst2 = this.runtime.createInstance(obj2, layer,parseInt(temp[a])-((mywidth+mywidth2)/2),parseInt(temp[a+1]));
                        while ( myloop < mylength )
                        {
                            this.runtime.createInstance(obj, layer,parseInt(temp[a])-(mypos*(mywidth+mywidth2)),parseInt(temp[a+1]));
                            ++myloop;
                            if ( myloop < mylength )
                            {
                                this.runtime.createInstance(obj2, layer,parseInt(temp[a])-(mypos*(mywidth+mywidth2))-((mywidth+mywidth2)/2),parseInt(temp[a+1]));
                            }
                            ++myloop;
                            ++mypos;
                        } 
                    }
                    if ( temp[a+2].toLowerCase()  == "u" )
                    {
                        var inst = this.runtime.createInstance(obj, layer,parseInt(temp[a]),parseInt(temp[a+1]));
                        var inst2 = this.runtime.createInstance(obj2, layer,parseInt(temp[a]),parseInt(temp[a+1])-((myheight+myheight2)/2));
                        while ( myloop < mylength )
                        {
                            this.runtime.createInstance(obj, layer,parseInt(temp[a]),parseInt(temp[a+1])-(mypos*(myheight+myheight2)));
                            ++myloop;
                            if ( myloop < mylength )
                            {
                                this.runtime.createInstance(obj2, layer,parseInt(temp[a]),parseInt(temp[a+1])-(mypos*(myheight+myheight2))-((myheight+myheight2)/2));
                            }
                            ++myloop;
                            ++mypos;
                        } 
                    }
                    if ( temp[a+2].toLowerCase()  == "d" )
                    {
                        var inst = this.runtime.createInstance(obj, layer,parseInt(temp[a]),parseInt(temp[a+1]));
                        var inst2 = this.runtime.createInstance(obj2, layer,parseInt(temp[a]),parseInt(temp[a+1])+((myheight+myheight2)/2));
                        while ( myloop < mylength )
                        {
                            this.runtime.createInstance(obj, layer,parseInt(temp[a]),parseInt(temp[a+1])+(mypos*(myheight+myheight2)));
                            ++myloop;
                            if ( myloop < mylength )
                            {
                                this.runtime.createInstance(obj2, layer,parseInt(temp[a]),parseInt(temp[a+1])+(mypos*(myheight+myheight2))+((myheight+myheight2)/2));
                            }
                            ++myloop;
                            ++mypos;
                        } 
                    }
                    a = a + 4;
                }
	};
	
	//////////////////////////////////////
	// Expressions
	pluginProto.exps = {};
	var exps = pluginProto.exps;
	
	// the example expression
	//exps.myparsestring = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	//{
	//	ret.set_string(this.parsestring);
	//};

}());