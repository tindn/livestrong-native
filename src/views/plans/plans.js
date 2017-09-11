import React from 'react';
import {
	ListView,
	FlatList,
	NavigatorIOS,
	StyleSheet,
	Text,
	TouchableHighlight,
	View
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
		this.state = {
			allPlans: [],
			refreshing: false
		};
		this._planPressed = this._planPressed.bind(this);
	}

	_updateList() {
		this.setState({ refreshing: true });
		localData.getAllPlans().then(plans => {
			plans = plans.map((plan, index) => {
				plan.key = index;
				return plan;
			});
			plans = plans.sort(sortByDisplayName);
			this.setState(prevState => {
				prevState.allPlans = plans;
				prevState.refreshing = false;
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
			<FlatList
				data={this.state.allPlans}
				renderItem={({ item }) => this.renderPlan(item)}
				refreshing={this.state.refreshing}
				onRefresh={this._updateList.bind(this)}
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
		paddingBottom: 15,
		paddingTop: 20,
		marginLeft: 10
	},
	title: {
		fontSize: 18,
		// color: '#4B4C4B',
		marginBottom: 5
	}
});
