import React from 'react';
import {
	View,
	Text,
	TextInput,
	Button,
	StyleSheet,
	ActionSheetIOS,
	Alert
} from 'react-native';
import localData from '../../utils/localData';
import TextInputGroup from '../shared/textinputgroup';

export default class Exercise extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			exercise: props.exercise ? props.exercise : { name: '' }
		};
		this._updateName = this._updateName.bind(this);
		this._updateExercise = this._updateExercise.bind(this);
		this._deleteExercise = this._deleteExercise.bind(this);
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
		localData.saveExercise(this.state.exercise);
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

	render() {
		return (
			<View style={styles.exerciseView}>
				<View style={styles.nameInput}>
					<TextInputGroup
						labelText="Name"
						inputValue={this.state.exercise.displayName}
						onChangeText={this._updateName}
						placeholderText="Run Forest, Run"
						autoFocus={true}
					/>
				</View>
				<View style={styles.divider} />
				<View>
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
	},
	nameInput: {
		marginTop: 10,
		marginBottom: 40
	},
	divider: {
		marginLeft: 20,
		marginRight: 20,
		borderColor: '#B5B9C2',
		borderBottomWidth: 0.4,
		marginBottom: 20
	}
});
