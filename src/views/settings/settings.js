import React from 'react';
import {
	ActionSheetIOS,
	Button,
	FlatList,
	NavigatorIOS,
	ScrollView,
	StyleSheet,
	Text,
	TouchableHighlight,
	View
} from 'react-native';
import localData from '../../utils/localData';
import DeviceInfo from 'react-native-device-info';
import DeviceInformation from './deviceInformation';
import DeviceData from './deviceData';
import BackedupData from './backedupData';
import { ListStyles } from '../../styles';
import { iosBlue } from '../../globals';
import firebase from 'firebase';

export default class SettingsView extends React.Component {
	render() {
		return (
			<NavigatorIOS
				ref="nav"
				initialRoute={{
					component: Settings,
					title: 'Settings'
				}}
				style={ListStyles.listView}
			/>
		);
	}
}

class Settings extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			backupStatus: [],
			refreshing: false
		};
		this._backupData = this._backupData.bind(this);
		const firebaseConfig = {
			apiKey: 'AIzaSyADkMtF8ghoUNJWHAQJRg8DkA0bXmQfWSQ',
			authDomain: 'livestrong-native.firebaseapp.com',
			databaseURL: 'https://livestrong-native.firebaseio.com',
			projectId: 'livestrong-native',
			storageBucket: 'livestrong-native.appspot.com',
			messagingSenderId: '804834349247'
		};

		this._firebaseApp = firebase.initializeApp(firebaseConfig);
		this._backupDataRef = this._firebaseApp
			.database()
			.ref()
			.child(
				`backup/${DeviceInfo.getUniqueID()
					.split('-')
					.join('')}`
			);
	}

	render() {
		let dataView = null;

		return (
			<ScrollView style={{ flex: 1 }}>
				<View style={ListStyles.listItem}>
					<Button
						onPress={() => {
							this.props.navigator.push({
								title: 'Device Information',
								component: DeviceInformation
							});
						}}
						title="Device Information"
						color="black"
					/>
				</View>
				<View style={ListStyles.listItem}>
					<Button
						onPress={() => {
							this.props.navigator.push({
								title: 'Device Data',
								component: DeviceData
							});
						}}
						title="Device Data"
						color="black"
					/>
				</View>
				<View style={ListStyles.listItem}>
					<Button
						onPress={() => {
							this.props.navigator.push({
								title: 'Backups',
								component: BackedupData,
								passProps: { _backupDataRef: this._backupDataRef }
							});
						}}
						title="Backups"
						color="black"
					/>
				</View>
				<View style={ListStyles.listItem}>
					<Button onPress={this._backupData} title="Backup Data" />
				</View>
			</ScrollView>
		);
	}

	_backupData() {
		ActionSheetIOS.showActionSheetWithOptions(
			{
				message: 'Are you sure you want to backup data?',
				options: ['Backup', 'Cancel'],
				cancelButtonIndex: 1
			},
			function(buttonIndex) {
				if (buttonIndex === 0) {
					let body = {
						deviceUniqueId: DeviceInfo.getUniqueID(),
						brand: DeviceInfo.getBrand(),
						model: DeviceInfo.getModel(),
						deviceId: DeviceInfo.getDeviceId(),
						system: DeviceInfo.getSystemName(),
						systemVersion: DeviceInfo.getSystemVersion(),
						bundleId: DeviceInfo.getBundleId(),
						buildNumber: DeviceInfo.getBuildNumber(),
						appVersion: DeviceInfo.getVersion(),
						deviceName: DeviceInfo.getDeviceName(),
						userAgent: DeviceInfo.getUserAgent(),
						deviceLocale: DeviceInfo.getDeviceLocale(),
						deviceCountry: DeviceInfo.getDeviceCountry(),
						timezone: DeviceInfo.getTimezone(),
						exportedTimestamp: new Date().getTime()
					};
					localData
						.getItem('lastUpdated')
						.then(lastUpdated => {
							body.lastUpdated = lastUpdated;
						})
						.then(() => {
							return localData.getAllData();
						})
						.then(
							function(data) {
								body.localData = data;
								this._backupDataRef.push(body);
							}.bind(this)
						);
				}
			}.bind(this)
		);
	}
}
