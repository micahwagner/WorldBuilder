let canvasWidth = 1000;
let canvasHeight = 1000;

let c = createCanvas(canvasWidth, canvasHeight);

let worldTransform = {
	originX: 0,
	originY: 0,
	scaleFactor: 1
};

let grid = [];
let gridWidth = 60;
let gridHeight = 40;
let gridCellSize = 100;
let sensitivity = 0.0005;

c.canvas.addEventListener("mousemove", function(e) {
	if (mouseDown && keysDown["Shift"]) {
		// add by a fraction of scale factor so rate of moving objects align with mouse
		worldTransform.originX += e.movementX / worldTransform.scaleFactor;
		worldTransform.originY += e.movementY / worldTransform.scaleFactor;
		transformGrid();
	}
});

c.canvas.addEventListener("wheel", function(e) {
	// set scale factor to some fraction of itself so zooming in feels constant
	worldTransform.scaleFactor += worldTransform.scaleFactor * e.deltaY * sensitivity;
	if (worldTransform.scaleFactor < 0.0001) {
		worldTransform.scaleFactor = 0.0001;
	}
	transformGrid();
});

setupInput(c);
initGrid();

function render() {
	// c.drawingContext.globalAlpha = 0;
	c.drawingContext.fillStyle = "lightgrey";
	c.drawingContext.fillRect(0, 0, canvasWidth, canvasHeight);
	c.drawingContext.globalAlpha = 1;
	c.drawingContext.fillStyle = "blue";
	showGrid(c.drawingContext);
	requestAnimationFrame(render);
}

render();


function initGrid() {

	for (let y = 0; y < gridHeight; y++) {
		let tmp = [];

		for (let x = 0; x < gridWidth; x++) {
			tmp.push(new Rectangle(x * gridCellSize, y * gridCellSize, gridCellSize, gridCellSize, "white"));
		}
		grid.push(tmp);
	}
}

function showGrid(ctx) {
	for (let y = 0; y < gridHeight; y++) {
		for (let x = 0; x < gridWidth; x++) {
			grid[y][x].show(ctx);
		}
	}
}

function transformGrid() {
	for (let y = 0; y < gridHeight; y++) {
		for (let x = 0; x < gridWidth; x++) {
			grid[y][x].transform();
		}
	}
}