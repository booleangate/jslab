(function() {
	var canvas      = document.getElementById("canvas"),
		ctx         = canvas.getContext("2d"),
		WIDTH       = window.innerWidth,
		HEIGHT      = window.innerHeight,
		UNIT        = 10,
		SPACING     = 1,
		LENGTH      = 4,
		SNAKE_COLOR = "rgba(127, 175, 27, 1)",
		head        = new SnakeHead(UNIT, SPACING, SNAKE_COLOR),
		body        = new LinkedList(),
		segment     = new Rectangle(null, UNIT, UNIT, new Velocity(0, UNIT)),
		container   = new Container(),
		apples      = [],
		isPaused    = true,
		isNewGame   = true,
		isGameOver  = false,
		score       = 0,
		speed, insult, i;

	// We can do fancy things in here later to cluster/spread apples, keep apples away from the borders, or prevent
	// them from being behind the score board
	function randomApplePosition() {
		return Point.random(UNIT * 2, WIDTH, UNIT * 2, HEIGHT);
	}

	function createApple() {
		apples.push(new Apple(UNIT + SPACING, randomApplePosition()));
	}

	function newGame() {
		speed   = 1000 / 12;
		body    = new LinkedList();
		segment = new Rectangle(null, UNIT, UNIT, new Velocity(0, UNIT)),
		apples  = [];

		// Initialize snake
		segment.fillStyle = SNAKE_COLOR;
		body.push(new Point((WIDTH / 2) - (segment.width / 2), 100));

		for ( i = 1; i < LENGTH; ++i ) {
			// Init snake
			body.push(
				new Point(body.peekHead().x, body.peekHead().y - ((SPACING + segment.height) * i))
			);

			// Init apples
			createApple();
		}

		// Init head position
		head.moveTo(body.peekTail());
	}

	window.onresize = function() {
		WIDTH            = window.innerWidth;
		HEIGHT           = window.innerHeight;
		canvas.width     = WIDTH;
		canvas.height    = HEIGHT;
		container.width  = WIDTH;
		container.height = HEIGHT;

		stepIdle();
	};

	/*
	 * Change velocity based on arrow key input
	 */
	document.body.addEventListener("keydown", function(event) {
		var v = [];

		switch ( event.keyCode ) {
			case 37: v = [UNIT * -1, 0];   break; // Left
			case 38: v = [0, UNIT * -1];   break; // Up
			case 39: v = [UNIT, 0];        break; // Right
			case 40: v = [0, UNIT];        break; // Down

			// Space
			case 32:
				isNewGame = false;

				if ( isPaused ) {
					isPaused = false;
					stepActive();
				} else {
					isPaused  = true;
				}

				if ( isGameOver ) {
					isPaused   = false;
					isGameOver = false;
					newGame();
					stepActive();
				}

				break;

			// Something ... else
			default:
				return;
		}

		// Don't allow for changes in snake velocity if the game is not running
		if ( !v.length ) {
			return;
		}

		// Don't allow the snake to reverse directions/double back by ensuring that the new velocity isn't the opposite of the current
		// velocity
		if (
			(segment.velocity.x && v[0] == segment.velocity.x * -1)
			|| (segment.velocity.y && v[1] == segment.velocity.y * -1)
		) {
			return;
		}

		segment.velocity.x = v[0];
		segment.velocity.y = v[1];
	});

	function write(title, subtitle) {
		ctx.fillStyle    = "#f0f0f0";
		ctx.textBaseline = "top";
		ctx.font         = "bold 74px sans-serif";
		ctx.fillText(title, 100, 100);
		ctx.font         = "normal 28px sans-serif";
		ctx.fillText(subtitle, 100, 174);
	};

	function moveSnake() {
		// Duplicate the head
		var newHeadPos = clone(body.peekHead());

		// Remove the old tail
		body.pop();

		// Move the new head
		newHeadPos.applyDelta(segment.velocity);

		if ( segment.velocity.x != 0 ) {
			newHeadPos.x += (segment.velocity.x / UNIT) * SPACING;
		} else if ( segment.velocity.y != 0 ) {
			newHeadPos.y += (segment.velocity.y / UNIT) * SPACING;
		}

		// Add the new head to the snake
		body.unshift(newHeadPos);

		head.setRotation(segment.velocity)
			.moveTo(new Point(newHeadPos).applyDelta(segment.velocity));
	}

	function getInsult() {
		var insults = [
           "Try harder next time.",
           "You have brought great dishonor upon your family.",
           "Maybe next year, you'll graduate to big boy pants.",
           "Derp.",
           "FFFFFuuuuuuuuu."
  		];

		return insults[ parseInt(Math.randomRange(0, insults.length - 1), 10) ];
	}

	function drawScore() {
		ctx.beginPath();
		ctx.strokeStyle = "#fff";
		ctx.lineWidth   = 1;
		ctx.moveTo(WIDTH - 70, 0);
		ctx.lineTo(WIDTH - 70, 27);
		ctx.lineTo(WIDTH, 27);
		ctx.stroke();
		ctx.closePath();

		ctx.beginPath();
		ctx.fillStyle    = "#f0f0f0";
		ctx.textBaseline = "top";
		ctx.font         = "bold 14px sans-serif";
		ctx.fillText("Score: " + score, WIDTH - 64, 5);
		ctx.closePath();
	};

	function stepIdle() {
		ctx.fillStyle = "rgba(0, 0, 0, 1)";
		ctx.fillRect(0, 0, WIDTH, HEIGHT);

		if ( isNewGame ) {
			write("Snake-a-snake!", "Use the arrow keys to guide the snake to collect apples.");
			ctx.fillText("Press space to begin.", 100, 208);
			return true;
		}
		else if ( isGameOver ) {
			write("Game over!", "You scored " + score + " points. " + insult);
			ctx.fillText("Press space to start a new game.", 100, 208);
			return true;
		}
		else if ( isPaused ) {
			write("Paused", "Press space to continue");
			return true;
		}

		return false;
	}

	function stepActive() {
		if ( stepIdle() ) {
			return;
		}

		setTimeout(function() {
			requestAnimFrame(stepActive, ctx);
		}, speed);

		ctx.fillStyle = "rgba(0, 0, 0, 1)";
		ctx.fillRect(0, 0, WIDTH, HEIGHT);

		isNewGame = false;

		/*
		 * Move el snake
		 */
		moveSnake();

		/*
		 * Draw
		 */

		// Snake
		body.forEach(function(pos) {
			segment.position = pos;
			segment.draw(ctx);
		});

		head.draw(ctx);

		// Apples
		apples.forEach(function(apple, index) {
			apple.draw(ctx);
		});

		// Score
		drawScore();

		/*
		 * Test for collisions. Only need to compare the head to the rest of the segments of the snake,
		 * the apples, and the container
		 */

		// Hit the wall
		if ( container.isCollision(head) ) {
			isGameOver = true;
		}

		// Snake on snake violence
		body.forEach(function(bodyPartPosition, i) {
			// Don't compare collisions with the next (first segment), or if the game is already over
			if ( i == 0 || isGameOver ) {
				return;
			}

			segment.position = bodyPartPosition;

			if ( head.isCollision(segment) ) {
				isGameOver = true;
			}
		});

		if ( isGameOver ) {
			insult = getInsult();
			return;
		}

		// Found a tasty apple
		apples.forEach(function(apple) {
			if ( apple.isCollision(head) ) {
				++score;
				speed = Math.max(1000 / 40, speed - ((LENGTH + score) * 0.20));
				body.push(clone(body.peekTail()));
				apple.position = randomApplePosition();
			}
		});
	}

	window.onresize();
	newGame();
	requestAnimFrame(stepIdle, ctx);
}());