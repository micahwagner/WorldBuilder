function Rectangle(x, y, width, height, color) {
	this.x = x;
	this.y = y;

	this.width = width;
	this.height = height;
	this.color = color;

	this.screenX;
	this.screenY;

	this.screenWidth;
	this.screenHeight;

	this.transform();
} 

Rectangle.prototype.transform = function() {
	// scale box width and height by scale factor
	this.screenWidth = this.width * worldTransform.scaleFactor;
	this.screenHeight = this.height * worldTransform.scaleFactor;

	// this translates the position given relative to the world origin
	// add half of screen dimentions so 0, 0  is in center of screen, then add position offset
	let translation_X = (worldTransform.originX + canvasWidth / 2) + this.x;
	let translation_Y = (worldTransform.originY + canvasHeight / 2) + this.y;

	// this will scale the translated position depending on the zoom factor.
	// the (translation_X - screenWidth/2) gets the vector from the center of the screen
	// to the given center of the box, then we scale it by the scale factor (if we didn't do this, 
	// the box would be at a constant position on the screen, more you zoom in the more you want objects to go away from the center, vice versa)
	// then add this vector relative to the senter of the screen
	let scale_X = canvasWidth/2 + (translation_X - canvasWidth/2) * worldTransform.scaleFactor;
	let scale_Y = canvasHeight/2 + (translation_Y - canvasHeight/2) * worldTransform.scaleFactor;

	// this is the final position of box
	// subtract by the widthScale/2 and heightScale/2 so that fillRect properly draws rectanlge relative to center
	this.screenX = scale_X - this.screenWidth / 2;
	this.screenY = scale_Y - this.screenHeight / 2;
}

Rectangle.prototype.show = function(ctx) {
	ctx.fillRect(this.screenX, this.screenY, this.screenWidth, this.screenHeight);
}