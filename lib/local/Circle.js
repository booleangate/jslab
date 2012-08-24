/**
 * Circle
 * @param Point
 * @param int
 */
function Circle(position, radius, velocity) {
	this.position = position instanceof Point ? position : new Point();
	this.radius   = radius || 1;
	this.velocity = velocity instanceof Velocity ? velocity : new Velocity();
}

Circle.prototype = new Shape();

Circle.prototype.getBoundingBox = function() {
	var width = this.radius * 2;

	return new Rectangle(
		new Point(this.position.x - this.radius, this.position.y - this.radius),
		width,
		width,
		this.velocity
	);
};

Circle.prototype.draw = function(context) {
	context.beginPath();

	if ( this.fillStyle ) {
		context.fillStyle = this.fillStyle;
	}

	context.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
	context.fill();
	context.closePath();

	return this;
};

Circle.prototype.toString = function() {
	return "P: " + this.position + ", V: " + this.velocity + ", R: " + this.radius;
};
