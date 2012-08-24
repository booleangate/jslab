/**
 * Velocity
 * 
 * @param x delta
 * @param y delta
 */
function Velocity(x, y) {
	this.x = x || 0;
	this.y = y || 0;
};

Velocity.prototype = new Point();

/**
 * Inverts both X and Y
 */
Velocity.prototype.invert = function() {
	this.x *= -1;
	this.y *= -1;
};

Velocity.prototype.invertX = function() {
	this.x *= -1;
};

Velocity.prototype.invertY = function() {
	this.y *= -1;
};