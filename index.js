let canvasWidth = 700;
let canvasHeight = 700;

let c = createCanvas(canvasWidth, canvasHeight);

let colors = ["blue", "green", "orange", "pink"];
let grid = new Grid(200, 200, 10, c);
for (var y = 0; y < 200; y++) {
	for (var x = 0; x < 200; x++) {
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

	if (mouseDown && !keysDown["Shift"]) {
		let mouseWorldCoords = world.screenToWorld(e.clientX, e.clientY, c.canvas);

		mouseWorldCoords.x = Math.floor(mouseWorldCoords.x / grid.cellSize);
		mouseWorldCoords.y = Math.floor(mouseWorldCoords.y / grid.cellSize);

		if (mouseWorldCoords.x > grid.width || mouseWorldCoords.x < 0 || mouseWorldCoords.y > grid.width || mouseWorldCoords.y < 0) return;

		let result;
		for (const property in grid.cells) {
			result = grid.cells[property].find((c) => {
				return (mouseWorldCoords.x === c.x && mouseWorldCoords.y === c.y);
			});
		}

		if (!result) {
			grid.addCell(mouseWorldCoords.x, mouseWorldCoords.y, "blue");
		} else {
			result.color = "blue";
		}
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

let frameCount = 0;
let pastFrameCount = 0;

function render() {
	// c.drawingContext.globalAlpha = 0;
	frameCount++;
	c.drawingContext.fillStyle = "lightgrey";
	c.drawingContext.fillRect(0, 0, canvasWidth, canvasHeight);
	grid.show();
	requestAnimationFrame(render);
}

render();

setInterval(() => {
	console.log(frameCount - pastFrameCount);
	pastFrameCount = frameCount;
}, 1000);