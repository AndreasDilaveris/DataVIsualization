// JavaScript Document


//////////////////// BUILDER PATTERN //////////////////////////////////////// 


var Piebuilder = new Class({
	
	vo:null,
	
	initialize: function(RadialDataVO){
		this.vo = RadialDataVO
	},
	

	make: function (){
		var comp = this.buildComposite();
		for (var x =0 ; x < this.vo.data.length; x++){
			this.vo.data[x].checkvalues()
			for (var e =0 ; e < this.vo.data[x].numberOfProjects(); e++){
				
				// alert( vo.data[x].projects[e].radius)
				var arc = this.buildArc( this.vo.data[x].projects[e] ) ;
				arc.radius((x+1)*28) ;
				
				//TweenMax.from(arc, 1, {radius:arc.arcStart() } );
				TweenMax.from(arc, .5, {arcEnd:arc.arcStart(), delay:(x*e)*.03 } ) ;
				comp.addToStack( arc ) ;
			
			}
		}
		return comp		
	},	
	
	make2: function (){
		var comp = this.buildComposite();
		for (var x =0 ; x < this.vo.data.length; x++){
			this.vo.data[x].checkvalues()
			for (var e =0 ; e < this.vo.data[x].numberOfProjects(); e++){
				
				// alert( vo.data[x].projects[e].radius)
				var arc = this.buildArc( this.vo.data[x].projects[e] ) ;
				arc.radius((x+1)*28) ;
				
				TweenMax.from(arc, 1, {radius:arc.arcStart() } );
				//TweenMax.from(arc, .5, {arcEnd:arc.arcStart(), delay:(x*e)*.03 } ) ;
				comp.addToStack( arc ) ;
			
			}
		}
		return comp		
	},		
	
	
	//////////////////////////////////// using onComplete ///////////////////////////////////
	
	//sequenceIterators:[0,0],
	
	makeSequential: function(comp, n,m){
		
		if(comp == null){
			this.sequenceIterators=[0,0];
			var comp = this.buildComposite();
			this.makeSequential(comp,	this.sequenceIterators[0], 	this.sequenceIterators[1])
			return comp;		
		}
		
		var _this = this
		if ( this.sequenceIterators[0] >= this.vo.data.length ) { return } ;
		
		(_this.sequenceIterators[1] < this.vo.data[_this.sequenceIterators[0]].projects.length-1 ) ? 
			function(){ _this.sequenceIterators[1]++ }() : 
			function(){ _this.sequenceIterators[1] = 0 ; _this.sequenceIterators[0]++ }() ;
		
		//	
		var arc = this.buildArc( this.vo.data[n].projects[m]) ;
		arc.radius( (n+1)*28 );
		//TweenMax.from(arc, .1, {radius:arc.arcStart(), onComplete: function(){ ;_this.makeSequential(comp, _this.sequenceIterators[0], _this.sequenceIterators[1])} } );
		TweenMax.from(arc, .3, { arcEnd:arc.arcStart(), onComplete: function(){ ;_this.makeSequential(comp, _this.sequenceIterators[0], _this.sequenceIterators[1])} } );
		comp.addToStack( arc ) ;	
	},
	////////////////////////////////////
	
	buildComposite: function (){
		return new ContentRenderer()
	},		
	
	buildArc: function (arcProps){
		return new Arc(arcProps)
	},
});
