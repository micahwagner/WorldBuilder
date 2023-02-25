let canvasWidth = 700;
let canvasHeight = 700;

let screen = new Screen(700, 700, 1);
screen.setParent(document.body);
let colors = [0xFF0000FF, 0x00FF00FF, 0x0000FFFF, 0xFFFF00FF];
let grid = new Grid(200, 200, screen);
for (var y = 0; y < 200; y++) {
	for (var x = 0; x < 200; x++) {
		let color = colors[Math.floor(Math.random() * 4)];
		if (Math.random() < 0.4) grid.data[x + y * 200] = color;
	}
}


let sensitivity = 0.0005;

let mouseIndex = 0;

screen.htmlCanvasElement.addEventListener("mousemove", function(e) {
	if (mouseDown && keysDown["Shift"]) {
		// add by a fraction of scale factor so rate of moving objects align with mouse
		world.transform.originX += e.movementX / world.transform.scaleFactor;
		world.transform.originY += e.movementY / world.transform.scaleFactor;
		grid.transform();
	}

	let mouseWorldCoords = world.screenToWorld(e.clientX, e.clientY, screen.htmlCanvasElement);
	mouseWorldCoords.x += grid.width / 2;
	mouseWorldCoords.y += grid.height / 2;
	mouseIndex = Math.floor(mouseWorldCoords.x) + Math.floor(mouseWorldCoords.y) * grid.width;
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

	if (mouseIndex > 0 && mouseIndex < grid.width * grid.height) {

		if (mouseDown && !keysDown["Shift"]) {
			if (keysDown["b"]) {
				grid.data[mouseIndex] = 0x0000FFFF;
			} else if (keysDown["g"]) {
				grid.data[mouseIndex] = 0x00FF00FF;
			} else if (keysDown["r"]) {
				grid.data[mouseIndex] = 0xFF0000FF;
			} else if (keysDown[" "]) {
				grid.data[mouseIndex] = 0;
			}
		}
	}

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