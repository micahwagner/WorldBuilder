let moveSpeed = 0.05;
let sensitivity = 0.0005
let mouseIndex = 0;
let mouseWorldCoords;
let mouseCoords = {};
let spriteMode = document.getElementById("spritemode");
let worldHeightTextField = document.getElementById("wHeight");
let worldWidthTextField = document.getElementById("wWidth");
let createWorldButton = document.getElementById("createWorld");
let worldHeight = parseInt(worldHeightTextField.value);
let worldWidth = parseInt(worldWidthTextField.value);
let HexValueTextField = document.getElementById("HexValue");
let HeightValueTextField = document.getElementById("HeightValue");
let HeightValue = parseInt(HeightValueTextField.value);
let HexValue = hexToInt(HexValueTextField.value);
let color = intToRGB(HexValue);
let PValueTextField = document.getElementById("PValue");
let PValue = "";
let PLoad = document.getElementById("LoadPreset");
let PSave = document.getElementById("SavePreset");
let presets = {};
let sprites = [];


HexValueTextField.addEventListener("change", function(e) {
	HexValue = hexToInt(HexValueTextField.value);
	color = intToRGB(HexValue);
});

HeightValueTextField.addEventListener("change", function(e) {
	HeightValue = parseInt(HeightValueTextField.value);
});

createWorldButton.addEventListener("click", function(e) {

	let okFlag = confirm("pressing this button resets all world data! Are sure you want to proceed?");

	if (!okFlag) return;

	worldHeight = parseInt(worldHeightTextField.value);
	worldWidth = parseInt(worldWidthTextField.value);
	grid = new Grid(worldWidth, worldHeight, screen);

	raycastScene = new Pseudo3D.Scene({
		worldMap: {
			data: grid.data,
			width: grid.width,
			height: grid.height,
			cellInfo: {},
		},

		lighting: {
			sideShade: 0.3
		},

	});

	sprites = [];
});

PValueTextField.addEventListener("change", function(e) {
	PValue = document.getElementById("PValue").value;
});
PLoad.addEventListener("click", function(e) {
	RValue = presets[PValue].R;
	GValue = presets[PValue].G;
	BValue = presets[PValue].B;
	HValue = presets[PValue].H;

	RValueTextField.value = presets[PValue].R;
	GValueTextField.value = presets[PValue].G;
	BValueTextField.value = presets[PValue].B;
	HValueTextField.value = presets[PValue].H;

});
PSave.addEventListener("click", function(e) {
	presets[PValue] = {
		R: RValue,
		G: GValue,
		B: BValue,
		H: HValue
	};
});

// map scene ipnut handling
screen.htmlCanvasElement.addEventListener("mousemove", function(e) {
	if (mouseDown && keysDown["Shift"]) {
		// add by a fraction of scale factor so rate of moving objects align with mouse
		world.transform.originX += e.movementX / world.transform.scaleFactor;
		world.transform.originY += e.movementY / world.transform.scaleFactor;
		grid.transform();
	}

	mouseCoords = {
		x: e.offsetX,
		y: e.offsetY
	};
	mouseWorldCoords = world.screenToWorld(mouseCoords.x, mouseCoords.y, screen.htmlCanvasElement);
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


// raycast mouse handling 
raycastScreen.htmlCanvasElement.addEventListener("click", async function() {
	if (!document.pointerLockElement) {
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