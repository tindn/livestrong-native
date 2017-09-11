function sortByDisplayName(obj1, obj2) {
	if (obj1.displayName < obj2.displayName) {
		return -1;
	} else if (obj1.displayName > obj2.displayName) {
		return 1;
	}
	return 0;
}

function sortByStartTimestamp(obj1, obj2) {
	return parseInt(obj2.startTimestamp) - parseInt(obj1.startTimestamp);
}

export { sortByDisplayName, sortByStartTimestamp };
