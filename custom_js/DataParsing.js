// Goal to find a way to standardize the data collection

var CollectData = new Class({		

	data:[],

	// ** EXTRACTS FROM HTML PAGE **
		
	initialize : function(){
		this.organize() ;
	},
	
	organize : function(){
		var elements = $$('.year') ;
		elements.each( function(item, index){	
			this.data.push( this.getCustomVO(item) ) ;					
		}, this) ;
	},
	
	setData : function(selectorString){
		this.data=[];
		var elements = $$(selectorString) ;
		elements.each( function(item, index){	
			this.data.push( this.getCustomVO(item) ) ;					
		}, this) ;
	},	
	
	getCustomVO: function(itm){
		//return new PieChartSliceVO(itm);
		return new PieChartVO(itm);
	},	
			
});



//////////////////// VARIABLE OBJECTS //////////////////////////////////////// 



var VO = new Class({
	
	initialize:function(el){
		this.element = document.id(el);
		this.setValues(this.convertData());
	},
	
	toElement:function(){
		return this.element
	},
	
	
	/////////////////
	
	/*
	This method allows you do mass set properties for the VO classes.  
	Ex.  
	dataInstance.setValues( { prop1:'p1', prop2:'p2' })
	results in: 
		dataInstance.prop1  => 'p1'  	
		dataInstance.prop2  => 'p2';
	*/
	
	setValues: function (object){
		Object.each(object, function(item, key){
			this[key] = item
		}, this) ;
		return this;		
	},
	
	convertData: function(){
		alert(this +' convertData not overriden');	
	}
})
	

	/////////////////
	
	/*
	
	By using nested VOs multiple stored sources of content will exist. 
	ex.  the piechartVO itsel will point to an element on which you can use get element to collect nestested elements
	but piechartVO also contains a projects variable that points to an array populated with PieChartSliceVO VOs that return the same nested elements
	
	*/
		

var PieChartVO = new Class({
	
	Extends:VO,	
	
	convertData: function(){
		
		var date = this.element.getElement('h1') ;
		var el = this.element.getElements('div') ;
		
		var arr = [] ;
		el.each( function(item, indx){ 
			arr.push( new PieChartSliceVO (item) ) ;
		},this) ;					

		//var discipline = this.disciplines[ this.element.get('class') ] ;
		
		return {
			date: date,
			projects: arr		
		}	
	},
		
	numberOfProjects: function(){
		return this.projects.length
	},
	
	checkvalues: function(){
		var n = this.numberOfProjects();
		//alert(this.projects.length)
		var all = 0;
		for(var s=0;s<n;s++){
			all+=this.projects[s].getDegrees();
		} ;
		//if(all>360) alert('value error') ;
	}
	
}) ;


//////////// DECORATOR


var PieChartSliceVO = new Class({
	
	Extends:VO,
	
	center: {x:400/2, y:400/2},
	
	circleStartPoint: 0+1.5*Math.PI,
	
	disciplines: {
		design: {			
			color: 'rgb(55,210,255)',
			radius: 28,
			width:24			
		},
		motiongraphics: {
			color: 'rgb(255,55,173)',
			radius: 28,
			width:24			
		},
		teaching: {
			color: 'rgb(180,231,173)',
			radius: 28,
			width:24				
		},	
		development: {
			color: 'rgb(255,253,107)',
			radius: 28,
			width:24				
		}						
	},	
	
		
	
	////////////////////////////////////////////////////////////////////////////////////////////////
	// Tools for converting html data to specific ArcFriendly Data
	////////////////////////////////////////////////////////////////////////////////////////////////
	
	
	convertData: function(){
		//itm.getElement('.startDate').innerHTML
		
		var _strt = this.convertDates(  this.extractDates('.startDate') ) + this.circleStartPoint ;
		var _end =  this.convertDates( this.extractDates('.endDate') ) + this.circleStartPoint ;						
			
		// UGLY HACK to compensate for the fact that circle does not close if final value is 0 ( if final val is Jan 1st next year it treats it as 0 )
		// doesn't belong here
		if (_end < _strt) _end += Math.PI*2	;
		
		var discipline = this.disciplines[ this.element.get('class') ] ;
		
		return {
			
			// - Arc Properties
			
			x: this.center.x,
			y: this.center.y,			
			arcStart: _strt,
			arcEnd: _end,
			
			//
			color : discipline.color,
			lineWidth : discipline.width,
			radius : discipline.radius,
			//
			counterClock:false,
			fill:false	
		}	
	},
	
	extractDates: function (selector){
		return Calendar.createDateArray( this.element.getElement(selector).innerHTML );
	},	
	
	// Internal	
	
	dayToRadians: function(month, day){
		// -1 to include the first day indicated in the value >> to arc graphics
		return BasicTrig.angleRatio(Calendar.addDays(month, day)-1, 365);
	},			
	
	convertDates: function (DateArray){
		return this.dayToRadians( DateArray[1], DateArray[0]);
	},
	
	getDegrees: function(){
		return this.arcStart - this.arcEnd;
	}		
			
}) ;

