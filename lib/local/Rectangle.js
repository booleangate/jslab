/**
 * Rectangle
 * @param Point
 * @param int
 * @param int
 */
function Rectangle(position, width, height, velocity) {
	this.position = position instanceof Point ? position : new Point();
	this.width    = width || 1;
	this.height   = height || 1;
	this.velocity = velocity instanceof Velocity ? velocity : new Velocity();
}

Rectangle.prototype = new Shape();

Rectangle.prototype.getBoundingBox = function() {
	return this;
};

Rectangle.prototype.draw = function(context) {
	if ( this.fillStyle ) {
		context.fillStyle = this.fillStyle;
	}

	context.fillRect(this.position.x, this.position.y, this.width, this.height);
	
	return this;
};

Rectangle.prototype.toString = function() {
	return "P: " + this.position + ", V: " + this.velocity + ", W: " + this.width + ", H: " + this.height;
};
