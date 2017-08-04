import React from 'react';
import { View, Text, Button, Picker, StyleSheet } from 'react-native';

export default class ExercisePicker extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedValue: '-1'
		};
		this._updateSelectedValue = this._updateSelectedValue.bind(this);
		this._addExercise = this._addExercise.bind(this);
	}
	render() {
		return (
			<View>
				<Picker
					selectedValue={this.state.selectedValue}
					onValueChange={this._updateSelectedValue}
					style={styles.exercisePicker}
				>
					<Picker.Item key={-1} label="" value="-1" />
					{this.props.allExercises.map(function(exercise, index) {
						return (
							<Picker.Item
								key={index}
								label={exercise.displayName}
								value={index}
							/>
						);
					})}
				</Picker>
				<View style={styles.actionButtons}>
					<Button
						title="Cancel"
						onPress={this.props.cancelPicker}
						color="red"
					/>
					<Button
						title="Add Exercise"
						onPress={this._addExercise}
						disabled={this.state.selectedValue === '-1'}
					/>
				</View>
			</View>
		);
	}

	_updateSelectedValue(value, position) {
		console.log(value);
		this.setState({
			selectedValue: value
		});
	}

	_addExercise() {
		if (this.state.selectedValue === '-1') {
			return;
		}
		this.props.addExercise(this.props.allExercises[this.state.selectedValue]);
	}
}

const styles = StyleSheet.create({
	exercisePicker: {
		paddingLeft: 25,
		paddingRight: 25
	},
	actionButtons: {
		flexDirection: 'row',
		justifyContent: 'space-between'
	}
});
