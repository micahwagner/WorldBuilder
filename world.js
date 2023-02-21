let world = {
	transform: {
		originX: 0,
		originY: 0,
		scaleFactor: 1
	}
};

//transforms a point in world space to screen space
world.transformPoint = function(x,y,canvas){
	// this translates the position given relative to the world origin
	// add half of screen dimentions so 0, 0  is in center of screen, then add position offset
	let translation_X = (world.transform.originX + canvas.width / 2) + x;
	let translation_Y = (world.transform.originY + canvas.height / 2) + y;

	// this will scale the translated position depending on the zoom factor.
	// the (translation_X - screenWidth/2) gets the vector from the center of the screen
	// to the given the point, then we scale it by the scale factor (if we didn't do this, 
	// the point would be at a constant position on the screen, more you zoom in the more you want objects to go away from the center, vice versa)
	// then add this vector relative to the senter of the screen
	let finalX = canvas.width/2 + (translation_X - canvas.width/2) * world.transform.scaleFactor;
	let finalY = canvas.height/2 + (translation_Y - canvas.height/2) * world.transform.scaleFactor;

	return {x:finalX, y:finalY};
}

world.transformLength = function(length) {
	return length * world.transform.scaleFactor;
}