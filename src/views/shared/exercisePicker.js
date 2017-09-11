import React from 'react';
import { View, Text, Button, Picker, StyleSheet } from 'react-native';
import localData from '../../utils/localData';
import { sortByDisplayName } from '../../utils/sorts';

export default class ExercisePicker extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedValue: '-1',
			allExercises: []
		};
		this._updateSelectedValue = this._updateSelectedValue.bind(this);
		this._addExercise = this._addExercise.bind(this);
	}

	componentDidMount() {
		if (!this.props.allExercises) {
			localData.getAllExercises().then(exercises => {
				this.setState(prevState => {
					prevState.allExercises = exercises.sort(sortByDisplayName);
					return prevState;
				});
			});
		} else {
			this.setState(prevState => {
				prevState.allExercises = this.props.allExercises;
				return prevState;
			});
		}
	}

	render() {
		let cancelButton = null;
		if (this.props.cancelPicker) {
			cancelButton = (
				<Button title="Cancel" onPress={this.props.cancelPicker} color="red" />
			);
		}
		let addButton = null;
		if (this.props.addExercise) {
			addButton = (
				<Button
					title="Add Exercise"
					onPress={this._addExercise}
					disabled={this.state.selectedValue === '-1'}
					style={styles.addButton}
				/>
			);
		}
		return (
			<View>
				<Picker
					selectedValue={this.state.selectedValue}
					onValueChange={this._updateSelectedValue}
					style={styles.exercisePicker}
				>
					<Picker.Item key={-1} label="" value="-1" />
					{this.state.allExercises.map(function(exercise, index) {
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
					{cancelButton}
					{addButton}
				</View>
			</View>
		);
	}

	_updateSelectedValue(value, position) {
		this.setState({
			selectedValue: value
		});
	}

	_addExercise() {
		if (this.state.selectedValue === '-1') {
			return;
		}
		this.props.addExercise(this.state.allExercises[this.state.selectedValue]);
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
