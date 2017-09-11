import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default (WorkoutView = props => {
	return (
		<ScrollView>
			<Text style={styles.header}>
				{new Date(parseInt(props.workout.startTimestamp)).toString()}
			</Text>
			<Text style={styles.label}>Plan Id</Text>
			<Text>
				{props.workout.planId}
			</Text>
			<Text style={styles.label}>Day Index</Text>
			<Text>
				{props.workout.dayIndex}
			</Text>
			<Text style={styles.label}>Exercises</Text>
			{props.workout.exercises.map((exercise, exerciseIndex) => {
				return (
					<View key={exerciseIndex}>
						<Text>
							{exercise.displayName}
						</Text>
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
	header: {
		fontWeight: 'bold'
	},
	label: {
		fontWeight: 'bold'
	}
});
