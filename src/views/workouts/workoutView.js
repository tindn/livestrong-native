import React from 'react';
import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';

export default (WorkoutView = props => {
	return (
		<ScrollView style={styles.scrollView}>
			<View>
				<Text>{getTimeDisplay(props.workout)}</Text>
			</View>
			<View style={styles.exercisesView}>
				{props.workout.exercises.map((exercise, exerciseIndex) => (
					<View key={exerciseIndex} style={styles.exercise}>
						<Text style={styles.label}>{exercise.displayName}</Text>
						{exercise.sets &&
							exercise.sets.map((set, setIndex) => {
								return (
									<View key={setIndex} style={styles.setsView}>
										<Text>
											{`${setIndex +
												1}.   ${set.reps.toString()} reps at ${set.weight.toString()} ${
												set.weightUnit
											}`}
										</Text>
									</View>
								);
							})}
					</View>
				))}
			</View>
		</ScrollView>
	);
});

function getTimeDisplay(workout) {
	let display = `Started at ${new Date(
		parseInt(workout.startTimestamp)
	).toLocaleTimeString()}`;
	if (workout.endTimestamp) {
		display += ` and lasted for ${new Date(
			workout.endTimestamp - workout.startTimestamp
		)
			.toISOString()
			.slice(11, -5)}`;
	}
	return display;
}

const styles = StyleSheet.create({
	scrollView: {
		paddingTop: 10,
		paddingLeft: 5
	},
	label: {
		fontWeight: 'bold'
	},
	exercisesView: {
		paddingTop: 20,
		paddingLeft: 20
	},
	exercise: {
		paddingBottom: 15
	},
	setsView: {
		paddingTop: 5
	}
});
