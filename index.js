let frameCount = 0;
let pastFrameCount = 0;
let sprites = [];


screen.htmlCanvasElement.addEventListener("mouseup", function(e) {
	if (spriteMode.checked && !keysDown["Shift"]) {
		let spriteWorldLocation = world.screenToWorld(mouseCoords.x, mouseCoords.y, screen.htmlCanvasElement)
		sprites.push({
			worldX: spriteWorldLocation.x,
			worldY: spriteWorldLocation.y,
			color: {R: RValue, G: GValue, B: BValue},
			height: HValue
		});

		console.log(spriteWorldLocation.x, spriteWorldLocation.y);
	}
});

function render() {
	// c.drawingContext.globalAlpha = 0;
	frameCount++;

	if (mouseIndex > 0 && mouseIndex < grid.width * grid.height && !spriteMode.checked) {

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


	for (var i = 0; i < sprites.length; i++) {
		let spriteCoords = world.worldToScreen(sprites[i].worldX, sprites[i].worldY, screen.htmlCanvasElement);
		drawSprite(screen, sprites[i].color, spriteCoords.x, spriteCoords.y);
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