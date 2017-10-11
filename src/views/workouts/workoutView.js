import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default (WorkoutView = props => {
	return (
		<ScrollView style={styles.scrollView}>
			<View>
				<Text>
					{`Started at ${new Date(
						parseInt(props.workout.startTimestamp)
					).toLocaleTimeString()} and lasted for ${new Date(
						props.workout.endTimestamp - props.workout.startTimestamp
					)
						.toISOString()
						.slice(11, -5)}`}
				</Text>
			</View>
			<View style={styles.exercisesView}>
				{props.workout.exercises.map((exercise, exerciseIndex) => (
					<View key={exerciseIndex} style={styles.exercise}>
						<Text style={styles.label}>{exercise.displayName}</Text>
						{exercise.sets.map((set, setIndex) => {
							return (
								<View key={setIndex} style={styles.setsView}>
									<Text>
										{`${setIndex +
											1}.   ${set.reps.toString()} reps at ${set.weight.toString()} ${set.weightUnit}`}
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
