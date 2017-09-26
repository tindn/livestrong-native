import React from 'react';
import {
	ActionSheetIOS,
	Alert,
	Button,
	Image,
	StyleSheet,
	Text,
	TextInput,
	TouchableHighlight,
	View
} from 'react-native';
import localData from '../../utils/localData';
import TextInputGroup from '../shared/textinputgroup';
import { TextInputGroupStyles, ActionButtonsStyles } from '../../styles';
import { ExerciseTypes } from '../../globals';
import PickerGroup from '../shared/pickerGroup';

export default class Exercise extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			exercise: props.exercise ? props.exercise : { name: '' }
		};
		this._updateName = this._updateName.bind(this);
		this._updateExercise = this._updateExercise.bind(this);
		this._deleteExercise = this._deleteExercise.bind(this);
		this._createExercise = this._createExercise.bind(this);
	}

	_updateName(name) {
		if (name === '') {
			return;
		}
		this.setState(prevState => {
			prevState.exercise.displayName = name;
			if (prevState.exercise.id === undefined) {
				prevState.exercise.name = name.toLowerCase().replace(/\s/g, '_');
			}
			return prevState;
		}, this._updateExercise);
	}

	_updateExercise() {
		if (this.state.exercise.displayName === '') {
			Alert.alert(
				'',
				'Name is required',
				[
					{
						text: 'Ok'
					}
				],
				{ cancelable: false }
			);
			return;
		}
		if (this.state.exercise.id !== undefined) {
			localData.saveExercise(this.state.exercise);
		}
	}

	_deleteExercise() {
		ActionSheetIOS.showActionSheetWithOptions(
			{
				message: 'Are you sure you want to delete this exercise?',
				options: ['Delete', 'Cancel'],
				destructiveButtonIndex: 0,
				cancelButtonIndex: 1
			},
			buttonIndex => {
				if (buttonIndex === 0) {
					localData.deleteExercise(this.state.exercise);
					this.props.navigator.pop();
				}
			}
		);
	}

	_createExercise() {
		localData.saveExercise(this.state.exercise);
		this.props.navigator.pop();
	}

	_updateType(type) {
		this.setState(prevState => {
			prevState.exercise.type = type;
			return prevState;
		}, this._updateExercise);
	}

	render() {
		console.log(
			ExerciseTypes.map(type => ({
				label: type.name,
				value: type._id
			}))
		);
		return (
			<View style={styles.exerciseView}>
				<View style={TextInputGroupStyles.input}>
					<TextInputGroup
						labelText="Name"
						inputValue={this.state.exercise.displayName}
						onChangeText={this._updateName}
						placeholderText="Run Forest, Run"
						autoFocus={true}
					/>
				</View>
				<PickerGroup
					label="Type"
					selectedValue={this.state.exercise.type}
					onValueChange={this._updateType.bind(this)}
					pickerItems={ExerciseTypes.map(type => ({
						label: type.name,
						value: type._id
					}))}
					width={150}
					itemStyle={{
						height: 110
					}}
				/>
				{this.state.exercise.heaviestSet ? (
					<View>
						<Text>Heaviest Set</Text>
						<Text
						>{`${this.state.exercise.heaviestSet.reps.toString()} reps at ${this.state.exercise.heaviestSet.weight.toString()} ${this
							.state.exercise.heaviestSet.weightUnit}`}</Text>
					</View>
				) : null}
				<View style={ActionButtonsStyles.group} />
				{this.state.exercise.id === undefined ? (
					<View style={ActionButtonsStyles.button}>
						<Button title="Create Exercise" onPress={this._createExercise} />
					</View>
				) : null}
				<View style={ActionButtonsStyles.button}>
					<Button
						title="Delete Exercise"
						onPress={this._deleteExercise}
						color="red"
					/>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	exerciseView: {
		flex: 1,
		flexDirection: 'column',
		paddingTop: 64
	}
});
