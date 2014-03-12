
var CanvasStack = new Class({
	// *****
	// *****
	container: null,
	canvasStack: null, 
	width:1000,
	height:800,
	x:0,
	y:0,
	
	initialize: function(div, size){
		var _size =(size)? size : {};
		
		this.container = new Element('div', {
			id:'canvasContainer',
			styles:{
				margin:'0px 0px 0px 20px'
			}
		})
		//
		if (_size.width) this.width = _size.width ;
		if (_size.height) this.height = _size.height ;
		
		this.canvasStack = [];
		this.addCanvasLayer('layer1')
	},

	//
	addCanvasLayer: function ( name, size ){
		var _size =(size)? size : {};
		var canvas =  new Element ('canvas', {
			id: (name)? name : 'layer'+(this.canvasStack.length+1).toString(),
			styles:{
				display:'block',
				position:'relative',
				zIndex: this.canvasStack.length+1,
				//top: (size.x)? size.x.toString()+'px' : '0px',
				//left: (size.y)?	size.y.toString()+'px' : '0px'						
			}
		});
		canvas.width = (_size.width)? _size.width : this.width;
		canvas.height = (_size.height)? _size.height : this.height;
		//(_size.x)? canvas.left = _size.x : canvas.left = this.x;
		//(_size.y)? canvas.top = _size.y : canvas.top = this.y;				
			
		// must fix	
		var context = canvas.getContext('2d')	
		
		this.canvasStack.push( {canvas:canvas, context:context} )
		canvas.inject(this.container);
		
		return this.canvasStack[this.canvasStack.length-1]
	},	
	
	//
	getCanvasLayer: function(num){
		return this.canvasStack[(num)?num:0].canvas
	},
	
	//
	getContextLayer: function(num){
		return this.canvasStack[(num)?num:0].context
	},
	
	toElement: function(){
		return this.container
	}
	
});


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////  


var ToolTip = new Class({
	//	
	initialize: function(){ 
	
		this.tooltip = new Element('div#tooltip',{
			styles:{							
				position:'absolute',
				zIndex:100
			}
		});
		
		this.background = new Element('div#tooltipBG');

		var img = new Image();
		img.src = 'images/pointer2.png';	
		this.image = $(img);
		this.image.setStyles({
				overflow:'hidden',
				padding:'0px',
				margin:'-25px 0px 0px 0px'				
			});
				
		this.tooltip.adopt( this.background , this.image);	
		this.tooltip.setStyle('opacity',0);
				
	},
	
	setContent: function(content){
		this.background = content.replaces(this.background).set('id', 'tooltipBG')			
	},	

	reposition: function(x,y){
		//	
		//var dimensions = $(tip).getSize();
		var dimensions = this.tooltip.measure(
				function(){
					return this.getSize()
				})	
		//		
		this.tooltip.set({
				styles:{
					top:(y-dimensions.y),
					left:(x)
				}
			});
	},	
	
	show: function(){	
		this.tooltip.fade('in');		
	},
	
	hide: function(){	
		this.tooltip.fade('out');				
	},
	
	toElement: function(){
		return this.tooltip;
	},
	
	
	tempGetAnchor: function(clr){
		$(this.background).getElements('h3')[0].setStyles({color:clr})
		$(this.background).getElements('a')[0].setStyles({color:clr})
	}
});	
/**/		

