let canvasWidth = 700;
let canvasHeight = 700;

let screen = new Screen(700, 700, 1);
screen.setParent(document.body);
let colors = [0xFF0000FF, 0x00FF00FF, 0x0000FFFF, 0xFFFF00FF];
let grid = new Grid(2000, 2000, screen);
for (var y = 0; y < 2000; y++) {
	for (var x = 0; x < 2000; x++) {
		let color = colors[Math.floor(Math.random() * 4)];
		if (Math.random() < 0.4) grid.data[x + y * 2000] = color;
	}
}


let sensitivity = 0.0005;

screen.htmlCanvasElement.addEventListener("mousemove", function(e) {
	if (mouseDown && keysDown["Shift"]) {
		// add by a fraction of scale factor so rate of moving objects align with mouse
		world.transform.originX += e.movementX / world.transform.scaleFactor;
		world.transform.originY += e.movementY / world.transform.scaleFactor;
		grid.transform();
	}

	if (mouseDown && !keysDown["Shift"]) {
		let mouseWorldCoords = world.screenToWorld(e.clientX, e.clientY, screen.htmlCanvasElement);

		mouseWorldCoords.x = Math.floor(mouseWorldCoords.x / grid.cellSize);
		mouseWorldCoords.y = Math.floor(mouseWorldCoords.y / grid.cellSize);

		if (mouseWorldCoords.x > grid.width || mouseWorldCoords.x < 0 || mouseWorldCoords.y > grid.width || mouseWorldCoords.y < 0) return;

	}
});

screen.htmlCanvasElement.addEventListener("wheel", function(e) {
	// set scale factor to some fraction of itself so zooming in feels constant
	world.transform.scaleFactor += world.transform.scaleFactor * e.deltaY * sensitivity;
	if (world.transform.scaleFactor < 0.0001) {
		world.transform.scaleFactor = 0.0001;
	}
	grid.transform();
});

setupInput(screen.htmlCanvasElement);

let frameCount = 0;
let pastFrameCount = 0;

function render() {
	// c.drawingContext.globalAlpha = 0;
	frameCount++;
	screen.clear();
	screen.drawingContext.fillStyle = "lightgrey";
	screen.drawingContext.fillRect(0, 0, canvasWidth, canvasHeight);
	screen.setPixels();
	grid.show();
	screen.update();
	requestAnimationFrame(render);
}

render();

setInterval(() => {
	console.log(frameCount - pastFrameCount);
	pastFrameCount = frameCount;
}, 1000);