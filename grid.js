function Grid(width, height, cellSize, screen) {
	this.width = width;
	this.height = height;
	this.cellSize = cellSize;
	this.cells = {};

	this.screen = screen;
}


Grid.prototype.show = function() {

	let ctx = this.screen.drawingContext;
	let canvas = this.screen.canvas;
	// fill squares 
	for (const color in this.cells) {
		ctx.fillStyle = color;
		for (let i = 0; i < this.cells[color].length; i++) {
			this.cells[color][i].rect.show();
		}
	}

	let screenCellSize = world.transformLength(this.cellSize);

	// draw lines
	ctx.lineWidth = world.transformLength(0.5);
	for (let i = 0; i < this.width + 1; i++) {
		let lineCoords = world.worldToScreen((this.cellSize * i) - this.cellSize/2, -this.cellSize/2, canvas);
		ctx.beginPath();
		ctx.moveTo(lineCoords.x, lineCoords.y);
		ctx.lineTo(lineCoords.x, lineCoords.y + screenCellSize * this.height);
		ctx.stroke();
	}

	for (let i = 0; i < this.height + 1; i++) {
		let lineCoords = world.worldToScreen(-this.cellSize/2, (this.cellSize * i) - this.cellSize/2, canvas);
		ctx.beginPath();
		ctx.moveTo(lineCoords.x, lineCoords.y);
		ctx.lineTo(lineCoords.x + screenCellSize * this.width, lineCoords.y);
		ctx.stroke();
	}

}

Grid.prototype.transform = function() {
	for (const color in this.cells) {
		for (let i = 0; i < this.cells[color].length; i++) {
			this.cells[color][i].rect.transform();
		}
	}
}

Grid.prototype.addCell = function(x, y, color) {
	if (this.cells[color] === undefined) {
		this.cells[color] = [];
	}

	this.cells[color].push({
		rect: new Rectangle(
			x * this.cellSize,
			y * this.cellSize,
			this.cellSize,
			this.cellSize,
			this.screen),
		x: x,
		y: y
	});
	return this;
}