import { AsyncStorage } from 'react-native';
// import seedling from '../../seedData.json';
import uuid from 'uuid/v5';
import secrets from '../../config/secrets.json';

function dangerouslyClearEverything() {
	return AsyncStorage.clear();
}

function seedData(seedling) {
	seedling.forEach(function(element) {
		AsyncStorage.setItem(element.key, JSON.stringify(element.value));
	}, this);
}

function restoreData(data) {
	data.forEach(function(element) {
		AsyncStorage.setItem(element[0], element[1]);
	}, this);
}

function getAllData() {
	return AsyncStorage.getAllKeys().then(function(keys) {
		return AsyncStorage.multiGet(keys);
	});
}

function getAllExercises() {
	return _getKeys(function(key) {
		return key.substring(0, 8) === 'exercise';
	}).then(getValues);
}

function getExercise(exerciseId) {
	return AsyncStorage.getItem('exercise.' + exerciseId).then(function(
		exerciseString
	) {
		return JSON.parse(exerciseString);
	});
}

function saveExercise(exercise) {
	if (exercise.id === undefined) {
		exercise.id = uuid(exercise.name, secrets.NS);
		return setItem('exercise.' + exercise.id, JSON.stringify(exercise));
	} else {
		return AsyncStorage.mergeItem(
			'exercise.' + exercise.id,
			JSON.stringify(exercise)
		).then(_updateTimestamp);
	}
}

function deleteExercise(exercise) {
	if (exercise.id === undefined) {
		return;
	}
	AsyncStorage.removeItem('exercise.' + exercise.id).then(_updateTimestamp);
}

function _getKeys(keySelector) {
	return AsyncStorage.getAllKeys().then(function(keys) {
		if (keySelector === undefined) {
			return keys;
		}
		return keys.reduce(function(acc, key) {
			if (keySelector(key)) {
				acc.push(key);
			}
			return acc;
		}, []);
	});
}

function getValues(keys) {
	return AsyncStorage.multiGet(keys).then(function(data) {
		return data.map(function(string) {
			return JSON.parse(string[1]);
		});
	});
}

function getAllPlans() {
	return _getKeys(function(key) {
		return key.substring(0, 4) === 'plan';
	}).then(getValues);
}

function savePlan(plan) {
	if (plan.id === undefined) {
		plan.id = uuid(plan.name, secrets.NS);
		return setItem('plan.' + plan.id, JSON.stringify(plan));
	} else {
		return AsyncStorage.mergeItem('plan.' + plan.id, JSON.stringify(plan)).then(
			_updateTimestamp
		);
	}
}

function deletePlan(plan) {
	if (plan.id === undefined) {
		return;
	}
	AsyncStorage.removeItem('plan.' + plan.id).then(_updateTimestamp);
}

function saveWorkout(workout) {
	if (workout.id === undefined) {
		workout.id = uuid(workout.startTimestamp, secrets.NS);
	}
	return setItem('workout.' + workout.id, JSON.stringify(workout)).then(() => {
		return workout;
	});
}

function getAllWorkouts() {
	return _getKeys(function(key) {
		return key.substring(0, 7) === 'workout';
	}).then(getValues);
}

function flushGetRequests() {
	AsyncStorage.flushGetRequests();
}

function _updateTimestamp() {
	AsyncStorage.setItem('lastUpdated', new Date().getTime().toString());
}

function getItem(key) {
	return AsyncStorage.getItem(key).then(value => {
		if (value && (value[0] === '{' || value[0] === '[')) {
			return JSON.parse(value);
		}
		return value;
	});
}

function setItem(key, value) {
	return AsyncStorage.setItem(key, value).then(_updateTimestamp);
}

function mergeItem(key, value) {
	return AsyncStorage.mergeItem(key, value).then(_updateTimestamp);
}

function deleteItem(key) {
	return AsyncStorage.removeItem(key).then(_updateTimestamp);
}

module.exports = {
	dangerouslyClearEverything,
	seedData,
	getAllData,
	getAllExercises,
	getExercise,
	saveExercise,
	deleteExercise,
	getAllPlans,
	savePlan,
	deletePlan,
	saveWorkout,
	getAllWorkouts,
	getItem,
	setItem,
	getValues,
	restoreData,
	mergeItem,
	deleteItem
};
