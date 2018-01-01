export default (getRepsInputs = startingValue => {
	if (!startingValue) {
		return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
	}
	//always add 10 after starting value
	const inputs = new Array(startingValue + 10);
	let i = 1;
	while (i < startingValue + 11) {
		inputs[i - 1] = i;
		i++;
	}
	return inputs;
});
