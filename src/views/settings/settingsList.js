import React from 'react';
import { Alert, Button, ScrollView, View, StyleSheet } from 'react-native';
import firebase from '../../firebase';
import DeviceInfo from 'react-native-device-info';
import { ListStyles } from '../../styles';
import localData from '../../utils/localData';
import PropTypes from 'prop-types';

export default class Settings extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			backupStatus: [],
			refreshing: false
		};
		this._backupData = this._backupData.bind(this);
		this._backupDataRef = firebase
			.database()
			.ref()
			.child(
				`backup/${DeviceInfo.getUniqueID()
					.split('-')
					.join('')}`
			);
	}

	render() {
		return (
			<ScrollView style={styles.container}>
				<View style={ListStyles.listItem}>
					<Button
						onPress={() => {
							this.props.navigation.push('DeviceInformation');
						}}
						title="Device Information"
						color="black"
					/>
				</View>
				<View style={ListStyles.listItem}>
					<Button
						onPress={() => {
							this.props.navigation.push('DeviceData');
						}}
						title="Device Data"
						color="black"
					/>
				</View>
				<View style={ListStyles.listItem}>
					<Button
						onPress={() => {
							this.props.navigation.push('BackedupData');
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
		Alert.alert('', 'Are you sure you want to backup data?', [
			{
				text: 'Cancel',
				style: 'cancel'
			},
			{
				text: 'Backup',
				onPress: () => {
					getLocalDataForBackup().then(
						(localData => {
							this._backupDataRef.push(localData);
						}).bind(this)
					);
				}
			}
		]);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column'
	}
});

const getLocalDataForBackup = () => {
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
	return localData
		.getItem('lastUpdated')
		.then(lastUpdated => {
			body.lastUpdated = lastUpdated;
		})
		.then(() => {
			return localData.getAllData();
		})
		.then(function(data) {
			body.localData = data;
			return body;
		});
};

Settings.propTypes = {
	navigation: PropTypes.object
};
