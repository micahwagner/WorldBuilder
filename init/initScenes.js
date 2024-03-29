let canvasWidth = 700;
let canvasHeight = 700;

let screen = new Screen(700, 700, 1);
screen.setParent(document.getElementById("map"));
let colors = [0xFF0000FF, 0x00FF00FF, 0x0000FFFF, 0xFFFF00FF];
let grid = new Grid(10, 10, screen);

// for (var y = 0; y < grid_height; y++) {
// 	for (var x = 0; x < grid_width; x++) {
// 		let color = colors[Math.floor(Math.random() * 4)];
// 		if (Math.random() < 0.3) grid.data[x + y * grid_width] = color;
// 	}
// }

let raycastScene = new Pseudo3D.Scene({
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

let raycastScreen = new Pseudo3D.Screen(700, 700, 0.5);

raycastScreen.setParent(document.getElementById("raycaster"));

let camera = new Pseudo3D.Camera({
	position: {
		x: 1,
		y: 1,
	},
});