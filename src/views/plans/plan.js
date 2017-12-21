import React from 'react';
import {
	Alert,
	View,
	Text,
	StyleSheet,
	TextInput,
	Button,
	ActionSheetIOS,
	ScrollView
} from 'react-native';
import localData from '../../utils/localData';
import Day from './day';
import TextInputGroup from '../shared/textinputgroup';
import { TextInputGroupStyles, ActionButtonsStyles } from '../../styles';

export default class Plan extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			plan: props.plan ? props.plan : { name: '', days: [] }
		};
		this._updateName = this._updateName.bind(this);
		this._updateDay = this._updateDay.bind(this);
		this._updateExercise = this._updateExercise.bind(this);
		this._deleteExercise = this._deleteExercise.bind(this);
		this._savePlan = this._savePlan.bind(this);
		this._deletePlan = this._deletePlan.bind(this);
		this._addDay = this._addDay.bind(this);
		this._removeDay = this._removeDay.bind(this);
		this._createPlan = this._createPlan.bind(this);
	}

	render() {
		return (
			<ScrollView
				style={styles.planView}
				automaticallyAdjustContentInsets={true}
				keyboardDismissMode="on-drag"
			>
				<View style={TextInputGroupStyles.group}>
					<TextInputGroup
						labelText="Name"
						inputValue={this.state.plan.displayName}
						onChangeText={this._updateName}
						placeholderText="Fail to plan, and you are planning to fail!"
					/>
				</View>
				<View>{this._renderDays(this.state.plan.days)}</View>
				<View style={ActionButtonsStyles.group}>
					<View style={ActionButtonsStyles.button}>
						<Button title="Add Day" onPress={this._addDay} />
					</View>
					{this.state.plan.id === undefined ? (
						<View style={ActionButtonsStyles.lastButton}>
							<Button title="Create Plan" onPress={this._createPlan} />
						</View>
					) : (
						<View style={ActionButtonsStyles.lastButton}>
							<Button
								title="Delete Plan"
								onPress={this._deletePlan}
								color="red"
							/>
						</View>
					)}
				</View>
			</ScrollView>
		);
	}

	_renderDays(days) {
		if (!days) {
			return;
		}
		return days.map(
			function(day, index) {
				return (
					<Day
						key={index}
						dayIndex={index}
						day={day}
						updateDay={this._updateDay}
						updateExercise={this._updateExercise}
						deleteExercise={this._deleteExercise}
						removeDay={this._removeDay}
					/>
				);
			}.bind(this)
		);
	}

	_updateName(name) {
		if (name === '') {
			return;
		}
		if (name.trim() === '') {
			Alert.alert('', 'Name cannot start with space', [{ text: 'Ok' }], {
				cancelable: false
			});
			return;
		}
		this.setState(prevState => {
			prevState.plan.displayName = name;
			if (prevState.plan.id === undefined) {
				prevState.plan.name = name.toLowerCase().replace(/\s/g, '_');
			}
			return prevState;
		}, this._savePlan);
	}

	_updateDay(day, dayIndex) {
		this.setState(prevState => {
			prevState.plan.days[dayIndex] = day;
			return prevState;
		}, this._savePlan);
	}

	_updateExercise(exercise, exerciseIndex, dayIndex) {
		this.setState(prevState => {
			prevState.plan.days[dayIndex].exercises[exerciseIndex] = exercise;
			return prevState;
		}, this._savePlan);
	}

	_deleteExercise(exerciseIndex, dayIndex) {
		this.setState(prevState => {
			prevState.plan.days[dayIndex].exercises.splice(exerciseIndex, 1);
			return prevState;
		}, this._savePlan);
	}

	_savePlan() {
		if (this.state.plan.id !== undefined) {
			localData.savePlan(this.state.plan);
		}
	}

	_createPlan() {
		localData.savePlan(this.state.plan);
		this.props.navigator.pop();
	}

	_deletePlan() {
		ActionSheetIOS.showActionSheetWithOptions(
			{
				message: 'Are you sure you want to delete this plan?',
				options: ['Delete', 'Cancel'],
				destructiveButtonIndex: 0,
				cancelButtonIndex: 1
			},
			buttonIndex => {
				if (buttonIndex === 0) {
					localData.deletePlan(this.state.plan);
					this.props.navigator.pop();
				}
			}
		);
	}

	_addDay() {
		this.setState((prevState, props) => {
			prevState.plan.days.push({
				exercises: []
			});
			return prevState;
		});
	}

	_removeDay(dayIndex) {
		this.setState((prevState, props) => {
			prevState.plan.days.splice(dayIndex, 1);
			return prevState;
		});
	}
}

const styles = StyleSheet.create({
	planView: {
		flex: 1
	}
});
