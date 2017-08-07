import React from 'react';
import {
	Button,
	Text,
	TextInput,
	TouchableHighlight,
	View
} from 'react-native';

export default class ExerciseEntry extends React.Component {
	constructor(props) {
		super(props);
		let exercise = this.props.exercise;
		if (!exercise.sets) {
			exercise.sets = [];
		}
		this.state = {
			exercise: exercise
		};
	}

	render() {
		return (
			<View>
				<View style={{ paddingLeft: 20 }}>
					<Text style={{ fontSize: 17 }}>
						{this.props.exercise.displayName}
					</Text>
				</View>
				{this.state.exercise.sets.map((set, index) => {
					return (
						<View style={{ flexDirection: 'row' }} key={index}>
							<TouchableHighlight
								onPress={() => {
									this.setState(prevState => {
										prevState.exercise.sets[index].reps--;
										return prevState;
									});
								}}
							>
								<Text>-</Text>
							</TouchableHighlight>
							<TextInput
								style={{ height: 30, width: 30 }}
								value={set.reps.toString()}
							/>
							<TouchableHighlight
								onPress={() => {
									this.setState(prevState => {
										prevState.exercise.sets[index].reps++;
										return prevState;
									});
								}}
							>
								<Text>+</Text>
							</TouchableHighlight>
							<Text>reps at</Text>
							<TouchableHighlight
								onPress={() => {
									this.setState(prevState => {
										prevState.exercise.sets[index].weight -= 2.5;
										return prevState;
									});
								}}
							>
								<Text>-</Text>
							</TouchableHighlight>
							<TextInput
								style={{ height: 30, width: 50 }}
								value={set.weight.toString()}
							/>
							<TouchableHighlight
								onPress={() => {
									this.setState(prevState => {
										prevState.exercise.sets[index].weight += 2.5;
										return prevState;
									});
								}}
							>
								<Text>+</Text>
							</TouchableHighlight>
						</View>
					);
				})}
				<Button
					onPress={() => {
						this.setState(prevState => {
							prevState.exercise.sets.push({ reps: 8, weight: 25 });
							return prevState;
						}, this.props.updateExercise(this.state.exercise, this.props.exerciseIndex));
					}}
					title="Add set"
				/>
			</View>
		);
	}
}
