var EaseingFunctions = {
	
	// used for creating an object with the correct property names passed at initialize to property in AnimatedRenderer. initialize function
	// organizes content using setPropTween() and Animate.setTween()
	initPropTween: function ( from, to, dur, func){
		return { 
			propFrom: from,
			propTo: to,
			duration: dur,	
			ease: func		
		}
	},		
	
	// used for creating an object with the correct property names set by setTween() and animated by update() in AnimatedRenderer
	setPropTween: function ( prop, to, dur, func){
		return { 
			property: prop,
			propTo: to,
			duration: dur,	
			ease: func
			// internally set by updatre function
				//_time:			
				//_propInit: 
				//_propChange: 
		}
	},
			
	//
	easeIn: function (t, b, c, d) {
		return (t<d)? c*(t/=d)*t + b : c+b ;
	},
	
	//
	easeOut: function (t, b, c, d) {
		return (t<d)? -c *(t/=d)*(t-2) + b : c+b ;
	},
	
	//
	easeInOut: function (t, b, c, d) {
		if (t>=d) return c+b ;
		if ((t/=d*0.5) < 1) return c*0.5*t*t + b;
		return -c*0.5 * ((--t)*(t-2) - 1) + b;
	}	
		
};

var BasicTrig = {
	
		resolvePoint: function(start, angleRad, hypotenuse){
			return { x: start.x+this.adjacent(angleRad, hypotenuse), y: start.y+this.opposite(angleRad, hypotenuse) };
		},
		
		// opposite usually should refer to the y axis
		opposite: function(angleRad, hypotenuse) {
			return Math.sin(angleRad)*hypotenuse;
		},
		
		// adjacent usually should refer to the x axis
		adjacent: function(angleRad, hypotenuse) {
			return  Math.cos(angleRad)*hypotenuse;
		},
		
		hypotenuse: function (sideA, sideB) {
			return Math.sqrt((sideA*sideA)+(sideB*sideB));
		},
		
		angle: function (opposite, adjacent) {
			return Math.atan2(opposite, adjacent);
		},
		 
		// needs work to remove 360
		angleRatio: function(num, total, deg){
			// if deg = true output degrees else radians. default radians
			var d = (num*360)/total;
			return (!deg)? d*(Math.PI/180)  : d;
		/*
			return (!deg)? 
				(d*(Math.PI/180) < Math.PI*2)? 
					d*(Math.PI/180): 
					d*(Math.PI/180)-Math.PI*2 : 
				(d<360)? 
					d:
					d-360;
		*/	
		}	
					
};	

var Calendar = {
	
	//
	months:[
		{ name:'january', abreviation:'jan', days:31 },
		{ name:'february', abreviation:'feb', days:28 },
		{ name:'march', abreviation:'mar', days:31 },
		{ name:'april', abreviation:'apr', days:30 },
		{ name:'may', abreviation:'may', days:31 },
		{ name:'june', abreviation:'jun', days:30 },
		{ name:'july', abreviation:'jul', days:31 },
		{ name:'august', abreviation:'aug', days:31 },
		{ name:'september', abreviation:'sep', days:30 },
		{ name:'october', abreviation:'oct', days:31 },
		{ name:'november', abreviation:'nov', days:30 },
		{ name:'december', abreviation:'dec', days:31 }					
	],
	
	//	
	_getMonthIndex: function(month){
		// if month is in number format  ( ideally this would catch numbers larger than 12 and cycle through them looking for correct month in sequence .ie 14 >> 2
		if (typeOf(month) == 'number') return (--month>11)? 11 : month ;
		// if not number format continue to following code
		var months = this.months;	
		var lower = month.toLowerCase();	
		for(var n=0; n<months.length; n++){			
			if( months[n].name == lower || months[n].abreviation == lower ) return n
		}
		return 0
	}.protect(),		
	
	// recursive function for adding up the amount of days in the months (and days from current incomplete month)
	_add: function(monthIndex, day){
		--monthIndex
		if(monthIndex>=0) day+=this._add(monthIndex, this.months[monthIndex].days)
		return day	
	}.protect(),	
	
	//
	addDays: function(month, day){
		var m = this._getMonthIndex(month);
		if(!day || day> this.months[m].days) day = this.months[m].days;		
		if(!m) return day;
		return this._add(m, day);
	},
	
	createDateArray:function(string){
		var datesUnChecked = string.split('/');
		return [ Number(datesUnChecked[0]), datesUnChecked[1], Number(datesUnChecked[2]) ];
		
	}
	
};




