/**
 * Point
 * @param int|Point x
 * @param int y
 */
function Point(x, y) {
	// Copy constructor
	if ( arguments.length == 1 && arguments[0] instanceof Point ) {
		this.x = arguments[0].x;
		this.y = arguments[0].y;
	}
	else {
		this.x = x || 0;
		this.y = y || 0;
	}
};


Point.prototype.getDelta = function(p) {
	return {
		x: p.x - this.x,
		y: p.y - this.y
	};
};

Point.prototype.applyDelta = function(d) {
	this.x += d.x;
	this.y += d.y;

	return this;
};

Point.prototype.toString = function() {
	return "(" + this.x + ", " + this.y + ")";
};

Point.random = function(minX, maxX, minY, maxY) {
	return new Point(
		Math.randomRange(minX, maxX),
		Math.randomRange(minY, maxY)
	);
};