SnakeHead = (function() {
	var R_RIGHT = 0,
		R_LEFT  = 1,
		R_UP    = 1.5,
		R_DOWN  = 0.5;

	function SnakeHead(unit, spacing, fillStyle) {
		this.triangle = new Polygon(
			new Point(0, 0),
			new Point(unit , unit / 2),
			new Point(0, unit )
		);

		this.rotation             = R_RIGHT;
		this.unit                 = unit;
		this.spacing              = spacing;
		this.triangle.fillStyle   = fillStyle;
		this.triangle.strokeStyle = fillStyle;
	}

	SnakeHead.prototype = new Shape();

	SnakeHead.prototype.draw = function(context) {
		var trianglePos = new Point(this.triangle.positions[0]);

		context.save();

		// Rotate the object within its bounding box, not on its first point
		switch ( this.rotation ) {
			case R_RIGHT: context.translate(trianglePos.x + this.spacing, trianglePos.y); break;
			case R_LEFT:  context.translate(trianglePos.x + this.unit - this.spacing, trianglePos.y + this.unit); break;
			case R_UP:    context.translate(trianglePos.x, trianglePos.y + this.unit - this.spacing); break;
			case R_DOWN:  context.translate(trianglePos.x + this.unit, trianglePos.y + this.spacing); break;
		}

		this.triangle.moveTo(new Point(0, 0));

		context.rotate(this.rotation * Math.PI);
		this.triangle.draw(context);

		context.restore();

		this.triangle.moveTo(trianglePos);
	};

	SnakeHead.prototype.moveTo = function(newPosition) {
		this.triangle.moveTo(newPosition);
		return this;
	};

	SnakeHead.prototype.move = function() {
		this.triangle.move();
		return this;
	};

	SnakeHead.prototype.getBoundingBox = function() {
		return this.triangle.getBoundingBox();
	};

	/**
	 * Set rotation based on velocity
	 * @param velocity
	 */
	SnakeHead.prototype.setRotation = function(velocity) {
		// Left or right
		if ( velocity.x ) {
			this.rotation = velocity.x > 0 ? R_RIGHT : R_LEFT;
		}
		// Up or down
		else {
			this.rotation = velocity.y > 0 ? R_DOWN : R_UP;
		}

		return this;
	};

	return SnakeHead;
}());