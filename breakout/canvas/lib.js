Levels = (function() {
	var BRICK_HEIGHT = 15,
		BALL_RADIUS  = 10;

	return {
		getLevel: function(level, ctxWidth, ctxHeight) {
			return this["getLevel" + +level](ctxWidth, ctxHeight);
		},

		getLevel1: function(ctxWidth, ctxHeight) {
			var brickPositions = [],
				ballPosition   = new Point(),
				c, r;

			for ( c = 0; c < 8; ++c ) {
				for ( r = 0; r < 8; ++r ) {
					brickPositions.push(new Point(
						(c * 100) + 2.5, // 2.5px horizontal padding
						(r * 16) + 1     // 1px vertical padding
					));
				}
			}

			return {
				bricks:      brickPositions,
				lowestBrick: brickPositions[brickPositions.length - 1],
				ball:        this.getRandomBallPosition(brickPositions[brickPositions.length - 1], ctxWidth, ctxHeight)
			};
		},

		/**
		 * Randomly initialize ball between lowest brick and paddle
		 */
		getRandomBallPosition: function(lowestBrick, ctxWidth, ctxHeight) {
			var minY = lowestBrick.y + BRICK_HEIGHT + BALL_RADIUS + 5,
				maxY = ctxHeight - BRICK_HEIGHT - 200,
				minX = BALL_RADIUS + 5,
				maxX = ctxWidth - BALL_RADIUS - 5;

			return new Point(
				minX + Math.floor(Math.random() * (maxX - minX + 1)),
				minY + Math.floor(Math.random() * (maxY - minY + 1))
			);
		},

		getRandomVelocity: function() {
			// Random slope of 3 to 5
			return new Velocity(
				// randomize +/- for X only
				Math.floor((3 + Math.random() * 5) * (Math.random() < .5 ? 1 : -1)),
				-Math.floor(3 + Math.random() * 5)
			);
		}
	};
}());