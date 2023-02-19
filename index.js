let screenWidth = 1000;
let screenHeight = 1000;

let c = createCanvas(screenWidth, screenHeight);

let x = 0;
let y = 0;

let origin_x = 0;
let origin_y = 0;
let scale_factor = 1;
let sensitivity = 0.0005;

let obj_w = 200;
let obj_h = 200;

c.canvas.addEventListener("mousemove", function(e) {
	if (mouseDown && keysDown["Shift"]) {
		// add by a fraction of scale factor so rate of moving objects align with mouse
		origin_x += e.movementX / scale_factor;
		origin_y += e.movementY / scale_factor;
	}
});

c.canvas.addEventListener("wheel", function(e) {
	// set scale factor to some fraction of itself so zooming in feels constant
	scale_factor += scale_factor * e.deltaY * sensitivity;
	if (scale_factor < 0.0001) {
		scale_factor = 0.0001;
	}
});

setupInput(c);

function render() {
	// c.drawingContext.globalAlpha = 0;
	c.drawingContext.fillStyle = "lightgrey";

	c.drawingContext.fillRect(0, 0, screenWidth, screenHeight);
	c.drawingContext.globalAlpha = 1;
	drawSquare(c, 0, 0, 100, 100, "red");
	drawSquare(c, 110, 0, 100, 100, "red");
	drawSquare(c, -110, 0, 100, 100, "red");
	requestAnimationFrame(render);
}

render();

function drawSquare(ctx, pos_x, pos_y, width, height, color) {
	ctx.drawingContext.fillStyle = color;

	// scale box width and height by scale factor
	let widthScale = width * scale_factor;
	let heightScale = height * scale_factor;

	// this translates the position given relative to the world origin
	// add half of screen dimentions so 0, 0  is in center of screen, then add position offset
	let translation_X = (origin_x + screenWidth / 2) + pos_x;
	let translation_Y = (origin_y + screenHeight / 2) + pos_y;

	// this will scale the translated position depending on the zoom factor.
	// the (translation_X - screenWidth/2) gets the vector from the center of the screen
	// to the given center of the box, then we scale it by the scale factor (if we didn't do this, 
	// the box would be at a constant position on the screen, more you zoom in the more you want objects to go away from the center, vice versa)
	// then add this vector relative to the senter of the screen
	let scale_X = screenWidth/2 + (translation_X - screenWidth/2) * scale_factor;
	let scale_Y = screenHeight/2 + (translation_Y - screenHeight/2) * scale_factor;

	// this is the final position of box
	// subtract by the widScale/2 and heightScale so that fillRect properly draws rectanlge relative to center
	let final_X = scale_X - widthScale / 2;
	let final_Y = scale_Y - heightScale / 2;

	ctx.drawingContext.fillRect(final_X, final_Y, widthScale, heightScale);
}