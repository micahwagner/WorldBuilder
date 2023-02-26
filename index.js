let canvasWidth = 700;
let canvasHeight = 700;

let screen = new Screen(700, 700, 1);
screen.setParent(document.body);
let colors = [0xFF0000FF, 0x00FF00FF, 0x0000FFFF, 0xFFFF00FF];
let grid = new Grid(100, 100, screen);
for (var y = 0; y < 100; y++) {
	for (var x = 0; x < 100; x++) {
		let color = colors[Math.floor(Math.random() * 4)];
		if (Math.random() < 0.3) grid.data[x + y * 100] = color;
	}
}

let raycastScene = new Pseudo3D.Scene({
	worldMap: {
		data: grid.data,
		width: grid.width,
		height: grid.height,
		cellInfo: {
			0xFF0000FF: {
				appearance: new Pseudo3D.Color(255, 0, 0, 255)
			},
			0x00FF00FF: {
				appearance: new Pseudo3D.Color(0, 255, 0, 255)
			},
			0x0000FFFF: {
				appearance: new Pseudo3D.Color(0, 0, 255, 255)
			},
			0xFFFF00FF: {
				appearance: new Pseudo3D.Color(255, 255, 0, 255)
			}
		},
	},

	lighting: {
		sideShade: 0.3
	},

});

let raycastScreen = new Pseudo3D.Screen(700, 700, 0.4);

raycastScreen.setParent(document.body);

let camera = new Pseudo3D.Camera({
	position: {
		x: 1,
		y: 1,
	},
});


let sensitivity = 0.0005;
let moveSpeed = 0.1;

let mouseIndex = 0;

screen.htmlCanvasElement.addEventListener("mousemove", function(e) {
	if (mouseDown && keysDown["Shift"]) {
		// add by a fraction of scale factor so rate of moving objects align with mouse
		world.transform.originX += e.movementX / world.transform.scaleFactor;
		world.transform.originY += e.movementY / world.transform.scaleFactor;
		grid.transform();
	}

	let mouseWorldCoords = world.screenToWorld(e.clientX, e.clientY, screen.htmlCanvasElement);
	mouseWorldCoords.x += grid.width / 2;
	mouseWorldCoords.y += grid.height / 2;
	mouseIndex = Math.floor(mouseWorldCoords.x) + Math.floor(mouseWorldCoords.y) * grid.width;
});

screen.htmlCanvasElement.addEventListener("wheel", function(e) {
	// set scale factor to some fraction of itself so zooming in feels constant
	world.transform.scaleFactor += world.transform.scaleFactor * e.deltaY * sensitivity;
	if (world.transform.scaleFactor < 0.0001) {
		world.transform.scaleFactor = 0.0001;
	}
	grid.transform();
});

raycastScreen.htmlCanvasElement.addEventListener("click", function() {
	raycastScreen.htmlCanvasElement.requestPointerLock();
});

let mouseX = 0;
let mouseY = 0;

raycastScreen.htmlCanvasElement.addEventListener("mousemove", (e) => {
	mouseX += e.movementX;
	mouseY += e.movementY;
	if (!keysDown["t"]) {
		let angle = Pseudo3D.Math.remap(mouseX, 0, raycastScreen.width, -Math.PI / 2, Math.PI / 2);
		camera.setRotation(angle);
		camera.pitch = (raycastScreen.height / 2 - mouseY) * 0.5;
	}
});

setupInput(screen.htmlCanvasElement);

let frameCount = 0;
let pastFrameCount = 0;

function render() {
	// c.drawingContext.globalAlpha = 0;
	frameCount++;

	if (mouseIndex > 0 && mouseIndex < grid.width * grid.height) {

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

	screen.clear();
	screen.drawingContext.fillStyle = "lightgrey";
	screen.drawingContext.fillRect(0, 0, canvasWidth, canvasHeight);
	screen.setPixels();
	grid.show();
	screen.update();

	raycastScreen.clear();
	Pseudo3D.Renderer.render(raycastScreen, raycastScene, camera);
	raycastScreen.update();
	requestAnimationFrame(render);
}

render();

setInterval(() => {
	console.log(frameCount - pastFrameCount);
	pastFrameCount = frameCount;
}, 1000);