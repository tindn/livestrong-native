import React from 'react';
import {
	View,
	ListView,
	StyleSheet,
	Text,
	TouchableHighlight,
	NavigatorIOS
} from 'react-native';
import localData from '../../utils/localData';
import Plan from './plan';
import { sortByDisplayName } from '../../utils/sorts';

export default class PlansView extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<NavigatorIOS
				ref="nav"
				initialRoute={{
					component: PlanList,
					title: 'Workout Plans',
					rightButtonTitle: 'New',
					onRightButtonPress: () => this._newPlanButtonPressed()
				}}
				style={styles.plansView}
			/>
		);
	}

	_newPlanButtonPressed() {
		this.refs.nav.push({
			component: Plan,
			title: 'New Workout Plan'
		});
	}
}

class PlanList extends React.Component {
	constructor(props) {
		super(props);
		this.ds = new ListView.DataSource({
			rowHasChanged: (r1, r2) => r1 !== r2
		});
		this.state = {
			dataSource: this.ds.cloneWithRows([])
		};
		this._planPressed = this._planPressed.bind(this);
	}

	_updateList() {
		localData.getAllPlans().then(plans => {
			plans = plans.sort(sortByDisplayName);
			this.setState({
				dataSource: this.ds.cloneWithRows(plans)
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
				dataSource={this.state.dataSource}
				renderRow={plan => this.renderPlan(plan)}
				contentInset={{ bottom: 49 }}
				enableEmptySections={true}
			/>
		);
	}

	renderPlan(plan) {
		return (
			<TouchableHighlight
				onPress={() => this._planPressed(plan)}
				underlayColor="#e2e2e2"
			>
				<View style={styles.plan}>
					<Text style={styles.title}>
						{plan.displayName}
					</Text>
				</View>
			</TouchableHighlight>
		);
	}

	_planPressed(plan) {
		this.props.navigator.push({
			title: plan.displayName,
			component: Plan,
			passProps: {
				plan: plan
			},
			onLeftButtonPress: () => {
				this.props.navigator.pop();
			},
			leftButtonTitle: '< Back'
		});
	}
}

const styles = StyleSheet.create({
	plansView: {
		flex: 1
	},
	plan: {
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
