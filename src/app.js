import { TabNavigator } from 'react-navigation';
import Exercises from './views/exercises';
import Plans from './views/plans';
import Workout from './views/workout';
import Workouts from './views/workouts';
import Settings from './views/settings';
import { getTabBarIcon } from './Icon';

export default TabNavigator({
	Exercises: {
		screen: Exercises,
		navigationOptions: {
			tabBarIcon: getTabBarIcon(require('../assets/list.png'))
		}
	},
	Plans: {
		screen: Plans,
		navigationOptions: {
			tabBarIcon: getTabBarIcon(require('../assets/calendar.png'))
		}
	},
	Workout: {
		screen: Workout,
		navigationOptions: {
			tabBarIcon: getTabBarIcon(require('../assets/play.png'))
		}
	},
	Workouts: {
		screen: Workouts,
		navigationOptions: {
			title: 'Logs',
			tabBarIcon: getTabBarIcon(require('../assets/chart.png'))
		}
	},
	Settings: {
		screen: Settings,
		navigationOptions: {
			title: 'Settings',
			tabBarIcon: getTabBarIcon(require('../assets/gear.png'))
		}
	}
});
