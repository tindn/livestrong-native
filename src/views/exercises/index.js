import React from 'react';
import { Button } from 'react-native';
import { StackNavigator } from 'react-navigation';
import ExerciseList from './exerciseList';
import Exercise from './exercise';

const ExercisesView = StackNavigator({
	Exercises: {
		screen: ExerciseList,
		navigationOptions: ({ navigation }) => {
			const goToNew = () => {
				navigation.push('Exercise');
			};
			const newButton = <Button title="New" onPress={goToNew} />;
			return {
				title: 'Exercises',
				headerRight: newButton
			};
		}
	},
	Exercise: {
		screen: Exercise,
		navigationOptions: ({ navigation }) => {
			let title = 'New Exercise';
			const exercise = navigation.getParam('exercise');
			if (exercise && exercise.displayName) {
				title = exercise.displayName;
			}
			return {
				title: title
			};
		}
	}
});

export default ExercisesView;
