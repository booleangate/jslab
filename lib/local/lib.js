window.requestAnimFrame = (function(){
  return window.requestAnimationFrame       ||
		 window.webkitRequestAnimationFrame ||
		 window.mozRequestAnimationFrame    ||
		 window.oRequestAnimationFrame      ||
		 window.msRequestAnimationFrame     ||
		 function(callback) {
		 	window.setTimeout(callback, 1000 / 60);
		 };
})();


/**
 * @see http://ejohn.org/blog/javascript-array-remove/
 * @param from
 * @param to
 * @returns
 */
Array.prototype.remove = function(from, to) {
	var rest = this.slice((to || from) + 1 || this.length);
	this.length = from < 0 ? this.length + from : from;

	return this.push.apply(this, rest);
};


HTMLCanvasElement.prototype.relMouseCoords = function(event) {
	var totalOffsetX = 0;
	var totalOffsetY = 0;
	var currentElement = this;

	do {
		totalOffsetX += currentElement.offsetLeft;
		totalOffsetY += currentElement.offsetTop;
	} while ( currentElement = currentElement.offsetParent );

	return new Point(
		event.pageX - totalOffsetX,
		event.pageY - totalOffsetY
	);
};

Math.randomRange = function(min, max) {
	return min + Math.random() * ((max - min) + 1);
};

function clone(src) {
	function mixin(dest, source, copyFunc) {
		var name, s, i, empty = {};
		for(name in source){
			// the (!(name in empty) || empty[name] !== s) condition avoids copying properties in "source"
			// inherited from Object.prototype.	 For example, if dest has a custom toString() method,
			// don't overwrite it with the toString() method that source inherited from Object.prototype
			s = source[name];
			if(!(name in dest) || (dest[name] !== s && (!(name in empty) || empty[name] !== s))){
				dest[name] = copyFunc ? copyFunc(s) : s;
			}
		}
		return dest;
	}

	if(!src || typeof src != "object" || Object.prototype.toString.call(src) === "[object Function]"){
		// null, undefined, any non-object, or function
		return src;	// anything
	}
	if(src.nodeType && "cloneNode" in src){
		// DOM Node
		return src.cloneNode(true); // Node
	}
	if(src instanceof Date){
		// Date
		return new Date(src.getTime());	// Date
	}
	if(src instanceof RegExp){
		// RegExp
		return new RegExp(src);   // RegExp
	}
	var r, i, l;
	if(src instanceof Array){
		// array
		r = [];
		for(i = 0, l = src.length; i < l; ++i){
			if(i in src){
				r.push(clone(src[i]));
			}
		}
		// we don't clone functions for performance reasons
		//		}else if(d.isFunction(src)){
		//			// function
		//			r = function(){ return src.apply(this, arguments); };
	}else{
		// generic objects
		r = src.constructor ? new src.constructor() : {};
	}

	return mixin(r, src, clone);
}