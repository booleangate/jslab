/**
 * Polygon
 *
 * @param Point1
 * @param Point2
 * @param Point3
 * ...
 * @param PointN
 * @param velocity optional
 */
function Polygon(/*position1, position2, position3, ..., positionN[, velocity]*/) {
	var that = this;

	this.positions   = [];
	this.velocity    = new Velocity();
	this.fillStyle   = "#fff";
	this.strokeStyle = "#fff";
	this.lineWidth   = 1;
	this.boundingBox = null;

	Array.prototype.slice.apply(arguments).forEach(function(value) {
		if ( value instanceof Velocity ) {
			that.velocity = value;
			return;
		}

		that.positions.push(value);
	});
}

Polygon.prototype = new Shape();

Polygon.prototype.calculateBoundingBox = function() {
	var leftX   = null,
		rightX  = null,
		topY    = null,
		bottomY = null;

	// Calculate the bounding box of this object by finding its extremes
	this.positions.forEach(function(value) {
		if ( leftX === null   || value.x < leftX )   leftX   = value.x;
		if ( rightX === null  || value.x > rightX )  rightX  = value.x;
		if ( topY === null    || value.y < topY )    topY    = value.y;
		if ( bottomY === null || value.y > bottomY ) bottomY = value.y;
	});

	this.boundingBox = new Rectangle(new Point(leftX, topY), rightX - leftX, bottomY - topY);

	return this;
};

Polygon.prototype.getBoundingBox = function() {
	return this.boundingBox ? this.boundingBox : this.calculateBoundingBox().boundingBox;
};

Polygon.prototype.draw = function(context) {
	context.beginPath();
	context.fillStyle   = this.fillStyle;
	context.strokeStyle = this.strokeStyle;
	context.lineWidth   = this.lineWidth;


	this.positions.forEach(function(p, i) {
		if ( i == 0 ) {
			context.moveTo(p.x, p.y);
		} else {
			context.lineTo(p.x, p.y);
		}
	});

	context.fill();
	context.stroke();
	context.closePath();

	return this;
};


Polygon.prototype.move = function() {
	var v = this.velocity;

	this.positions.forEach(function(position) {
		position.applyDelta(v);
	});

	if ( this.boundingBox ) {
		this.boundingBox.position.applyDelta(v);
	}

	return this;
};

Polygon.prototype.moveTo = function(newPosition) {
	var delta = this.positions[0].getDelta(newPosition);

	this.positions.forEach(function(position) {
		position.applyDelta(delta);
	});

	if ( this.boundingBox ) {
		this.boundingBox.position.applyDelta(delta);
	}

	return this;
};

Polygon.prototype.toString = function() {
	return "P: " + this.positions[0] + ", V: " + this.velocity + ", Sides: " + this.positions.length;
};
