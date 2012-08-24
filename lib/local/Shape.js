/**
 * Shape
 * @param point
 */
function Shape(position, velocity) {
	this.position  = position instanceof Point    ? position : new Point();
	this.velocity  = velocity instanceof Velocity ? velocity : new Velocity();
	this.fillStyle = "black";
}

Shape.SIDES = {
	LEFT:   1,
	TOP:    2,
	RIGHT:  3,
	BOTTOM: 4
};

/**
 * For debug
 * @param side int See Shape.SIDES.
 */
Shape.getSideLabel = function(side) {
	for ( var label in Shape.SIDES ) {
		if ( Shape.SIDES.hasOwnProperty(label) ) {
			if ( Shape.SIDES[label] == side ) {
				return label + " (" + side + ")";
			}
		}
	}

	return "Unknown side `" + side + "`";
};

Shape.prototype.getBoundingBox = function() {
	console.warn("Abstract getBoundingBox() function should be defined by inheriting class");

	return new Rectangle(this.position, 1, 1);
};

Shape.prototype.draw = function(context) {
	console.warn("Abstract draw() function should be defined by inheriting class");

	return this;
};

Shape.prototype.move = function() {
	this.position.applyDelta(this.velocity);

	return this;
};

Shape.prototype.moveTo = function(newPosition) {
	// Dereference object so that externals changes to newPosition don't continue to translate this object
	this.position.x = newPosition.x;
	this.position.y = newPosition.y;

	return this;
};

Shape.prototype.isMovingToward = function(obj) {
	return this.velocity.isMovingToward(obj.velocity);
};

Shape.prototype.toString = function() {
	return "P: " + this.position + ", V: " + this.velocity;
};


(function() {
	var lookAhead = 0;
	/**
	 * Basic bounding box collision.
	 */
	Shape.prototype.isCollision = function(obj) {
		var self = this.getBoundingBox(),
			o    = obj.getBoundingBox(),
			c1, c2;

		// Side collisions. First make sure Y axis lines up
		if ( o.position.y <= self.position.y + self.height && o.position.y + o.height >= self.position.y ) {
			// obj collided with self on self's left side
			if ( o.position.x + o.width >= self.position.x - lookAhead && o.position.x + o.width < self.position.x + self.width ) {
				c1 = Shape.SIDES.LEFT;
			}
			// obj collided with self on self's right side
			else if ( o.position.x > self.position.x && o.position.x <= self.position.x + self.width + lookAhead ) {
				c1 = Shape.SIDES.RIGHT;
			}
		}

		// Top/bottom collisions. First make sure X axis lines up
		if ( o.position.x <= self.position.x + self.width && o.position.x + o.width >= self.position.x ) {
			// obj collided with self on self's bottom side
			if ( o.position.y + o.height >= self.position.y - lookAhead && o.position.y + o.height < self.position.y + self.height ) {
				c2 = Shape.SIDES.BOTTOM;
			}
			// obj collided with self on self's top side
			else if ( o.position.y > self.position.y && o.position.y <= self.position.y + self.height + lookAhead) {
				c2 = Shape.SIDES.TOP;
			}
		}

		// No collisions
		if ( !(c1 || c2) ) {
			return false;
		}
		// Exactly one collision
		else if ( !!c1 ^ !!c2 ) {
			return c1 || c2;
		}

		/*
		 * Two collisions can be detected if the below scenario occurs
		 *   ________
		 * |        |
		 * |   obj  |
		 * |      +-|--------
		 *  --------         |
		 *        |   self   |
		 *        |          |
		 *         ----------
		 * Determine which side has overlapped the least and return that
		 */

		if ( c1 === Shape.SIDES.LEFT ) {
			if ( c2 === Shape.SIDES.TOP ) {
//				console.warn("a", c1, c2, o.position.y + o.height - self.position.y, o.position.x + o.width - self.position.x);
				// Less top collision than left side?
				return o.position.y + o.height - self.position.y < o.position.x + o.width - self.position.x ? c1 : c2;
			} else {
//				console.warn("b", c1, c2, self.position.y + self.height - o.position.y, o.position.x + o.width - self.position.x);
				// Less bottom collision than left side?
				return self.position.y + self.height - o.position.y < o.position.x + o.width - self.position.x ? c1 : c2;
			}
		}
		// c1 === Shape.SIDES.RIGHT
		else {
			if ( c2 === Shape.SIDES.TOP ) {
//				console.warn("c", c1, c2, o.position.y + o.height - self.position.y, self.position.x + self.width - o.position.x);
				// Less top collision than right side?
				return o.position.y + o.height - self.position.y < self.position.x + self.width - o.position.x ? c1 : c2;
			} else {
//				console.warn("d", c1, c2, self.position.y + self.height - o.position.y, self.position.x + self.width - o.position.x);
				// Less bottom collision than right side?
				return self.position.y + self.height - o.position.y < self.position.x + self.width - o.position.x ? c1 : c2;
			}
		}

		// Something went horribly wrong
		return false;
	};
}());