let frameCount = 0;
let pastFrameCount = 0;




//
screen.htmlCanvasElement.addEventListener("mouseup", function(e) {
	if (spriteMode.checked && !keysDown["Shift"] && presets.selectedIndex != -1) {
		let spriteWorldLocation = world.screenToWorld(mouseCoords.x, mouseCoords.y, screen.htmlCanvasElement)
		spriteObjects.push({
			worldX: spriteWorldLocation.x,
			worldY: spriteWorldLocation.y,
			color: {
				R: presetValue.R,
				G: presetValue.G,
				B: presetValue.B
			},
			height: presetValue.H
		});

		console.log(spriteWorldLocation.x, spriteWorldLocation.y);
	}
});

function render() {
	// c.drawingContext.globalAlpha = 0;
	frameCount++;

	if (mouseIndex > 0 && mouseIndex < grid.width * grid.height && !spriteMode.checked && presets.selectedIndex != -1) {

		if (mouseDown && !keysDown["Shift"]) {
			let intColor = RGBAToInt(presetValue.R, presetValue.G, presetValue.B, 255);

			if (keysDown[" "]) {
				grid.data[mouseIndex] = 0;
			} else {
				grid.data[mouseIndex] = intColor;
				raycastScene.add("cellInfo", {
					appearance: new Pseudo3D.Color(presetValue.R, presetValue.G, presetValue.B, 255),
					height: presetValue.H
				}, intColor);
			}
		}
	}

	if (keysDown["a"]) {
		camera.orientation.position.subtract(camera.plane.clone().normalize().scale(moveSpeed));
	}
	if (keysDown["d"]) {
		camera.orientation.position.add(camera.plane.clone().normalize().scale(moveSpeed));
	}
	if (keysDown["w"]) {
		camera.orientation.position.add(camera.orientation.direction.clone().normalize().scale(moveSpeed));
	}
	if (keysDown["s"]) {
		camera.orientation.position.subtract(camera.orientation.direction.clone().normalize().scale(moveSpeed));
	}
	if (keysDown["q"]) {
		camera.orientation.position.z += 0.1;
	}
	if (keysDown["e"]) {
		camera.orientation.position.z -= 0.1;
	}

	drawBackground(screen, "lightgrey")
	grid.show();

	screen.update();

	drawPlayer(screen, "black", "magenta");


	for (var i = 0; i < spriteObjects.length; i++) {
		let spriteCoords = world.worldToScreen(spriteObjects[i].worldX, spriteObjects[i].worldY, screen.htmlCanvasElement);
		drawSprite(screen, spriteObjects[i].color, spriteCoords.x, spriteCoords.y);
	}
	screen.setPixels();
	screen.update();

	drawRaycaster();
	requestAnimationFrame(render);
}

function drawRaycaster() {
	raycastScreen.clear();
	Pseudo3D.Renderer.render(raycastScreen, raycastScene, camera);
	raycastScreen.update();
}


render();

setInterval(() => {
	console.log(frameCount - pastFrameCount);
	pastFrameCount = frameCount;
}, 1000);