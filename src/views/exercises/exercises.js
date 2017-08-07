import React from 'react';
import {
	H1,
	ListItem,
	ListView,
	NavigatorIOS,
	SectionList,
	StyleSheet,
	Text,
	TouchableHighlight,
	View
} from 'react-native';
import Exercise from './exercise';
import localData from '../../utils/localData';
import { sortByDisplayName } from '../../utils/sorts';

export default class ExercisesView extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<NavigatorIOS
				ref="nav"
				initialRoute={{
					component: ExerciseList,
					title: 'Exercises',
					rightButtonTitle: 'New',
					onRightButtonPress: () => this._newExerciseButtonPressed()
				}}
				style={styles.exercisesView}
			/>
		);
	}

	_newExerciseButtonPressed() {
		this.refs.nav.push({
			component: Exercise,
			title: 'New Exercise'
		});
	}
}

class ExerciseList extends React.Component {
	constructor(props) {
		super(props);
		this.ds = new ListView.DataSource({
			rowHasChanged: (r1, r2) => r1 !== r2
		});
		this.state = {
			exercises: [],
			listViewDataSource: this.ds.cloneWithRows([])
		};
		this._exercisePressed = this._exercisePressed.bind(this);
	}

	_updateList() {
		localData.getAllExercises().then(exercises => {
			let sortedExercises = exercises.sort(sortByDisplayName);
			this.setState(prevState => {
				prevState.exercises = exercises;
				prevState.listViewDataSource = this.ds.cloneWithRows(sortedExercises);
				return prevState;
			});
		});
	}

	componentDidMount() {
		this._updateList();
	}

	componentWillReceiveProps() {
		this._updateList();
	}

	render() {
		return (
			<ListView
				dataSource={this.state.listViewDataSource}
				renderRow={exercise => this.renderExercise(exercise)}
				contentInset={{ bottom: 49 }}
				enableEmptySections={true}
			/>
		);
	}

	renderExercise(exercise) {
		return (
			<TouchableHighlight
				onPress={() => this._exercisePressed(exercise)}
				underlayColor="#e2e2e2"
			>
				<View style={styles.exercise}>
					<Text style={styles.title}>
						{exercise.displayName}
					</Text>
				</View>
			</TouchableHighlight>
		);
	}

	_exercisePressed(exercise) {
		this.props.navigator.push({
			title: exercise.displayName,
			component: Exercise,
			passProps: {
				exercise: exercise
			},
			onLeftButtonPress: () => {
				this.props.navigator.pop();
			},
			leftButtonTitle: '< Back'
		});
	}
}

const styles = StyleSheet.create({
	exercisesView: {
		flex: 1
	},
	exercise: {
		borderBottomColor: '#B5B9C2',
		borderBottomWidth: 0.5,
		paddingLeft: 7,
		paddingBottom: 12,
		paddingTop: 15,
		marginLeft: 10
	},
	title: {
		fontSize: 16,
		// color: '#4B4C4B',
		marginBottom: 5
	}
});
