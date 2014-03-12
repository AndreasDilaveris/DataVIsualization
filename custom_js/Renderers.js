///////  COMPOSITE PATTERN ( LEAF NODES )


var Arc = new Class({
	
	//
	Extends:RendererAbstract,
	
	//
	properties:null,
	
	//
	options:{		
		// DEFAULT VALUES
		x:0, 
		y:0,
		radius:50,
		lineWidth:38,
		color:'#30f',
		//			
		arcStart:0,
		arcEnd:Math.PI*2,
		counterClock:false,
		fill:false			
	},
	
	//
	initialize: function (dataObject){
		//
		function checkProps(dataObject){		
			//	 check all necessary data is inited and store in reference link
			if (dataObject.x == undefined) dataObject.x = this.options.x;
			if (dataObject.y == undefined) dataObject.y = this.options.y;						
			if (dataObject.radius == undefined) dataObject.radius = this.options.radius;
			if (dataObject.lineWidth == undefined) dataObject.lineWidth = this.options.lineWidth;	
			if (dataObject.color == undefined) dataObject.color = this.options.color;	
			if (dataObject.arcStart == undefined) dataObject.arcStart = this.options.arcStart;	
			if (dataObject.arcEnd == undefined) dataObject.arcEnd = this.options.arcEnd;
			if (dataObject.counterClock == undefined) dataObject.counterClock = this.options.counterClock;
			if (dataObject.fill == undefined) dataObject.fill = this.options.fill;	
			//
			return dataObject;									
		}
		
		var checkClassProps = checkProps.bind(this);
		// 3 options:  set optionss property copying data over, reference external properties object, or use default properties stored in options
		(dataObject) ? this.properties = checkClassProps(dataObject) : this.properties = this.options ;	
		//
	},		
		
	//
	render: function(ctx){
		var p = this.properties;
		//	
		ctx.beginPath();		
		ctx.arc( p.x, p.y, p.radius, p.arcStart, p.arcEnd, p.counterClock );
		//
		ctx.lineWidth = p.lineWidth;
		(!this.properties.fill)?  ctx.strokeStyle = p.color : ctx.fillStyle = p.color;
		(!this.properties.fill)?  ctx.stroke() : ctx.fill();
		//
					
	},
	
	update: function(){},
	
	// GetterSetters
	
	x: function (x){
		if(!x) return this.properties.x
		return this.properties.x = x 
		},
		
	y: function (y){
		if(!y) return this.properties.y
		return this.properties.y = y
		},	
		
	radius:  function (radius){
		if(!radius) return this.properties.radius
		return this.properties.radius = radius
		},
		
	lineWidth: function (width){
		if(!width) return this.properties.lineWidth
		return this.properties.lineWidth = width		
		},
		
	color:  function (color){
		if(!color) return this.properties.color
		return this.properties.color = color		
		},
					
	arcStart: function (arcStart){
		if(!arcStart) return this.properties.arcStart
		return this.properties.arcStart = arcStart		
		},
		
	arcEnd:  function (arcEnd){
		if(!arcEnd) return this.properties.arcEnd
		return this.properties.arcEnd = arcEnd		
		},
		
	counterClock: function (counterClock){
		if(!counterClock) return this.properties.counterClock
		return this.properties.counterClock = counterClock		
		}			
});




//
//




var Line = new Class({  // EXAMPLE leaf NODE subClass
	//
	Extends:RendererAbstract,
	//
	options:{
		lineWidth: 1,
		color: 'rgb(0,0,0)',		
		start:{
			x:0,
			y:0
		},
		end:{
			x:0,
			y:0
		}			
	},
	//	
	initialize: function(props){
		this.parent(props); 
	},
	//		
	setLineStyle: function(thickness, color){	
		var ops = this.options;
		ops.lineWidth = thickness;
		ops.color = color;	
		//			
	},
	
	//	
	update: function(){	
	 	//ctx.moveTo(ops.start.x, ops.start.y);
	  	//ctx.lineTo(ops.end.x, ops.end.y);		
		//			
	},

	render: function(ctx){
		//
		var ops = this.options;
		ctx.lineWidth = ops.lineWidth
		ctx.strokeStyle = ops.color
		//
		ctx.beginPath();		
	 	ctx.moveTo(ops.start.x, ops.start.y);
	  	ctx.lineTo(ops.end.x, ops.end.y);
		//
		ctx.stroke();			
	},
	
	color:  function (color){
		if(!color) return this.properties.color
		return this.properties.color = color		
		},
		
	lineWidth: function (width){
		if(!width) return this.properties.lineWidth
		return this.properties.lineWidth = width		
		},	
		
	startX:  function (x){
		if(!x) return this.properties.start.x;
		return this.properties.start.x = x;	
		},
		
	startY:  function (y){
		if(!y) return this.properties.start.y;
		return this.properties.start.y = y;	
		},
						
});	


//


var CanvasFill = new Class({
	//
	Extends:RendererAbstract,
	//
	options:{
		width: 0,
		height: 0,
		color: 0
	},

	_randomizer: function(range){
		return Math.round(Math.random()*range);
	}.protect(),
	
	//		
	setColor: function(){
		return 'rgb('+this._randomizer(255)+','+this._randomizer(255)+','+this._randomizer(255)+')';
	},
	
	//	
	update: function(){
		//this.options.color = this.setColor();
		//if(++this.options.itterator>100) this.toBeRemoved = true 
	},
		
	//			
	render: function(ctx){
		var ops = this.options;		
		ctx.fillStyle = ops.color
		ctx.fillRect (0, 0, ops.width, ops.height);		
	}
							
});


//


var CanvasClearer = new Class({
	//
	Extends:RendererAbstract,
	
	//
	options:{
		width: 0,
		height: 0
	},
	
	//	
	update: function(){},
		
	//		
	render: function(ctx){
		var ops = this.options;
		ctx.clearRect(0,0,ops.width,ops.height);
	}
								
});


//


var ImageRender = new Class({  // EXAMPLE leaf NODE subClass
	//
	Extends:RendererAbstract,
	
	//
	options:{
		w: 0,
		h: 0,
		posx:0,
		posy:0,
		x: 0,//window.innerWidth/2,
		y: 0,//window.innerHeight/2	
		initiated: false				
	},
	
	initialize: function (options){
		if(options) this.parent(options);
		//
		var ops = this.options;
	    ops.imageObj = new Image();
	    //
	    ops.imageObj.onload = function(){
			ops.w = this.width;
			ops.h = this.height;
			ops.x = ops.posx-ops.w/2;
			ops.y = ops.posy-ops.h/2;
			ops.initiated = true						
		/*	*/
	    };
   		ops.imageObj.src = ops.imgPath;		
	},	
	
	//	
	update: function(){	
		//
		/*
		var ops = this.options;
		//
		if( reason) {
			this.options.toBeRemoved = true;
		}
		*/
		//				
	},	
		
	//
	render: function(ctx){
		//ctx.clearRect(0,0,1000,800)
		//
		var ops = this.options;
		//
		if(ops.initiated) ctx.drawImage( ops.imageObj, ops.x,ops.y );			
	}
});

