let moveSpeed = 0.05;
let sensitivity = 0.0005
let mouseIndex = 0;
let mouseWorldCoords;
let mouseCoords = {};
let spriteMode = document.getElementById("spritemode");
// map scene ipnut handling
screen.htmlCanvasElement.addEventListener("mousemove", function(e) {
	if (mouseDown && keysDown["Shift"]) {
		// add by a fraction of scale factor so rate of moving objects align with mouse
		world.transform.originX += e.movementX / world.transform.scaleFactor;
		world.transform.originY += e.movementY / world.transform.scaleFactor;
		grid.transform();
	}

	mouseCoords = {x:e.offsetX, y:e.offsetY};
	mouseWorldCoords = world.screenToWorld(mouseCoords.x, mouseCoords.y, screen.htmlCanvasElement);
	mouseWorldCoords.x += grid.width / 2;
	mouseWorldCoords.y += grid.height / 2;
	mouseIndex = Math.floor(mouseWorldCoords.x)+ Math.floor(mouseWorldCoords.y) * grid.width;
});

screen.htmlCanvasElement.addEventListener("wheel", function(e) {
	// set scale factor to some fraction of itself so zooming in feels constant
	world.transform.scaleFactor += world.transform.scaleFactor * e.deltaY * sensitivity;
	if (world.transform.scaleFactor < 0.0001) {
		world.transform.scaleFactor = 0.0001;
	}
	grid.transform();
});


// raycast mouse handling 
raycastScreen.htmlCanvasElement.addEventListener("click", async function() {
	if(!document.pointerLockElement) {
		await raycastScreen.htmlCanvasElement.requestPointerLock({
			unadjustedMovement: true,
		});
	}
});

document.addEventListener("pointerlockchange", lockChangeAlert);

function lockChangeAlert() {
	if (document.pointerLockElement === raycastScreen.htmlCanvasElement) {
		raycastScreen.htmlCanvasElement.addEventListener("mousemove", updateRaycastScene);
	} else {
		raycastScreen.htmlCanvasElement.removeEventListener("mousemove", updateRaycastScene);
	}
}

let mouseX = 0;
let mouseY = 0;

function updateRaycastScene(e) {
	mouseX += e.movementX;
	mouseY += e.movementY;
	if (!keysDown["t"]) {
		let angle = Pseudo3D.Math.remap(mouseX, 0, raycastScreen.width, -Math.PI / 2, Math.PI / 2);
		camera.setRotation(angle);
		camera.pitch = (raycastScreen.height / 2 - mouseY) * 0.5;
	}
}


setupInput(screen.htmlCanvasElement);