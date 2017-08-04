import React from 'react';
import { View, Text, Button, ScrollView } from 'react-native';
import localData from '../../utils/localData';
import DeviceInfo from 'react-native-device-info';

export default class SettingsView extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			data: '',
			backupStatus: []
		};
		this._showData = this._showData.bind(this);
		this._clearData = this._clearData.bind(this);
		this._backupData = this._backupData.bind(this);
	}

	render() {
		let dataView = null;
		if (this.state.data !== '') {
			dataView = this.state.data.map(function(obj, index) {
				return (
					<View
						key={index}
						style={{
							paddingTop: 10,
							paddingBottom: 10,
							paddingLeft: 10,
							paddingRight: 5,
							borderBottomColor: '#B5B9C2',
							borderBottomWidth: 0.5
						}}
					>
						<Text
							style={{
								fontWeight: 'bold'
							}}
						>
							{obj.key}
						</Text>
						<Text
							style={{
								paddingTop: 5
							}}
						>
							{JSON.stringify(obj.value)}
						</Text>
					</View>
				);
			});
		}

		let backupStatusView = null;
		if (this.state.backupStatus.length > 0) {
			backupStatusView = (
				<View>
					<Text>Backup status:</Text>
					{this.state.backupStatus.map((status, index) => {
						return (
							<Text key={index}>
								{status}
							</Text>
						);
					})}
				</View>
			);
		}
		return (
			<ScrollView style={{ flex: 1, marginTop: 65 }}>
				<Text>
					UniqueId: {DeviceInfo.getUniqueID()}
				</Text>
				<Text>
					{DeviceInfo.isEmulator() ? 'Emulator' : 'Physical Device'}
				</Text>
				<Button onPress={this._reseedData} title="Reseed Data" />
				<Button onPress={this._showData} title="Show Data" />
				<Button onPress={this._clearData} title="Clear Data" />
				{dataView}
				<Button onPress={this._backupData} title="Backup Data" />
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
						console.log(error);
						this.setState((prevState, props) => {
							prevState.backupStatus.push(`Backup failed.`);
							return prevState;
						});
					}
				}.bind(this)
			);
	}
}
