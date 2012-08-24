function Apple(width, position) {
	this.position  = position;
	this.radius    = width / 1.9;
	this.fillStyle = "red";
}

Apple.prototype = new Circle();
