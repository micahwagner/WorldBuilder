let canvasWidth = 1000;
let canvasHeight = 1000;

let c = createCanvas(canvasWidth, canvasHeight);

let colors = ["blue", "green", "orange", "pink"];
let grid = new Grid(60, 40, 10,c);
for (var y = 0; y < 40; y++) {
	for (var x = 0; x < 60; x++) {
		let color = colors[Math.floor(Math.random() * 4)];
		if (Math.random() < 0.4) grid.addCell(x, y, color);
	}
}


let sensitivity = 0.0005;

c.canvas.addEventListener("mousemove", function(e) {
	if (mouseDown && keysDown["Shift"]) {
		// add by a fraction of scale factor so rate of moving objects align with mouse
		world.transform.originX += e.movementX / world.transform.scaleFactor;
		world.transform.originY += e.movementY / world.transform.scaleFactor;
		grid.transform();
	}
});

c.canvas.addEventListener("wheel", function(e) {
	// set scale factor to some fraction of itself so zooming in feels constant
	world.transform.scaleFactor += world.transform.scaleFactor * e.deltaY * sensitivity;
	if (world.transform.scaleFactor < 0.0001) {
		world.transform.scaleFactor = 0.0001;
	}
	grid.transform();
});

setupInput(c);


function render() {
	// c.drawingContext.globalAlpha = 0;
	c.drawingContext.fillStyle = "lightgrey";
	c.drawingContext.fillRect(0, 0, canvasWidth, canvasHeight);
	grid.show();
	requestAnimationFrame(render);
}

render();