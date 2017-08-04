function sortByDisplayName(obj1, obj2) {
	if (obj1.displayName < obj2.displayName) {
		return -1;
	} else if (obj1.displayName > obj2.displayName) {
		return 1;
	}
	return 0;
}

export { sortByDisplayName };
