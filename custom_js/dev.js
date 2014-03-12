(function  (){
	if (document.getElementById && document.getElementsByTagName) {
		(window.addEventListener)? window.addEventListener('load', Client, false) :
			(window.attachEvent)? window.attachEvent('onload', Client) :
				window.addEvent('domready', Client);
	}
})();

var vo
var graph;
var builder;

var buttonTest = function(str){
	graph = (Math.random()*10<5)? builder.make() : builder.make2();
}

function Client(){	
	var cs = new CanvasStack( null,{ width:400, height:400 } );
	var ctx = cs.getContextLayer();
	var w = cs.getCanvasLayer().width;
	var h  = cs.getCanvasLayer().height;
	var center= {x:w/2, y:h/2};
	
	//  --  $$('.year').setStyle( 'display', 'none' );	
	
	var holder = new Element('div', { styles: {
				float:'left',
				width:'1400px'	
			} } ) ;
			
	holder.inject( $('PageContent') ) ; 
	$$('.year').inject(holder) ; 
	//$$('.year')
	
	var workdata = $$('#work_data') ;
	$(cs).inject(workdata[0]) ;
	
	workdata[0].setStyles( {float:'left'} ) ;
	
	var tip = new ToolTip();
	$(tip).inject(document.body);	
	

	var tLine = new TimeLineRenderer(ctx,{ framerate:30 });
	
	tLine.addToStack( new CanvasClearer ( { width:w, height:h } ) ) ;
	//tLine.addToStack( new CanvasFill ( { color:'rgb(120,120,120)', width:w, height:h } ) );
	
	// collects data from page - organizes it into Piebuilder specific format
	vo = new CollectData() ;
	
	builder = new Piebuilder(vo) ;
	
	// sets up renderers base on RadialDataVO info
	graph =  builder.make() ;
	//var graph =  builder.makeSequential()
	
	tLine.addToStack(graph) ;

	var line = tLine.addToStack( new Line({color: 'rgb(80,80,80)', thickness: 1 }) ) ;
	
	var pointerDot = tLine.addToStack( new Arc( { x: center.x, y: center.y, arcStart: 0 , arcEnd:  Math.PI*2, color : 'rgb(50,50,50)' , width : 1, radius : 2, fill:true })) ;
	
	tLine.start() ;
	
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//  Event Handling
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	
	cs.getCanvasLayer().addEvent('mousemove', function(event){ 
		var adj =  event.page.x - (this.getPosition().x+ center.x);
    	var op =  event.page.y - (this.getPosition().y+ center.y);   	
		var ang =  BasicTrig.angle(op, adj);
		//
		line.options.start.x =  center.x;
		line.options.start.y =  center.y;
		line.options.end.x = Math.cos(ang)*180+center.x;
		line.options.end.y = Math.sin(ang)*180+center.y;
		pointerDot.properties.x = event.page.x - this.getPosition().x;
		pointerDot.properties.y = event.page.y - this.getPosition().y;	
		//
	} );


	var pos = function (data, x,y, rad, ang){
		for (var n=0; n< data.length; n++){ 
			var segment = data[n];
			$(segment.properties).setStyles({backgroundColor:'#000', color:'#fff'});
			$(segment.properties).getElements('a')[0].setStyles({color:'#fff'})
		}
		for (var n=0; n< data.length; n++){ 		
			var segment = data[n] //data[n].projects;
				//var segment = circle.renderStack[n]//vo.projectData(n, t)
				
				if( rad>(segment.radius()-segment.lineWidth() / 2) && rad<(segment.radius()+segment.lineWidth()/2) && ang>segment.arcStart() && ang<segment.arcEnd()){
					tip.setContent( $(segment.properties).clone() );
					$(segment.properties).setStyles( { backgroundColor:segment.properties.color, color:'#000' } );
					$(segment.properties).getElements('a')[0].setStyles({color:'#000'})
					tip.tempGetAnchor(segment.properties.color)
					tip.reposition( x, y );
					tip.show()	
					return			 
				}
		}
		tip.hide()
	}

	cs.getCanvasLayer().addEvent('click', function(event){ 
     	var adj =  event.page.x - (this.getPosition().x+ center.x) ;
    	var op =  event.page.y - (this.getPosition().y+ center.y) ;   	
		var rad =  BasicTrig.hypotenuse(op, adj) ;
		var ang =  BasicTrig.angle(op, adj) ;
		if(ang<0) ang+=2*Math.PI
		// ugly hack to compensate for addition of 1.5*Math.PI in Additional >> RadialDataVO.addCalendarData
		// since all values are are being increased by
		ang=(ang<1.5*Math.PI)?ang+2*Math.PI:ang;
		pos( graph.renderStack, event.page.x, event.page.y, rad,ang) ; 
   	} )			
}