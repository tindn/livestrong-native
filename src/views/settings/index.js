import SettingsList from './settingsList';
import { StackNavigator } from 'react-navigation';
import DeviceInformation from './deviceInformation';
import DeviceData from './deviceData';
import BackedupData from './backedupData';

const SettingsView = StackNavigator({
	Settings: {
		screen: SettingsList,
		navigationOptions: {
			title: 'Settings'
		}
	},
	DeviceInformation: {
		screen: DeviceInformation,
		navigationOptions: {
			title: 'Device Information'
		}
	},
	DeviceData: {
		screen: DeviceData,
		navigationOptions: {
			title: 'Device Data'
		}
	},
	BackedupData: {
		screen: BackedupData,
		navigationOptions: {
			title: 'Backedup Data'
		}
	}
});

export default SettingsView;
