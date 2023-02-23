function Rectangle(x, y, width, height, screen) {
	this.x = x;
	this.y = y;
	this.screen = screen;

	this.width = width;
	this.height = height;

	this.screenX;
	this.screenY;

	this.screenWidth;
	this.screenHeight;

	this.transform();
} 

Rectangle.prototype.transform = function() {
	// scale box width and height by scale factor
	this.screenWidth = world.transformLength(this.width);
	this.screenHeight = world.transformLength(this.height);

	// this is the final position of box
	// subtract by the widthScale/2 and heightScale/2 so that fillRect properly draws rectanlge relative to center
	let screenCoords = world.worldToScreen(this.x,this.y, this.screen.canvas);
	this.screenX = screenCoords.x - this.screenWidth / 2;
	this.screenY = screenCoords.y - this.screenHeight / 2;
	return this;
}

Rectangle.prototype.show = function() {
	this.screen.drawingContext.fillRect(this.screenX, this.screenY, this.screenWidth, this.screenHeight);
	return this;
}