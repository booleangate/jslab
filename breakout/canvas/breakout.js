/**
 * @author johnsonj
 * @version 20120511 johnsonj 
 */
(function() {
	var canvas                = document.getElementById("canvas"), 
		context               = canvas.getContext("2d"),
		WIDTH                 = canvas.width,
		HEIGHT                = canvas.height,
		container             = new Container(new Point(0, 0), WIDTH, HEIGHT),
		ball                  = new Circle(null, 10),
		paddle                = new Rectangle(new Point((WIDTH - 100) / 2, HEIGHT - 20), 100, 15),
		brick                 = new Rectangle(null, 95, 15),
		brickPositions        = [],
		paddleHorizDelta      = 10,
		requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame,
		lowestBrickPosition,
		remainingBricks,
		animationFrame,
		gameOver;
	
	// Track mouse position
	canvas.onmousemove = function(event) {
		paddle.position.x = Math.min(
			// Minimum left position
			Math.max(canvas.relMouseCoords(event).x - (paddle.width / 2), 1),
			// Maximum right position
			WIDTH - paddle.width - 1
		);
	};
	
	document.body.onkeydown = function(event) {
		// Left arrow
		if ( event.keyCode == 37 ) {
			paddle.position.x = Math.max(paddle.position.x - paddleHorizDelta, 1);
		}
		// Right arrow
		else if ( event.keyCode == 39 ) {
			paddle.position.x = Math.min(paddle.position.x + paddleHorizDelta, WIDTH - paddle.width - 1); 
		}
	};

	// Initialize brick and ball positions
	(function() {
		var initPositions   = Levels.getLevel(1, WIDTH, HEIGHT);
		brickPositions      = initPositions.bricks;
		ball.position       = initPositions.ball;
		ball.velocity       = Levels.getRandomVelocity();
		lowestBrickPosition = initPositions.lowestBrick;
		remainingBricks     = brickPositions.length;
	}());
	
	// Get your draw on
	animationFrame = function() {
		context.clearRect(0, 0, WIDTH, HEIGHT);
		context.beginPath();
		
		// Update ball position
		ball.move();
		
		// Ball has collided with paddle
		switch ( ball.isCollision(paddle) ) {
			// Ball has collided with L/R side of the paddle, invert X delta
			case Shape.SIDES.LEFT:
			case Shape.SIDES.RIGHT:
				ball.velocity.invertX();
				break;
			
			// Ball has collided with top side of the paddle, invert Y delta (hitting the bottom is inpossible)
			case Shape.SIDES.TOP:
				ball.velocity.invertY();
				break;
		}
		
		// Ball has collided with part of the game window
		switch ( container.isCollision(ball) ) {
			// Ball has collided with walls, invert X delta
			case Shape.SIDES.LEFT:
			case Shape.SIDES.RIGHT:
				ball.velocity.invertX();
				break;
				
			// Ball has collied with top, invert Y delta
			case Shape.SIDES.TOP:
				ball.velocity.invertY();
				break;
				
			// Ball has collided with bottom, game over
			case Shape.SIDES.BOTTOM:
				gameOver = true;
		}
		
		// Ball is now in range to hit bricks
		remainingBricks = 0;
		if ( ball.position.y - ball.radius <= lowestBrickPosition.y + brick.height ) {
			// Check to see if the ball has collided with an of the bricks, if not, draw them
			brickPositions.forEach(function(position, index) {
				if ( !position ) {
					return;
				}
				
				brick.position = position;
				
				// Ball has collided with a brick, remove its position from the list and skip to next brick
				switch ( ball.isCollision(brick) ) {
					case Shape.SIDES.LEFT:
					case Shape.SIDES.RIGHT:
						brickPositions[index] = null;
						ball.velocity.invertX();
						return;
					
					case Shape.SIDES.TOP:
					case Shape.SIDES.BOTTOM:
						ball.velocity.invertY();
						brickPositions[index] = null;
						return;
				}

				brick.draw(context);
				++remainingBricks;
			});
		} else {
			// No collision possible, draw all bricks
			brickPositions.forEach(function(position) {
				if ( position ) {
					brick.position = position;
					brick.draw(context);
					++remainingBricks;
				}
			});
		}
		
		// Draw other objects objects
		paddle.draw(context);
		ball.draw(context);
		context.closePath();

		if ( !remainingBricks ) {
			alert("You win!");
			return;
		} 
		
		if ( gameOver ) {
			alert("Game over!");
			return;
		}
		
		requestAnimationFrame(animationFrame);
	};
	
	requestAnimationFrame(animationFrame);
}());