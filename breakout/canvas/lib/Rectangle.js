/**
 * Rectangle
 * @param Point
 * @param int
 * @param int
 */
function Rectangle(position, width, height) {
	this.position  = position instanceof Point ? position : new Point();
	this.width     = width || 1;
	this.height    = height || 1;
}

Rectangle.prototype = new Shape();

Rectangle.prototype.getBoundingBox = function() {
	return this;
};

Rectangle.prototype.draw = function(context) {
	context.fillRect(this.position.x, this.position.y, this.width, this.height);
};