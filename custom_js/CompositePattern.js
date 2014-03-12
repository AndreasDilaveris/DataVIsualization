///////  COMPOSITE PATTERN ( COMPOSITE )
// test

var RendererAbstract = new Class({  // leaf NODE
	
	//
	Implements:[Options],
	
	//
	options:{
		id: 'Composite',
		progressiveRender: false, 	
		toBeRemoved: false,
		completed: false,		
		itterator: 0
	},
	
	//
	initialize: function(props){
		if (props) this.setOptions(props);    
	},
	
	// - used to actually render content to canvas
	render: function(ctx){
		alert(this +' render not overriden');	
	},
	
	// - used to update properties of render action
	update: function(){
		// should containt remove object code ?
		alert(this +' update not overriden');		
	},
	
	// - used to indicate that a preset action has completed
	complete: function(){
		return this.options.completed;
	},

	// - used to indicate whether the instance should be removed from it's parent renderStack
	remove: function(){
		return this.options.toBeRemoved;
	}
	
});


/////////


var ContentRenderer = new Class({		
	//
	Extends: RendererAbstract,	
	//
	renderStack:[],
	
	// - internal method that checks to see if child should be removed from renderStack
	_inspectChildren: function (){
		var renderList = this.renderStack.concat();
		for (var rObj = 0; rObj< renderList.length; rObj++){
				 //renderList[rObj] != undefined
				if(renderList[rObj] != undefined && renderList[rObj].remove()) this.renderStack.splice(rObj, 1);
		}	
	}.protect(),	
	
	// - renderStack method
	addToStack: function(renderObj, position){
		// if position is not supplied
		(position == undefined) ? 
			// push render object to end of stack
			this.renderStack.push(renderObj) : 
			// if position is supplied and is less than number of objects in renderstack
			(position < this.renderStack.length) ?
				// if its an empty position in the array fill it
				(this.renderStack[position] == undefined) ? 
					this.renderStack[position] = renderObj :
					// else splice it between objects
					this.renderStack.splice(position, 0, renderObj) :
				// else if position is larger than number of objects in stack put in requested position leaving empty positions	 
				this.renderStack[position] = renderObj;
		return renderObj;
	},
			
	// - renderStack method
	removeFromStack: function (renderObj){
		// will remove by index
		if( typeOf(renderObj) == 'number' ) return this.renderStack.splice(renderObj, 1);
		var renderList = this.renderStack.concat();
		// or by object
		for (var rObj = 0; rObj< renderList.length; rObj++){
			if(renderList[rObj] === renderObj){ 
				this.renderStack.splice(rObj, 1);
				return renderObj
			}
			// should the toBeRemoved var be altered
		}
		return null
	},

	// - renderStack method	
	clearStack: function(){
		this.renderStack=[];
	},
	
	// - render children	
	render: function (ctx){
		// this.remove(); ??
		var renderList = this.renderStack.concat();	
		for (var rObj = 0; rObj< renderList.length; rObj++){
			//if statement used to ignore empty place holders in renderList
			if(renderList[rObj] == undefined) continue;
			renderList[rObj].update();
			renderList[rObj].render(ctx);
		}
	},
	
	// - invokes internal inspect children ?? -- NEEDS MORE WORK
	update: function(){
		this._inspectChildren();
		//	
	}
});


///////////////////////////////////////////////////////////////


var TimeLineRenderer = new Class({
	
	//
	Extends: ContentRenderer,
	
	//
	context:null,
	options:{
		framerate:30
	},
	
	//	
	initialize: function(ctx, props){
		(ctx) ? this.context = ctx: alert('no context') ;
		(props) ? this.parent(props) : this.parent() ;
	},
	
	//	
	render: function (actx){	
		var ctx;
		if(actx && actx.length) ctx = actx[0];		
		this.update();
		this.parent(ctx);	
	},	
	
	//
	timeline: function(){},	
	
	//
	start: function(){
		if(!this.context) return;
		var bind = function(obj,func, ctx){
			return function(){
				// need to understand why it needs to have double arrays - could be due to Array extension by Mootools
				func.apply(obj,[[ctx]]) ;
			}
		};
		
		
		// GREENSOCK ENGINE FOR ANIMATION ENGINE
		TweenMax.ticker.fps(this.options.framerate) ;
		TweenMax.ticker.addEventListener("tick", bind(this,this.render,this.context)) ;		
		
		// NON GREENSOCK VERSION
		//this.timeline = setInterval(bind(this,this.render,this.context), 1000/this.options.framerate);	
	},
	
	//
	stop: function(){
		clearInterval(this.timeline) ;
	}
		
});
