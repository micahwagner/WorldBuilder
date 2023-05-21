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


function drawBackground(screen, color) {
	screen.clear();
	screen.drawingContext.fillStyle = color;
	screen.drawingContext.fillRect(0, 0, canvasWidth, canvasHeight);
	screen.setPixels();
}

function drawPlayer(screen, playerColor, dirColor) {

	let cameraCoords = world.worldToScreen(camera.orientation.position.x - grid.width/2, camera.orientation.position.y - grid.height/2, screen.htmlCanvasElement);
	let dirVectCoords = world.worldToScreen((camera.orientation.position.x - grid.width/2) + camera.orientation.direction.x, camera.orientation.position.y - grid.height/2 + camera.orientation.direction.y, screen.htmlCanvasElement);

	//draw player
	screen.drawingContext.beginPath();
	screen.drawingContext.arc(cameraCoords.x, cameraCoords.y, world.transformLength(0.3), 0,  2*Math.PI);
	screen.drawingContext.fillStyle = playerColor;
	screen.drawingContext.fill();
	screen.drawingContext.closePath();

	// draw direction
	screen.drawingContext.beginPath();
	screen.drawingContext.lineTo(cameraCoords.x , cameraCoords.y);
	screen.drawingContext.lineTo(dirVectCoords.x ,dirVectCoords.y );
	screen.drawingContext.strokeStyle = dirColor;
	screen.drawingContext.stroke();
	screen.drawingContext.closePath();

}

function drawSprite(screen, spritecolor, x, y) {
	screen.drawingContext.beginPath();
	screen.drawingContext.arc(x, y, world.transformLength(0.3), 0,  2*Math.PI);
	screen.drawingContext.stroke();
	screen.drawingContext.closePath();

}
