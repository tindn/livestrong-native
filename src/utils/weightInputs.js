export default (getWeightInputs = (startingValue, step) => {
	if (!startingValue && !step) {
		return [
			2.5,
			5,
			7.5,
			10,
			12.5,
			15,
			17.5,
			20,
			22.5,
			25,
			27.5,
			30,
			32.5,
			35,
			37.5,
			40,
			42.5,
			45,
			47.5,
			50
		];
	}
	if (!step) {
		step = 2.5;
	}
	let inputs = [startingValue];
	let i = 1;
	while (i < 11) {
		const left = startingValue - step * i;
		if (left > 0) {
			inputs.unshift(left);
		}
		const right = startingValue + step * i;
		inputs.push(right);
		i++;
	}
	return inputs;
});
