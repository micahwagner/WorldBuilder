function drawVerticalLine(xStart, y1, y2, strokeWeight, screen) {
	let new_x = Math.round(xStart - strokeWeight / 2);
	let clippedInitialX = clamp(new_x, 0, screen.renderWidth); 
	let clippedFinalX = clamp(new_x + strokeWeight, 0, screen.renderWidth);
	let clippedInitialY = clamp(y1, 0, screen.renderHeight); 
	let clippedFinalY = clamp(y2, 0, screen.renderHeight); 

	for (let y = clippedInitialY; y < clippedFinalY; y++) {
		for (let x = clippedInitialX; x < clippedFinalX; x++) {
			let screenIndex = (x + y * screen.renderWidth) * 4;
			screen.pixels[screenIndex] = 0;
			screen.pixels[screenIndex + 1] = 0;
			screen.pixels[screenIndex + 2] = 0;
			screen.pixels[screenIndex + 3] = 255;
		}
	}
}

function drawHorizontalLine(yStart, x1, x2, strokeWeight, screen) {
	let new_y = Math.round(yStart - strokeWeight / 2);
	let clippedInitialX = clamp(x1, 0, screen.renderWidth); 
	let clippedFinalX = clamp(x2, 0, screen.renderWidth);
	let clippedInitialY = clamp(new_y, 0, screen.renderHeight); 
	let clippedFinalY = clamp(new_y + strokeWeight, 0, screen.renderHeight); 


	for (let y = clippedInitialY; y < clippedFinalY; y++) {
		for (let x = clippedInitialX; x < clippedFinalX; x++) {
			let screenIndex = (x + y * screen.renderWidth) * 4;
			screen.pixels[screenIndex] = 0;
			screen.pixels[screenIndex + 1] = 0;
			screen.pixels[screenIndex + 2] = 0;
			screen.pixels[screenIndex + 3] = 255;
		}
	}
}