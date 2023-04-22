// arguments include screen dimentions and resolution
function Screen(width, height, quality) {
	/*
	arguments passed are valid, initialize instance attributes
	width and height are pixel dimentions after css stretch
	*/
	this.width = width;
	this.height = height;
	this.quality = quality;

	// the true width and height of the canvas
	this.renderWidth = Math.round(width * quality) || 1;
	this.renderHeight = Math.round(height * quality) || 1;

	// initialize the canvas element
	this.htmlCanvasElement = document.createElement("canvas");

	// check if the browser supports the canvas element
	if (!window.CanvasRenderingContext2D) {
		throw new Error(
			"Screen failed to initialize because the Canvas element is " +
			"not supported on this browser"
		);
	}

	this.drawingContext = this.htmlCanvasElement.getContext(
		"2d", {
			willReadFrequently: true
		}
	);

	// set the width and height of the canvas
	this.htmlCanvasElement.width = this.renderWidth;
	this.htmlCanvasElement.height = this.renderHeight;

	// set the css width and height (stretch the canvas)
	this.htmlCanvasElement.style.width = this.width + "px";
	this.htmlCanvasElement.style.height = this.height + "px";

	// prevents pixel blur when css stretches the canvas
	this.htmlCanvasElement.style["image-rendering"] = "pixelated";

	// actual pixel data of the screen
	this.pixels = this.drawingContext.getImageData(
		0,
		0,
		this.renderWidth,
		this.renderHeight
	).data;
}

// clears the pixel and depth buffers
Screen.prototype.clear = function() {
	// clear the canvas by drawing an empty ImageData
	let emptyImageData = this.drawingContext.createImageData(
		this.renderWidth,
		this.renderHeight
	);
	this.drawingContext.putImageData(emptyImageData, 0, 0);

	// set the pixels array to the emptyImageData array
	this.pixels = emptyImageData.data;
}

// sets the pixels array to the current state of the canvas screen
Screen.prototype.setPixels = function() {
	this.pixels = this.drawingContext.getImageData(
		0,
		0,
		this.renderWidth,
		this.renderHeight
	).data;
}

// draws the pixels data array to the screen
Screen.prototype.update = function() {
	let tempImageData = new ImageData(
		this.pixels,
		this.renderWidth
	);
	this.drawingContext.putImageData(tempImageData, 0, 0);
}

// appends the htmlCanvasElement as a child to the passed node
Screen.prototype.setParent = function(node) {
	// check if the parameter received is valid
	if (!(node instanceof Node)) {
		throw new Error(
			"Failed to execute Screen.setParent: parameter 1 is not of " +
			"type node"
		);
	}

	// append the canvas element to the node
	node.appendChild(this.htmlCanvasElement);
}


let keysDown = {};
let mouseDown = false;

function setupInput(canvas) {
	canvas.addEventListener("mousedown", function(e) {
		mouseDown = true;
	});

	canvas.addEventListener("mouseup", function(e) {
		mouseDown = false;
	});

	window.addEventListener("keydown", function(e) {
		keysDown[e.key] = true;

	});

	window.addEventListener("keyup", function(e) {
		keysDown[e.key] = false;

	});
}