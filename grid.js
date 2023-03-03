function Grid(width, height, screen) {
	this.x = 0;
	this.y = 0;
	this.screen = screen;
	this.stroke = 0.1;

	this.width = width;
	this.height = height;

	this.data = [];

	for (let i = 0; i < this.width * this.height; i++) {
		this.data[i] = 0;
	}

	this.screenX;
	this.screenY;

	this.pixelWidth;
	this.pixelHeight;

	this.transform();
}

Grid.prototype.transform = function() {
	// scale box width and height by scale factor
	this.pixelWidth = world.transformLength(this.width);
	this.pixelHeight = world.transformLength(this.height);

	// this is the final position of box
	// subtract by the widthScale/2 and heightScale/2 so that fillRect properly draws rectanlge relative to center
	let screenCoords = world.worldToScreen(this.x, this.y, this.screen.htmlCanvasElement);
	this.screenX = screenCoords.x - this.pixelWidth / 2;
	this.screenY = screenCoords.y - this.pixelHeight / 2;
	return this;
};

Grid.prototype.show = function() {

	let topLeftX = this.screenX;
	let topLeftY = this.screenY;

	let bottomRightX = topLeftX + this.pixelWidth;
	let bottomRightY = topLeftY + this.pixelHeight;

	let step = 1 / world.transform.scaleFactor;

	topLeftX = Math.floor(clamp(topLeftX, 0, this.screen.renderWidth));
	topLeftY = Math.floor(clamp(topLeftY, 0, this.screen.renderHeight));

	bottomRightX = Math.floor(clamp(bottomRightX, 0, this.screen.renderWidth));
	bottomRightY = Math.floor(clamp(bottomRightY, 0, this.screen.renderHeight));

	let gridX = this.screenX < 0 ? step * Math.abs(this.screenX) : 0;
	let gridXInitial = gridX;
	let gridY = this.screenY < 0 ? step * Math.abs(this.screenY) : 0;


	for (let y = topLeftY; y < bottomRightY; y++) {
		for (let x = topLeftX; x < bottomRightX; x++) {
			let screenIndex = (x + y * this.screen.renderWidth) * 4;
			let gridIndex = Math.floor(gridX) + Math.floor(gridY) * this.width;
			let color = intToRGBA(this.data[gridIndex] || 0xDCDCDCFF);
			this.screen.pixels[screenIndex] = color.R;
			this.screen.pixels[screenIndex + 1] = color.G;
			this.screen.pixels[screenIndex + 2] = color.B;
			this.screen.pixels[screenIndex + 3] = color.A;
			gridX += step;
		}
		gridX = gridXInitial;
		gridY += step;
	}


	let xTerminal = Math.floor(this.screenX + this.pixelWidth);
	let yTerminal = Math.floor(this.screenY + this.pixelHeight);
	let lineStroke = Math.floor(world.transform.scaleFactor * this.stroke);

	if(lineStroke == 0) return;

	for (let y = 0; y < this.height + 1; y++) {
		drawHorizontalLine(Math.floor(this.screenY + world.transform.scaleFactor * y), Math.floor(this.screenX), xTerminal, lineStroke, this.screen);		
	}

	for (let x = 0; x < this.width + 1; x++) {
		drawVerticalLine(Math.floor(this.screenX + world.transform.scaleFactor * x), Math.floor(this.screenY), yTerminal, lineStroke, this.screen);	
	}

};

