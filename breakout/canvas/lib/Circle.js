/**
 * Circle
 * @param Point
 * @param int
 */
function Circle(position, radius) {
	this.position = position instanceof Point ? position : new Point();
	this.radius   = radius || 1;
}

Circle.prototype = new Shape();

Circle.prototype.getBoundingBox = function() {
	var width = this.radius * 2;
	
	return new Rectangle(
		new Point(this.position.x - this.radius, this.position.y - this.radius), 
		width, 
		width
	);
};

Circle.prototype.draw = function(context) {
	context.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
	context.fill();
};