/* c2MathFunction.js v 1.0

Have fun, Joe7

*/

var idOffScreenCanvas = "";
var myGraph = "";
var offScreenCanvas= "";

function loadObj(currentCanvas, minX, maxX, minY, maxY, stepRangeX, stepRangeY, stepXValues, strokeWidthAxes, strokeWidthGraph, axesColor, graphColor, arrowsAxes, stepTicks, stepDigits, axesChars, functionString)
{
		var tempFunctionString= functionString.replace(/["'()*\/.+-,]/g, "Y"); // replace these characters for the idname
				
		idOffScreenCanvas= tempFunctionString+Math.floor(Math.random()*100).toString(); // if one file is loaded more than once
		createOffScreenCanvas(idOffScreenCanvas, currentCanvas);
		initIt(currentCanvas, minX, maxX, minY, maxY, stepRangeX, stepRangeY, stepXValues, strokeWidthAxes, strokeWidthGraph, axesColor, graphColor, arrowsAxes, stepTicks, stepDigits, axesChars, functionString);
}

function createOffScreenCanvas(idOffScreenCanvas, currentCanvas) // invisible canvas at the left side on the top of the page
{
		offScreenCanvas = document.createElement('canvas');
		offScreenCanvas.setAttribute('id', idOffScreenCanvas);
		
		offScreenCanvas.setAttribute('width', currentCanvas.width);
		offScreenCanvas.setAttribute('height',  currentCanvas.height);
		offScreenCanvas.style.background = "green";
		offScreenCanvas.style.position= "absolute",
        offScreenCanvas.style.top= "10px",
        offScreenCanvas.style.left= "10px",
		offScreenCanvas.style.visibility = "hidden";  // debug comment out
		document.body.appendChild(offScreenCanvas);
}
	
function initIt(currentCanvas, minX, maxX, minY, maxY, stepRangeX, stepRangeY, stepXValues, strokeWidthAxes, strokeWidthGraph, axesColor, graphColor, arrowsAxes, stepTicks, stepDigits, axesChars, functionString)
{
		myGraph = new MathFunction.Graph(offScreenCanvas);
		
		myGraph.setParameter('StepRangeX', stepRangeX);
		myGraph.setParameter('StepRangeY', stepRangeY);
		myGraph.setParameter('StepXValues', stepXValues);
		myGraph.setParameter("MinX",minX);
		myGraph.setParameter("MaxX",maxX);
		myGraph.setParameter("MinY",minY);
		myGraph.setParameter("MaxY",maxY);
		
		myGraph.setParameter("AxesStrokeWidth",strokeWidthAxes);
		myGraph.setParameter("AxesColor",axesColor);
		
		myGraph.setParameter("GraphStrokeWidth",strokeWidthGraph);
		myGraph.setParameter("GraphColor",graphColor);
		
		myGraph.setParameter("ArrowsAxes",arrowsAxes);
		myGraph.setParameter("StepTicks",stepTicks);
		myGraph.setParameter("StepDigits",stepDigits);
		myGraph.setParameter("AxesChars",axesChars);
		
		myGraph.init();
		myGraph.prepareAxes();
		myGraph.drawFunction(functionString);
}

function getOffscreenCanvasId()
{
	return idOffScreenCanvas;
}

function getCurrentGraph()
{
	return myGraph;
}

function copy2Canvas(offScreenCanvasId, receiverCanvas)
{
		var myCanvasId= "#"+offScreenCanvasId;
		//console.log("copy"+myCanvasId);
		var tempOffScreenCanvas = $(myCanvasId).get(0);
		var ctx2 = receiverCanvas.getContext("2d");
		ctx2.drawImage(tempOffScreenCanvas, 0, 0);
}



/**
	@namespace MathFunction
**/

MathFunction = {};


/**
	@class Graph

	
*/
MathFunction.Graph = function(canvas) 
{
		this.params = 
		{
			StepRangeX: 1,
			StepRangeY: 1,
			MaxX: 5,
			MinX: -5,
			MaxY: 5,
			MinY: -5,
			StepDigits: true,
			StepTicks: true,
			ArrowsAxes: true,
			AxesChars: true,
			StepXValues: 1,
			AxesStrokeWidth: 1,
			GraphStrokeWidth: 1,
			AxesColor: "rgb(0,0,0)",
			GraphColor: "rgb(0,0,0)"
		};


		this.stepRangeX= 1;
		this.stepRangeY= 1;

		this.width = canvas.width;
		this.height = canvas.height;		
		this.maxX = 5;
		this.minX = -5;		
		this.maxY = 5;
		this.minY = -5;
		
		this.stepDigits = true;
		this.stepTicks = true;
		this.arrowsAxes = true;
		this.axesChars = true;
		this.stepXValues= 1;		
		
		this.axesStrokeWidth = 1;
		this.graphStrokeWidth = 1;
		this.axesColor = "rgb(0,0,0)";
		this.graphColor = "rgb(0,0,0)";		
		
		this.canvas = canvas;
}

MathFunction.Graph.prototype.init = function() 
{
	this.stepRangeX = parseFloat(this.params['StepRangeX']);
	this.stepRangeY = parseFloat(this.params['StepRangeY']);

	this.minX = parseInt(this.params['MinX']);
	this.maxX = parseInt(this.params['MaxX']);
	this.minY = parseInt(this.params['MinY']);
	this.maxY = parseInt(this.params['MaxY']);

	this.arrowsAxes = this.params['ArrowsAxes'];
	this.stepTicks = this.params['StepTicks'];
	this.stepDigits = this.params['StepDigits'];

	this.axesChars = this.params['AxesChars'];
	
	this.stepXValues = parseFloat(this.params['StepXValues']);
	
	this.axesStrokeWidth = parseFloat(this.params['AxesStrokeWidth']);
	this.graphStrokeWidth = parseFloat(this.params['GraphStrokeWidth']);
	this.axesColor = this.params['AxesColor'];
	this.graphColor = this.params['GraphColor'];

	try 
	{
		this.ctx = this.canvas.getContext('2d');
	}
	catch(e) 
	{
		this.ctx = null;
	}

}

MathFunction.Graph.prototype.setParameter = function( name , value) 
{
	this.params[name] = value;
};

MathFunction.Graph.prototype.repaintStage = function()  // clears all drawn functions 
{
	this.ctx.clearRect(0,0, this.width, this.height);	
	//this.prepareAxes(); // paint the Axes again
}

MathFunction.Graph.prototype.prepareAxes = function() 
{
 	this.ctx.lineWidth = this.axesStrokeWidth;
	this.ctx.strokeStyle = this.axesColor;
	this.ctx.fillStyle = this.axesColor; // for the letters	
	
	// +x axis
	this.ctx.beginPath();
	this.ctx.moveTo( this.CartesianX(0) , this.CartesianY(0) );
	this.ctx.lineTo( this.CartesianX( this.maxX ) , this.CartesianY(0) ) ;
	this.ctx.stroke() ;	
	
 	// -x axis
	this.ctx.beginPath() ;
	this.ctx.moveTo( this.CartesianX(0), this.CartesianY(0) );
	this.ctx.lineTo( this.CartesianX( this.minX ) , this.CartesianY(0) ) ;
	this.ctx.stroke() ; 	
 	

 	// +y axis
	this.ctx.beginPath() ;
	this.ctx.moveTo( this.CartesianX(0) , this.CartesianY(0) ) ;
	this.ctx.lineTo(this.CartesianX(0) , this.CartesianY( this.maxY ) ) ;
	this.ctx.stroke() ;

 	// -y axis
	this.ctx.beginPath() ;
	this.ctx.moveTo( this.CartesianX(0) , this.CartesianY(0)) ;
	this.ctx.lineTo( this.CartesianX(0) , this.CartesianY( this.minY )) ;
	this.ctx.stroke();
	
	// origin
	if (this.stepDigits)
	{	
		this.ctx.fillText( "0" , this.CartesianX(0.1) , this.CartesianY(0) + 15);
		this.ctx.fillText( "0" , (this.CartesianX(0) - 15), this.CartesianY(0.1));
		
	}
 	
 	// +x tick marks
	if (this.stepTicks)
	{ 	
 		for (var i = 1 ; (i * this.stepRangeX) < this.maxX ; i++) 
 		{
  			this.ctx.beginPath() ;
  			this.ctx.moveTo(this.CartesianX(i * this.stepRangeX),this.CartesianY(0) - 5 );
  			this.ctx.lineTo(this.CartesianX(i * this.stepRangeX),this.CartesianY(0) + 5 );
  			this.ctx.stroke();
  			if (this.stepDigits) this.ctx.fillText( i * this.stepRangeX , this.CartesianX(i * this.stepRangeX-0.08) , this.CartesianY(0) + 15);  
 		}
 	}			
	
	// +x Arrow
	if (this.arrowsAxes)
	{	
		this.ctx.beginPath();
		this.ctx.moveTo( this.CartesianX( this.maxX ) , this.CartesianY(0) );
		this.ctx.lineTo( this.CartesianX( this.maxX  - 0.2 ) , this.CartesianY(0.1) );
		this.ctx.moveTo( this.CartesianX( this.maxX ) , this.CartesianY(0) );
		this.ctx.lineTo( this.CartesianX( this.maxX  - 0.2 ) , this.CartesianY(-0.1) );
		this.ctx.stroke();
	}
	if (this.axesChars)
	{
		this.ctx.fillText(" x", this.CartesianX( this.maxX  - 0.5 ) , this.CartesianY(-0.3) );
	}
	
	 // -x tick marks
	if (this.stepTicks)
	{ 	
 		for (var i = -1 ; (i * this.stepRangeX) > this.minX ; i--) 
 		{
  			this.ctx.beginPath() ;
  			this.ctx.moveTo( this.CartesianX( i * this.stepRangeX) , this.CartesianY(0) - 5 );
  			this.ctx.lineTo( this.CartesianX( i * this.stepRangeX) , this.CartesianY(0) + 5 );
  			this.ctx.stroke();
  			if (this.stepDigits) this.ctx.fillText( i * this.stepRangeX , this.CartesianX( i * this.stepRangeX - 0.08) , this.CartesianY(0) + 15);  
 		}
 	}			
	
	// -x Arrow
	if (this.arrowsAxes)
	{	
		this.ctx.beginPath();
		this.ctx.moveTo( this.CartesianX( this.minX ) , this.CartesianY(0) );
		this.ctx.lineTo( this.CartesianX( this.minX  + 0.2 ) , this.CartesianY(0.1) );
		this.ctx.moveTo( this.CartesianX( this.minX ) , this.CartesianY(0) );
		this.ctx.lineTo( this.CartesianX( this.minX  + 0.2 ) , this.CartesianY(-0.1) );
		this.ctx.stroke();
	}
	if (this.axesChars)
	{
		this.ctx.fillText( "-x" , this.CartesianX( this.minX  + 0.3 ) , this.CartesianY(-0.3) );
	}

 	// +y tick marks
 	
	if (this.stepTicks)
	{ 	
 		for (var i = 1 ; (i * this.stepRangeY) < this.maxY ; i++) 
 		{
  			this.ctx.beginPath() ;
  			this.ctx.moveTo( this.CartesianX(0) -5 , this.CartesianY(i * this.stepRangeY) );
  			this.ctx.lineTo( this.CartesianX(0) +5 , this.CartesianY(i * this.stepRangeY) );
  			this.ctx.stroke();
			
			if (this.stepDigits)
			{  			
  				if (this.stepRangeY < 1) this.ctx.fillText( i * this.stepRangeY , this.CartesianX(-0.8) , this.CartesianY( i * this.stepRangeY )); 

				//two digits  		
  				else this.ctx.fillText( i * this.stepRangeY , this.CartesianX(-0.5) , this.CartesianY( i * this.stepRangeY ));
  			}
   	}
   }			
	
	// +y Arrow
	if (this.arrowsAxes)
	{	
		this.ctx.beginPath();
		this.ctx.moveTo( this.CartesianX( 0 ) , this.CartesianY( this.maxY ) );
		this.ctx.lineTo( this.CartesianX( -0.1 ) , this.CartesianY( this.maxY - 0.2 ) );
		this.ctx.moveTo( this.CartesianX( 0 ) , this.CartesianY( this.maxY ) );
		this.ctx.lineTo( this.CartesianX( 0.1 ) , this.CartesianY( this.maxY - 0.2 ) );
		this.ctx.stroke();
	}
	if (this.axesChars)
	{
		this.ctx.fillText( " y" , this.CartesianX( - 0.5 ) , this.CartesianY( this.maxY - 0.2) );
	}	
	
	 // -y tick marks
	if (this.stepTicks)
	{ 	
 		for (var i = -1 ; (i * this.stepRangeY) > this.minY ; i--) 
 		{
  			this.ctx.beginPath() ;
  			this.ctx.moveTo( this.CartesianX(0) -5 , this.CartesianY(i * this.stepRangeY) );;
  			this.ctx.lineTo( this.CartesianX(0) +5 , this.CartesianY(i * this.stepRangeY) );
  			this.ctx.stroke();
  			
			if (this.stepDigits)
			{  			
  				if (this.stepRangeY < 1) this.ctx.fillText( i * this.stepRangeY , this.CartesianX(-0.8) , this.CartesianY( i * this.stepRangeY )); 

				//two digits  		
  				else this.ctx.fillText( i * this.stepRangeY , this.CartesianX(-0.5) , this.CartesianY( i * this.stepRangeY ));
  			}
 		}
 	}			
	
	// -y Arrow
	if (this.arrowsAxes)
	{	
		this.ctx.beginPath();
		this.ctx.moveTo( this.CartesianX( 0 ) , this.CartesianY( this.minY ) );
		this.ctx.lineTo( this.CartesianX( -0.1 ) , this.CartesianY( this.minY + 0.2 ) );
		this.ctx.moveTo( this.CartesianX( 0 ) , this.CartesianY( this.minY ) );
		this.ctx.lineTo( this.CartesianX( 0.1 ) , this.CartesianY( this.minY + 0.2 ) );
		this.ctx.stroke();
	}
	if (this.axesChars)
	{
		this.ctx.fillText( "-y" , this.CartesianX( - 0.5 ) , this.CartesianY( this.minY + 0.2) );
	}
	this.ctx.restore();
}

MathFunction.Graph.prototype.drawFunction= function (functionString) 
{
	try 
	{
		this.ctx.beginPath();
		this.ctx.lineWidth = this.graphStrokeWidth;
		this.ctx.strokeStyle = this.graphColor;
		
		var goToFirstPosition= true; 		
				
		for (var x = this.minX ; x < (this.maxX+this.stepXValues); x+= this.stepXValues) 
  		{
			var tempFunctionString = functionString.replace(/x/g, x); // put the numbers in the functionstring			
			
			var functionValue = eval(tempFunctionString); 
			

  			if (goToFirstPosition)
  			{
  				this.ctx.moveTo(this.CartesianX(this.minX),this.CartesianY(functionValue)) ;
  				goToFirstPosition= false;
  			}
  			
  			else // default except first value 
  			{
				if ( ( functionValue >= this.minY) && (functionValue <= this.maxY) ) // draw only when in y-Range    			
    				this.ctx.lineTo(this.CartesianX(x),this.CartesianY(functionValue)) ;
			}
   		}	
	}
	catch(e) 
	{
		return false;
	} 	
  	
   this.ctx.stroke() ;
   this.ctx.restore();

}

// get the cartesian x
MathFunction.Graph.prototype.CartesianX = function (x)
{
	return (x - this.minX) / (this.maxX - this.minX) * this.width ;
}

// get the cartesian y
MathFunction.Graph.prototype.CartesianY = function (y) 
{
  return this.height - (y - this.minY) / (this.maxY - this.minY) * this.width ;
}

