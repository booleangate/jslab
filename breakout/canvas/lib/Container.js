/**
 * Contai ner (specialized rectangle).
 * 
 * @param Point
 * @param int
 * @param int
 */
function Container(position, width, height) {
	this.position = position instanceof Point ? position : new Point();
	this.width    = width || 1;
	this.height   = height || 1;
}

Container.prototype = new Rectangle();

Container.prototype.draw = function() { /* Do nothing */ };

(function() {
	var self, o;
	
	/**
	 * Do bounding box collision detection, but only with edges of container
	 */
	Container.prototype.isCollision = function(obj) {
		self = this.getBoundingBox();
		o    = obj.getBoundingBox();
		
		// Left wall collision
		if ( o.position.x <= self.position.x ) {
			return Shape.SIDES.LEFT;
		}
		
		// Top wall collision
		if ( o.position.y <= self.position.y ) {
			return Shape.SIDES.TOP;
		}
		
		// Right wall collision
		if ( o.position.x + o.width >= self.position.x + self.width ) {
			return Shape.SIDES.RIGHT;
		}
				
		// Bottom wall collision
		if ( o.position.y + o.height >= self.position.y + self.height ) {
			return Shape.SIDES.BOTTOM;
		}
		
		return false;
	};
}());