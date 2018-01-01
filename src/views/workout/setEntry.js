import React from 'react';
import {
	Image,
	Picker,
	Text,
	TextInput,
	TouchableHighlight,
	View,
	StyleSheet
} from 'react-native';
import { iosBlue, borderGray, UnitTypes, successGreen } from '../../globals';
import getRepsInputs from '../../utils/repsInputs';
import getWeightInputs from '../../utils/weightInputs';

export default class SetEntry extends React.Component {
	constructor(props) {
		super(props);
		this.repsInputs = getRepsInputs(props.set.reps);
		this.weightInputs = getWeightInputs(props.set.weight);
	}
	render() {
		return (
			<View style={styles.mainView} key={this.props.setIndex}>
				<View style={styles.inputGroup}>
					<Text style={[styles.index, styles.readingFont]}>
						{this.props.setIndex + 1}.
					</Text>
					{this.props.set.completed ? (
						<Text style={[styles.readingFont, styles.repsText]}>
							{this.props.set.reps}
						</Text>
					) : (
						<Picker
							style={styles.repsPicker}
							itemStyle={{ height: 110 }}
							selectedValue={this.props.set.reps}
							onValueChange={reps => {
								this.props.updateSet(
									{ ...this.props.set, reps: reps },
									this.props.setIndex
								);
							}}
						>
							{this.repsInputs.map(input => (
								<Picker.Item
									key={input}
									label={input.toString()}
									value={input}
								/>
							))}
						</Picker>
					)}
					<Text style={[styles.readingFont]}>reps at</Text>
					{this.props.set.completed ? (
						<Text style={[styles.readingFont, styles.weightText]}>
							{this.props.set.weight}
						</Text>
					) : (
						<Picker
							style={styles.weightPicker}
							itemStyle={{ height: 110 }}
							selectedValue={this.props.set.weight}
							onValueChange={weight => {
								this.props.updateSet(
									{ ...this.props.set, weight: weight },
									this.props.setIndex
								);
							}}
						>
							{this.weightInputs.map(input => (
								<Picker.Item
									key={input}
									label={input.toString()}
									value={input}
								/>
							))}
						</Picker>
					)}
					{this.props.set.completed ? (
						<Text style={[styles.readingFont, { width: 50 }]}>
							{this.props.set.weightUnit}
						</Text>
					) : (
						<Picker
							style={{ width: 50 }}
							itemStyle={{ height: 110 }}
							selectedValue={this.props.set.weightUnit}
							onValueChange={(itemValue, itemIndex) => {
								this.props.updateSet(
									{ ...this.props.set, weightUnit: itemValue },
									this.props.setIndex
								);
							}}
						>
							{UnitTypes.map((type, index) => (
								<Picker.Item key={index} label={type.name} value={type._id} />
							))}
						</Picker>
					)}
				</View>
				<View style={styles.iconGroup}>
					{this.props.set.completed ? (
						<View style={{ flexDirection: 'row' }}>
							<TouchableHighlight
								onPress={() => {
									this.props.updateSet(
										{ ...this.props.set, completed: false },
										this.props.setIndex
									);
								}}
								underlayColor="#ddd"
							>
								<Image
									source={require('../../../assets/pencil.png')}
									style={[styles.actionIcon, styles.editIcon]}
								/>
							</TouchableHighlight>
							<TouchableHighlight
								onPress={() => {
									this.props.removeSet(this.props.setIndex);
								}}
								underlayColor="#ddd"
							>
								<Image
									source={require('../../../assets/close.png')}
									style={[styles.actionIcon, styles.removeIcon]}
								/>
							</TouchableHighlight>
						</View>
					) : (
						<TouchableHighlight
							onPress={() => {
								this.props.updateSet(
									{ ...this.props.set, completed: true },
									this.props.setIndex
								);
							}}
							underlayColor="#ddd"
							style={{
								alignItems: 'center',
								marginTop: 35
							}}
						>
							<Image
								source={require('../../../assets/check.png')}
								style={[styles.actionIcon, styles.completeIcon]}
							/>
						</TouchableHighlight>
					)}
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	mainView: {
		flexDirection: 'row',
		paddingLeft: 10,
		paddingRight: 10,
		marginTop: 5,
		borderColor: borderGray,
		borderTopWidth: 0.5,
		justifyContent: 'space-between'
	},
	readingFont: {
		fontSize: 18
	},
	inputGroup: {
		flexDirection: 'row',
		flex: 8,
		alignItems: 'center',
		justifyContent: 'space-between'
	},
	index: {
		marginRight: 5
	},
	repsText: {
		width: 25,
		textAlign: 'center'
	},
	repsPicker: {
		width: 50
	},
	weightText: {
		width: 70,
		textAlign: 'center'
	},
	weightPicker: {
		width: 80
	},
	iconGroup: {
		flexDirection: 'column',
		flex: 3
	},
	actionIcon: {
		width: 15,
		height: 15,
		marginTop: 10,
		marginBottom: 10,
		marginLeft: 15,
		marginRight: 15
	},
	removeIcon: {
		tintColor: 'red'
	},
	editIcon: {
		tintColor: iosBlue
	},
	completeIcon: {
		tintColor: successGreen,
		width: 17,
		height: 17
	}
});
