/**
 * Shape
 * @param point
 */
function Shape(position, velocity) {
	this.position = position instanceof Point    ? position : new Point();
	this.velocity = velocity instanceof Velocity ? velocity : new Velocity();
}

Shape.SIDES = {
	LEFT:   1,
	TOP:    2,
	RIGHT:  3,
	BOTTOM: 4
};

Shape.prototype.getBoundingBox = function() {
	console.warn("Abstract getBoundingBox() function should be defined by inheriting class");
	return new Rect(this.position, 1, 1);
};

Shape.prototype.draw = function(context) {
	console.warn("Abstract draw() function should be defined by inheriting class");
};

/**
 * Applies velocity and gravity
 */
Shape.prototype.move = function() {
	this.position.x += this.velocity.x;
	this.position.y += this.velocity.y;
	// @TODO: apply graivty to y
};

(function() {
	/**
	 * Basic bounding box collision.  
	 */
	Shape.prototype.isCollision = function(obj) {
		var self = this.getBoundingBox(),
			o    = obj.getBoundingBox();
		
		// Side collisions. First make sure Y axis lines up
		if ( o.position.y <= self.position.y + self.height && o.position.y + o.height >= self.position.y ) {
			// obj collided with self on self's left side
			if ( o.position.x + o.width >= self.position.x && o.position.x + o.width < self.position.x + self.width ) {
				return Shape.SIDES.RIGHT;
			}
			
			// obj collided with self on self's right side
			if ( o.position.x > self.position.x && o.position.x <= self.position.x + self.width ) {
				return Shape.SIDES.LEFT;
			}
		}
		
		// Top/bottom collisions. First make sure X axis lines up
		if ( o.position.x <= self.position.x + self.width && o.position.x + o.width >= self.position.x ) {
			// obj collided with self on self's bottom side
			if ( o.position.y + o.height >= self.position.y && o.position.y + o.height < self.position.y + self.height ) {
				return Shape.SIDES.BOTTOM;
			}
			
			// obj collided with self on self's top side
			if ( o.position.y > self.position.y && o.position.y <= self.position.y + self.height ) {
				return Shape.SIDES.TOP;
			}
		}
		
		return false;
	};
}());