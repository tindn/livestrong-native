import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default (WorkoutView = props => {
	return (
		<ScrollView style={styles.scrollView}>
			<Text>
				{new Date(parseInt(props.workout.startTimestamp)).toLocaleTimeString()}
			</Text>
			<Text>
				{new Date(props.workout.endTimestamp - props.workout.startTimestamp)
					.toISOString()
					.slice(11, -1)}
			</Text>
			<Text style={styles.label}>Exercises</Text>
			{props.workout.exercises.map((exercise, exerciseIndex) => {
				return (
					<View key={exerciseIndex}>
						<Text>{exercise.displayName}</Text>
						{exercise.sets.map((set, setIndex) => {
							return (
								<View key={setIndex}>
									<Text>
										{`${set.reps.toString()} reps at ${set.weight.toString()} ${set.weightUnit}`}
									</Text>
								</View>
							);
						})}
					</View>
				);
			})}
		</ScrollView>
	);
});

const styles = StyleSheet.create({
	scrollView: {
		paddingTop: 10,
		paddingLeft: 5
	},
	label: {
		fontWeight: 'bold'
	}
});
