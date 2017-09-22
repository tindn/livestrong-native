import React from 'react';
import {
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
			data: '',
			backupStatus: [],
			refreshing: false
		};
		this._showData = this._showData.bind(this);
		this._clearData = this._clearData.bind(this);
		this._backupData = this._backupData.bind(this);
	}

	render() {
		let dataView = null;

		let backupStatusView = null;

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
								title: 'Backedup Data',
								component: BackedupData
							});
						}}
						title="Backedup Data"
						color="black"
					/>
				</View>
				<View style={ListStyles.listItem}>
					<Button onPress={this._reseedData} title="Reseed Data" />
				</View>
				<View style={ListStyles.listItem}>
					<Button onPress={this._backupData} title="Backup Data" />
				</View>
				{this.state.backupStatus.length > 0 ? (
					<View>
						<Text style={styles.backupStatusLabel}>Backup status:</Text>
						{this.state.backupStatus.map((status, index) => {
							return (
								<Text key={index} style={styles.backupStatus}>
									{status}
								</Text>
							);
						})}
						<TouchableHighlight
							onPress={() => {
								this.setState(prevState => {
									prevState.backupStatus = [];
									return prevState;
								});
							}}
						>
							<Text style={styles.clearBackupStatus}>Clear</Text>
						</TouchableHighlight>
					</View>
				) : null}
				{backupStatusView}
			</ScrollView>
		);
	}

	_showData() {
		localData.getAllData().then(
			function(data) {
				data = data
					.map(function(val) {
						let data = val[1];
						if (val[1][0] === '{' || val[1][0] === '[') {
							data = JSON.parse(val[1]);
						}
						return {
							key: val[0],
							value: data
						};
					})
					.sort(function(obj1, obj2) {
						if (obj1.key < obj2.key) {
							return -1;
						} else if (obj1.key > obj2.key) {
							return 1;
						}
						return 0;
					});
				this.setState({
					data: data
				});
			}.bind(this)
		);
	}

	_clearData() {
		this.setState({
			data: ''
		});
	}

	_reseedData() {
		localData.dangerouslyClearEverything().then(function() {
			return localData.seedData();
		});
	}

	_backupData() {
		let dataUrl = 'https://pixiecloud.herokuapp.com';
		let authToken = 'fd1bafdd-e8f0-4b66-8116-6a7383d2ea19';
		if (DeviceInfo.isEmulator()) {
			dataUrl = 'http://localhost:5000';
			authToken = 'b23de2b9-06c8-4f3f-bca0-2e798282ed5d';
		}
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
			.then(data => {
				body.localData = data;
				return fetch(dataUrl + '/livestrong/appdata', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: authToken
					},
					body: JSON.stringify(body)
				});
			})
			.then(
				function(result) {
					if (!result.ok) {
						throw result;
					}
					this.setState((prevState, props) => {
						let message = 'Backup succeeded.';
						if (result.status === 208) {
							message = 'This version has already been backed up.';
						}
						prevState.backupStatus.push(message);
						return prevState;
					});
				}.bind(this)
			)
			.catch(
				function(error) {
					if (error.json) {
						error.json().then(jsonError => {
							this.setState((prevState, props) => {
								prevState.backupStatus.push(
									`Backup failed - ${jsonError.name}: ${jsonError.message}.`
								);
								return prevState;
							});
						});
					} else {
						this.setState((prevState, props) => {
							prevState.backupStatus.push(`Backup failed.`);
							return prevState;
						});
					}
				}.bind(this)
			);
	}
}

const styles = StyleSheet.create({
	backupStatusLabel: {
		fontWeight: 'bold',
		textAlign: 'center',
		marginBottom: 10
	},
	backupStatus: {
		paddingLeft: 10,
		marginBottom: 5
	},
	clearBackupStatus: {
		color: '#007AFF',
		fontSize: 16,
		textAlign: 'center',
		marginTop: 10
	}
});
