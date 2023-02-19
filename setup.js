function createCanvas(width, height) {

	let canvas = document.createElement("canvas");
	let drawingContext = canvas.getContext("2d");

	canvas.width = width;
	canvas.height = height;

	document.body.appendChild(canvas);

	return {
		canvas: canvas,
		drawingContext: drawingContext
	};

}


let keysDown = {};
let mouseDown = false;

function setupInput(c) {
	c.canvas.addEventListener("mousedown", function(e) {
		mouseDown = true;
	});

	c.canvas.addEventListener("mouseup", function(e) {
		mouseDown = false;
	});

	window.addEventListener("keydown", function(e) {
		keysDown[e.key] = true;

	});

	window.addEventListener("keyup", function(e) {
		keysDown[e.key] = false;

	});
}