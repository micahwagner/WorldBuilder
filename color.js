function RGBAToInt(R, G, B, A) {
	return (R << 8 | G << 8 | B << 8 | A);
}

function intToRGBA(num) {
	let R = (num >> 24) & 0xFF;
	let G = ((num & 0x00FF0000) >> 16) & 0xFF;
	let B = ((num & 0x0000FF00) >> 8) & 0xFF;
	let A = (num & 0x000000FF) & 0xFF;

	return {
		R: R,
		G: G,
		B: B,
		A: A
	};
}